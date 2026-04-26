const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const socketAuthMiddleware = require('../middleware/socketAuth');

module.exports = (io) => {
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    // User joins a conversation room
    socket.on('join_conversation', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }

        // Validate user is a participant before joining
        if (conversation.user1_id.toString() !== socket.userId && 
            conversation.user2_id.toString() !== socket.userId) {
          return socket.emit('error', { message: 'Unauthorized access to conversation' });
        }

        socket.join(`conv_${conversationId}`);
      } catch (err) {
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // User sends a message
    socket.on('send_message', async ({ conversationId, message }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit('error', { message: 'Conversation not found' });
        }

        // 1. Validate user is participant of this conversation
        if (conversation.user1_id.toString() !== socket.userId && 
            conversation.user2_id.toString() !== socket.userId) {
          return socket.emit('error', { message: 'Unauthorized' });
        }

        // 2. Save Message to MongoDB
        const newMessage = new Message({
          conversation_id: conversationId,
          sender_id: socket.userId,
          message: message
        });
        const savedMessage = await newMessage.save();

        // 3. Update Conversation.updated_at
        conversation.updated_at = Date.now();
        await conversation.save();

        // 4. Emit to room — both sender and recipient receive it
        io.to(`conv_${conversationId}`).emit('new_message', savedMessage);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conv_${conversationId}`);
    });
  });
};
