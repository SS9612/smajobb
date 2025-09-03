import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { messagesApi, ConversationSummary, ChatMessage } from '../services/messagesApi';
import { messagesHub } from '../services/messagesHub';

const Messages: React.FC = () => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const conv = await messagesApi.getConversations(1, 50);
      setConversations(conv);
      if (conv.length > 0) setSelectedUserId(conv[0].otherUserId);
      setLoading(false);
    };
    load();
    // start hub
    messagesHub.start({
      messageReceived: (msg: ChatMessage) => {
        if (selectedUserId && msg.senderId === selectedUserId) {
          setMessages(prev => [...prev, msg]);
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
        }
        // refresh conversations (unread counters, last message)
        messagesApi.getConversations(1, 50).then(setConversations);
      },
      messageSent: (msg: ChatMessage) => {
        if (msg.receiverId === selectedUserId || msg.senderId === authUser.id) {
          setMessages(prev => [...prev, msg]);
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
        }
        messagesApi.getConversations(1, 50).then(setConversations);
      }
    });

    return () => {
      messagesHub.stop();
    };
  }, [authLoading, authUser, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId) return;
    const load = async () => {
      const msgs = await messagesApi.getMessagesWithUser(selectedUserId, 1, 50);
      setMessages(msgs);
      // mark conversation as read
      await messagesApi.markConversationAsRead(selectedUserId);
      // scroll to bottom
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    };
    load();
  }, [selectedUserId]);

  const partner = useMemo(
    () => conversations.find(c => c.otherUserId === selectedUserId),
    [conversations, selectedUserId]
  );

  const handleSend = async () => {
    if (!selectedUserId || !input.trim()) return;
    try {
      setSending(true);
      const created = await messagesApi.sendMessage({ receiverId: selectedUserId, content: input.trim() });
      setMessages(prev => [...prev, created]);
      setInput('');
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">Laddar meddelanden...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">Du måste vara inloggad för att se meddelanden.</div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <aside className="dashboard-sidebar">
            <h2>Konversationer</h2>
            <div className="conversation-list">
              {conversations.map(conv => (
                <button
                  key={conv.otherUserId}
                  onClick={() => setSelectedUserId(conv.otherUserId)}
                  className={`conversation-item ${selectedUserId === conv.otherUserId ? 'active' : ''}`}
                >
                  <div className="conversation-title">{conv.otherUserDisplayName}</div>
                  <div className="conversation-subtitle">{conv.lastMessage}</div>
                  {conv.unreadCount > 0 && <span className="badge">{conv.unreadCount}</span>}
                </button>
              ))}
              {conversations.length === 0 && <div>Inga konversationer ännu.</div>}
            </div>
          </aside>

          <section className="dashboard-main">
            {selectedUserId ? (
              <div className="chat-window">
                <div className="chat-header">
                  <h3>{partner?.otherUserDisplayName || 'Konversation'}</h3>
                </div>
                <div className="chat-messages">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`chat-message ${msg.senderId === authUser.id ? 'outgoing' : 'incoming'}`}
                    >
                      <div className="message-content">{msg.content}</div>
                      <div className="message-meta">{new Date(msg.createdAt).toLocaleString('sv-SE')}</div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Skriv ett meddelande..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button onClick={handleSend} disabled={sending || !input.trim()} className="btn btn-primary">
                    Skicka
                  </button>
                </div>
              </div>
            ) : (
              <div className="dashboard-placeholder">
                <div className="placeholder-icon">💬</div>
                <h3>Välj en konversation</h3>
                <p>Välj en kontakt för att börja chatta</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;


