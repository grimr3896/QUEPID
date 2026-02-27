import React, { useState } from 'react';
import { useStore, Conversation } from '@/store';
import { HexAvatar } from '@/components/ui/HexAvatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Search, Plus, UserPlus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function ChatList() {
  const { conversations, currentUser, setActiveConversation, acceptRequest, declineRequest } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter conversations based on search
  const filteredConversations = conversations.filter(c => {
    // If only 1 participant, it's a self-chat. Otherwise find the other person.
    const otherParticipant = c.participants.length === 1 
      ? c.participants[0] 
      : c.participants.find(p => p.id !== currentUser?.id);
      
    return otherParticipant?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Separate Active Chats vs Requests
  const activeChats = filteredConversations.filter(c => c.isAccepted);
  const pendingRequests = filteredConversations.filter(c => !c.isAccepted && c.messages.length > 0 && c.messages[0].senderId !== currentUser?.id);

  const handleSelectChat = (id: string) => {
    setActiveConversation(id);
    navigate(`/chats/${id}`);
  };

  const handleAccept = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    if (conversation.requestId) {
      acceptRequest(conversation.requestId);
    }
  };

  const handleDecline = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();
    if (conversation.requestId) {
      declineRequest(conversation.requestId);
    }
  };

  return (
    <div className="flex flex-col h-full w-full border-r border-white/5 bg-bg-primary/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold tracking-wider text-white">
            TRANSMISSIONS
          </h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <Input 
            placeholder="SEARCH FREQUENCY..." 
            className="pl-9 bg-bg-secondary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Active Chats */}
        {activeChats.map((conversation) => {
          const otherParticipant = conversation.participants.length === 1 
            ? conversation.participants[0] 
            : conversation.participants.find(p => p.id !== currentUser?.id);
            
          if (!otherParticipant) return null;
          
          const isSelf = conversation.participants.length === 1;

          return (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              onClick={() => handleSelectChat(conversation.id)}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-white/5 group"
            >
              <HexAvatar 
                src={otherParticipant.avatarUrl} 
                alt={otherParticipant.displayName} 
                status={otherParticipant.status}
                size="md"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-medium text-text-primary tracking-wide truncate">
                    {isSelf ? 'Note to Self' : otherParticipant.displayName}
                  </span>
                  {conversation.lastMessage && (
                    <span className="text-[10px] font-mono text-text-secondary">
                      {format(conversation.lastMessage.timestamp, 'HH:mm')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-text-secondary truncate font-body opacity-80 group-hover:text-text-primary transition-colors">
                    {conversation.lastMessage?.content || 'No messages'}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-cyan text-bg-primary text-[10px] font-bold">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Message Requests Divider */}
        {pendingRequests.length > 0 && (
          <div className="pt-6 pb-2 px-2">
            <div className="flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
              <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest">Message Requests</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
            </div>
          </div>
        )}

        {/* Pending Requests */}
        <AnimatePresence>
          {pendingRequests.map((conversation) => {
            const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);
            if (!otherParticipant) return null;

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                onClick={() => handleSelectChat(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <HexAvatar 
                    src={otherParticipant.avatarUrl} 
                    alt={otherParticipant.displayName} 
                    status="offline" // Dim status for requests
                    size="md"
                    className="opacity-80 grayscale-[0.5]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-medium text-text-primary tracking-wide truncate opacity-90">
                        {otherParticipant.displayName}
                      </span>
                      <span className="text-[10px] font-mono text-text-secondary">
                        {format(conversation.messages[0].timestamp, 'MMM d')}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate font-body italic">
                      "{conversation.messages[0].content}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 h-8 text-xs border-white/10 hover:bg-white/10"
                    onClick={(e) => handleDecline(e, conversation)}
                  >
                    Ignore
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    glow
                    className="flex-1 h-8 text-xs"
                    onClick={(e) => handleAccept(e, conversation)}
                  >
                    Accept
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
