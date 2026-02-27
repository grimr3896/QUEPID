import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, Message } from '@/store';
import { HexAvatar } from '@/components/ui/HexAvatar';
import { Button } from '@/components/ui/Button';
import { MessageBubble } from '@/components/MessageBubble';
import { ArrowLeft, Send, Paperclip, MoreVertical, Shield, Clock, Flame, X, Ban, Check, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, currentUser, addMessage, acceptRequest, declineRequest, blockUser, uploadFile } = useStore();
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message[]>([]);
  const [autoWipeEnabled, setAutoWipeEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversation = conversations.find(c => c.id === id);
  const otherParticipant = conversation?.participants.length === 1
    ? conversation.participants[0]
    : conversation?.participants.find(p => p.id !== currentUser?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, replyingTo]);

  if (!conversation || !otherParticipant || !currentUser) {
    return <div className="flex items-center justify-center h-full text-text-secondary">Frequency not found.</div>;
  }

  const isPending = !conversation.isAccepted;
  const isReceiver = isPending && conversation.messages[0]?.senderId !== currentUser.id;
  const isSelf = conversation.participants.length === 1;

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      senderId: currentUser.id,
      content: inputText,
      timestamp: new Date(),
      type: 'text',
      replyToIds: replyingTo.length > 0 ? replyingTo.map(m => m.id) : undefined,
      destructAfter: autoWipeEnabled ? 10 : undefined,
      expiresAt: autoWipeEnabled ? new Date(Date.now() + 10000) : undefined
    };

    addMessage(conversation.id, newMessage);
    setInputText('');
    setReplyingTo([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const isImage = file.type.startsWith('image/');
      
      const newMessage: Message = {
        id: uuidv4(),
        senderId: currentUser.id,
        content: isImage ? 'Sent an image' : 'Sent a file',
        timestamp: new Date(),
        type: isImage ? 'image' : 'file',
        fileUrl: url,
        fileName: file.name,
        fileSize: file.size,
        replyToIds: replyingTo.length > 0 ? replyingTo.map(m => m.id) : undefined,
        destructAfter: autoWipeEnabled ? 10 : undefined,
        expiresAt: autoWipeEnabled ? new Date(Date.now() + 10000) : undefined
      };

      addMessage(conversation.id, newMessage);
      setReplyingTo([]);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReply = (message: Message) => {
    if (isPending) return; // Disable reply in pending state
    
    // Toggle reply if already selected
    if (replyingTo.find(m => m.id === message.id)) {
      setReplyingTo(replyingTo.filter(m => m.id !== message.id));
      return;
    }
    
    if (replyingTo.length >= 2) {
      setReplyingTo([replyingTo[1], message]);
    } else {
      setReplyingTo([...replyingTo, message]);
    }
  };

  const removeReply = (messageId: string) => {
    setReplyingTo(replyingTo.filter(m => m.id !== messageId));
  };

  const handleAccept = () => {
    if (conversation.requestId) acceptRequest(conversation.requestId);
  };

  const handleIgnore = () => {
    if (conversation.requestId) {
      declineRequest(conversation.requestId);
      navigate('/chats');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-primary relative">
      {/* Background Grid/Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-bg-secondary/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/chats')} className="text-text-secondary hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <HexAvatar 
            src={otherParticipant.avatarUrl} 
            alt={otherParticipant.displayName} 
            status={otherParticipant.status}
            size="sm"
          />
          <div>
            <h2 className="font-display font-bold text-lg tracking-wide flex items-center gap-2">
              {isSelf ? 'Note to Self' : otherParticipant.displayName}
              <Shield size={14} className="text-accent-cyan" />
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
              {!isSelf && <span className="text-accent-cyan opacity-80">@{otherParticipant.username}</span>}
              <span className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", otherParticipant.status === 'active_signal' ? "bg-accent-cyan animate-pulse" : "bg-gray-500")} />
                {otherParticipant.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {!isPending && (
             <Button 
               variant="ghost" 
               size="sm" 
               className={cn("hidden sm:flex transition-colors", autoWipeEnabled && "text-danger border-danger/50 bg-danger/10")}
               onClick={() => setAutoWipeEnabled(!autoWipeEnabled)}
             >
               <Clock size={16} className={cn("mr-2", autoWipeEnabled && "animate-pulse")} />
               AUTO-WIPE: {autoWipeEnabled ? 'ON (10s)' : 'OFF'}
             </Button>
           )}
           <Button variant="ghost" size="sm" className="w-10 px-0">
             <MoreVertical size={20} />
           </Button>
        </div>
      </header>

      {/* Pending Request Banner */}
      {isPending && (
        <div className="bg-bg-secondary border-b border-white/10 p-4 z-20">
          {isReceiver ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan animate-pulse">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Accept this request?</h3>
                  <p className="text-text-secondary text-xs">Full communication is locked until you accept.</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="ghost" size="sm" className="flex-1 sm:flex-none" onClick={handleIgnore}>
                  Ignore
                </Button>
                <Button variant="primary" size="sm" glow className="flex-1 sm:flex-none" onClick={handleAccept}>
                  Accept
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-text-secondary py-2">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest">Signal Pending... Waiting for connection</span>
            </div>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 z-10">
        <div className="space-y-4 pb-4">
          {conversation.messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id;
            const showAvatar = !isMe && (index === 0 || conversation.messages[index - 1].senderId !== msg.senderId);

            return (
              <MessageBubble 
                key={msg.id}
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
                onReply={handleReply}
                isReplying={replyingTo.some(r => r.id === msg.id)}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Banner */}
      <AnimatePresence>
        {replyingTo.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-bg-secondary/90 border-t border-white/10 px-4 py-2 z-20 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs font-mono text-accent-cyan uppercase">
              <span>Replying to {replyingTo.length} message{replyingTo.length > 1 ? 's' : ''}</span>
              <button onClick={() => setReplyingTo([])} className="text-text-secondary hover:text-white">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {replyingTo.map((msg, i) => (
                <div key={msg.id} className={cn("flex items-center justify-between bg-white/5 rounded p-2 text-xs border-l-2", i === 0 ? "border-accent-cyan" : "border-accent-purple")}>
                  <div className="truncate flex-1">
                    <span className="font-bold mr-2 text-text-primary">
                      {msg.senderId === currentUser.id ? 'You' : conversation.participants.find(p => p.id === msg.senderId)?.displayName}:
                    </span>
                    <span className="text-text-secondary">{msg.content}</span>
                  </div>
                  <button onClick={() => removeReply(msg.id)} className="ml-2 text-text-secondary hover:text-danger">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className={cn("p-2 md:p-4 backdrop-blur-md border-t z-20 transition-colors", autoWipeEnabled ? "bg-danger/5 border-danger/30" : "bg-bg-secondary/80 border-white/10")}>
        {isPending ? (
          <div className="text-center text-xs font-mono text-text-secondary py-4 border border-dashed border-white/10 rounded-lg bg-white/5">
            {isReceiver ? "ACCEPT REQUEST TO UNLOCK COMPOSER" : "TRANSMISSION LOCKED UNTIL ACCEPTED"}
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <Button 
              type="button" 
              variant="ghost" 
              className="w-10 h-10 px-0 rounded-full border-white/10 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Paperclip size={20} />
            </Button>
            
            <div className="flex-1 relative">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isUploading ? "UPLOADING..." : (autoWipeEnabled ? "SELF-DESTRUCT..." : "TRANSMIT...")}
                disabled={isUploading}
                className={cn(
                  "w-full bg-bg-primary/50 border text-white px-3 py-2 md:px-4 md:py-3 focus:outline-none transition-colors font-mono text-sm clip-corners-sm disabled:opacity-50",
                  autoWipeEnabled ? "border-danger/50 focus:border-danger placeholder:text-danger/50" : "border-white/10 focus:border-accent-cyan"
                )}
                style={{
                  clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
              />
              <button 
                type="button"
                className={cn("absolute right-2 md:right-3 top-1/2 -translate-y-1/2 transition-colors", autoWipeEnabled ? "text-danger animate-pulse" : "text-text-secondary hover:text-danger")}
                title="Toggle Self-Destruct"
                onClick={() => setAutoWipeEnabled(!autoWipeEnabled)}
              >
                <Flame size={16} />
              </button>
            </div>

            <Button type="submit" variant={autoWipeEnabled ? "danger" : "primary"} glow className="w-10 h-10 md:w-12 md:h-10 px-0 flex-shrink-0" disabled={isUploading}>
              <Send size={18} />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
