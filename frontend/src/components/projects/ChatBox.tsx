'use client';

import React, { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/ui/Avatar';
import { formatTime } from '@/lib/utils';
import { Send } from 'lucide-react';
import type { Message, Conversation } from '@/types';
import { getSocket } from '@/lib/socket';


interface ChatBoxProps {
  projectId: string;
  otherUserId: string;
  otherUsername: string;
}

export default function ChatBox({ projectId, otherUserId, otherUsername }: ChatBoxProps) {
  const { user } = useAuthStore();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  // Get or create conversation
  useEffect(() => {
    if (!otherUserId) return;
    const getConversation = async () => {
      try {
        const res = await api.post('/conversations', {
          to_user_id: otherUserId,
          project_id: projectId,
        });
        // Unwrap { success, data: conversation } envelope
        const conv = res.data?.data ?? res.data;
        setConversation(conv);
      } catch {}
    };
    getConversation();
  }, [projectId, otherUserId]);

  // Socket.io integration
  useEffect(() => {
    if (!conversation?._id) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('pw_token') || '' : '';
    const socket = getSocket(token);

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversation._id}`);
        const payload = res.data?.data ?? res.data;
        setMessages(Array.isArray(payload) ? payload : []);
      } catch {}
    };

    fetchMessages();

    // Join room
    socket.emit('join_conversation', conversation._id);

    // Listen for new messages
    socket.on('new_message', (message: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socket.emit('leave_conversation', conversation._id);
      socket.off('new_message');
    };
  }, [conversation?._id]);


  // Auto-scroll on new messages
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation?._id || sending) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage(''); // clear input immediately for UX

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('pw_token') || '' : '';
      const socket = getSocket(token);

      socket.emit('send_message', {
        conversationId: conversation._id,
        message: text,
      });
    } catch {
      // On error restore the text
      setNewMessage(text);
    }
    setSending(false);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[420px]">
      <h3
        className="text-sm font-semibold mb-3 pb-3"
        style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}
      >
        Chat con <span className="text-white">{otherUsername}</span>
      </h3>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-0">
        {messages.length === 0 && (
          <p className="text-xs text-center py-8" style={{ color: 'var(--text-3)' }}>
            Sin mensajes aún. Inicia la conversación.
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === user?._id;
          return (
            <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-end gap-2 max-w-[78%]">
                {!isOwn && <Avatar name={otherUsername} size="sm" />}
                <div
                  className="px-3.5 py-2 text-sm rounded-2xl"
                  style={isOwn ? {
                    background: 'linear-gradient(135deg, #2185D5, #818cf8)',
                    color: '#fff',
                    borderBottomRightRadius: '4px',
                  } : {
                    background: 'var(--surface-2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderBottomLeftRadius: '4px',
                  }}
                >
                  <p>{msg.message}</p>
                  <p className="text-[10px] mt-1 opacity-60">{formatTime(msg.created_at)}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEnd} />
      </div>

      {/* Input row */}
      <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje…"
          disabled={!conversation?._id}
          className="flex-1 rounded-xl px-3.5 py-2 text-sm outline-none transition-all duration-150"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim() || !conversation?._id}
          className="px-3.5 py-2 rounded-xl transition-all duration-150 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #2185D5, #818cf8)', color: '#fff' }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
