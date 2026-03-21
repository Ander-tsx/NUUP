'use client';

import React, { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/ui/Avatar';
import { formatTime } from '@/lib/utils';
import { Send } from 'lucide-react';
import type { Message, Conversation } from '@/types';

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
    const getConversation = async () => {
      try {
        const res = await api.post('/conversations', {
          to_user_id: otherUserId,
          project_id: projectId,
        });
        setConversation(res.data);
      } catch {}
    };
    getConversation();
  }, [projectId, otherUserId]);

  // Poll messages
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${conversation._id}`);
        setMessages(res.data);
      } catch {}
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversation]);

  // Auto-scroll
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;
    setSending(true);
    try {
      await api.post('/messages', {
        conversation_id: conversation._id,
        message: newMessage,
      });
      setNewMessage('');
      // Refresh immediately
      const res = await api.get(`/messages/${conversation._id}`);
      setMessages(res.data);
    } catch {}
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[400px]">
      <h3 className="text-base font-semibold text-zinc-900 mb-3">Chat con {otherUsername}</h3>

      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === user?._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[75%]">
                {!isOwn && <Avatar name={otherUsername} size="sm" />}
                <div
                  className={`px-3 py-2 text-sm ${
                    isOwn
                      ? 'bg-zinc-900 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-zinc-100 text-zinc-900 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/40' : 'text-zinc-400'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEnd} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-zinc-200 bg-white rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all duration-150"
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="px-3 py-2 bg-zinc-900 text-white rounded-lg hover:bg-[#81DA47] hover:text-zinc-900 transition-all duration-150 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
