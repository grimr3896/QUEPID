import React, { useState, useEffect } from 'react';
import { Message, useStore } from '@/store';
import { cn } from '@/lib/utils';
import { HexAvatar } from '@/components/ui/HexAvatar';
import { format, differenceInSeconds } from 'date-fns';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { Reply, Smile, Trash2, Clock, FileText, Download } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  onReply: (message: Message) => void;
  previousMessage?: Message;
  isReplying?: boolean;
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showAvatar, onReply, previousMessage, isReplying }) => {
  const { conversations, currentUser, addReaction } = useStore();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Swipe Logic
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 50], [0, 1]);
  const scale = useTransform(x, [0, 50], [0.5, 1]);

  // Find context (Direct Conversation)
  const conversation = conversations.find(c => c.messages.some(m => m.id === message.id));

  // Find sender
  const sender = conversation?.participants.find(p => p.id === message.senderId);

  // Find quoted messages
  const quotedMessages = (message.replyToIds || []).map(id => {
    if (conversation) {
      return conversation.messages.find(m => m.id === id);
    }
    return undefined;
  }).filter(Boolean) as Message[];

  const handleReaction = (emoji: string) => {
    if (conversation && currentUser) {
      addReaction(conversation.id, message.id, emoji, currentUser.id);
      setShowReactionPicker(false);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) {
      onReply(message);
    }
    setIsSwiping(false);
  };

  const scrollToMessage = (id: string) => {
    const el = document.getElementById(`message-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-accent-cyan/20');
      setTimeout(() => el.classList.remove('bg-accent-cyan/20'), 1000);
    }
  };

  useEffect(() => {
    if (message.expiresAt) {
      const interval = setInterval(() => {
        const seconds = differenceInSeconds(new Date(message.expiresAt!), new Date());
        if (seconds <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(seconds);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [message.expiresAt]);

  const isExpired = timeLeft === 0;

  if (isExpired) {
    return (
      <motion.div 
        initial={{ opacity: 1 }} 
        animate={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} 
        className={cn("flex gap-3 mb-4 text-xs text-text-secondary italic", isMe ? "justify-end" : "justify-start")}
      >
        Message dissolved.
      </motion.div>
    );
  }

  const renderContent = () => {
    if (message.type === 'image' && message.fileUrl) {
      return (
        <div className="rounded-lg overflow-hidden my-1">
          <img src={message.fileUrl} alt="Attachment" className="max-w-full max-h-64 object-cover" />
        </div>
      );
    }

    if (message.type === 'file' && message.fileUrl) {
      return (
        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg my-1 border border-white/10">
          <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan">
            <FileText size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{message.fileName || 'Document'}</p>
            <p className="text-xs opacity-70">{message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}</p>
          </div>
          <a 
            href={message.fileUrl} 
            download={message.fileName}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={18} />
          </a>
        </div>
      );
    }

    return message.content;
  };

  return (
    <div className="relative mb-4">
      {/* Swipe Indicator */}
      <motion.div 
        style={{ opacity, scale, x: -40, top: '50%', translateY: '-50%' }}
        className={cn("absolute left-0 z-0", isReplying ? "text-accent-cyan" : "text-text-secondary")}
      >
        <Reply size={20} />
      </motion.div>

      <motion.div
        id={`message-${message.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ right: 0.5 }}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={handleDragEnd}
        className={cn(
          "flex gap-3 group relative z-10 transition-colors duration-500 rounded-xl p-1", 
          isMe ? "justify-end" : "justify-start"
        )}
        onMouseLeave={() => setShowReactionPicker(false)}
      >
        {!isMe && (
          <div className="w-10 flex-shrink-0 flex flex-col justify-end">
            {showAvatar && sender && (
              <HexAvatar 
                src={sender.avatarUrl} 
                alt={sender.displayName} 
                size="sm"
              />
            )}
          </div>
        )}

        <div className={cn("max-w-[85%] sm:max-w-[70%] flex flex-col relative", isMe ? "items-end" : "items-start")}>
          
          {/* Dual-Reply Quotes */}
          {quotedMessages && quotedMessages.length > 0 && (
            <div className="mb-1 flex flex-col gap-1 w-full">
              {quotedMessages.map((quoted, i) => {
                 const isQuotedMe = quoted.senderId === currentUser?.id;
                 return (
                  <div 
                    key={quoted.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToMessage(quoted.id);
                    }}
                    className={cn(
                      "text-xs p-2 rounded border-l-2 bg-bg-secondary/50 backdrop-blur-sm truncate cursor-pointer hover:bg-white/5 transition-colors",
                      i === 0 ? "border-accent-cyan text-accent-cyan" : "border-accent-purple text-accent-purple"
                    )}
                  >
                    <span className="font-bold mr-2">
                      {isQuotedMe ? 'You' : conversation?.participants.find(p => p.id === quoted.senderId)?.displayName}:
                    </span>
                    <span className="text-text-secondary italic">{quoted.content}</span>
                  </div>
                 );
              })}
            </div>
          )}

          {/* Message Bubble */}
          <div className="relative group/bubble">
              <div 
              className={cn(
                  "relative p-3 sm:p-4 text-sm font-body leading-relaxed shadow-lg backdrop-blur-sm",
                  "clip-corners-sm transition-all duration-200", 
                  isMe 
                  ? "bg-accent-cyan/10 border border-accent-cyan/30 text-white rounded-tl-xl rounded-bl-xl rounded-br-none hover:border-accent-cyan/50" 
                  : "bg-bg-secondary border border-white/10 text-text-primary rounded-tr-xl rounded-br-xl rounded-bl-none hover:border-white/20"
              )}
              style={{
                  clipPath: isMe 
                  ? 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' 
                  : 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)'
              }}
              >
              {renderContent()}
              
              {/* Metadata */}
              <div className={cn("flex items-center gap-1 mt-1 text-[10px] font-mono opacity-60 select-none", isMe ? "justify-end" : "justify-start")}>
                  {message.destructAfter && (
                    <span className={cn("flex items-center gap-0.5 mr-1 font-bold", timeLeft !== null && timeLeft <= 5 ? "text-danger animate-pulse" : "text-warning")}>
                      <Clock size={10} />
                      {timeLeft !== null ? timeLeft : message.destructAfter}s
                    </span>
                  )}
                  {format(message.timestamp, 'HH:mm')}
                  {isMe && <span className="text-accent-cyan">✓✓</span>}
              </div>
              </div>

              {/* Actions (Hover) - Only show if not swiping */}
              {!isSwiping && (
                <div className={cn(
                    "absolute top-0 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-bg-primary/80 backdrop-blur rounded-full px-2 py-1 border border-white/10 shadow-xl z-10",
                    isMe ? "left-0 -translate-x-full mr-2" : "right-0 translate-x-full ml-2",
                    (showReactionPicker || isReplying) && "opacity-100"
                )}>
                    <button 
                        onClick={() => onReply(message)}
                        className={cn(
                          "p-1.5 rounded-full transition-colors",
                          isReplying ? "text-accent-cyan bg-accent-cyan/10" : "text-text-secondary hover:text-accent-cyan hover:bg-white/10"
                        )}
                        title="Reply"
                    >
                        <Reply size={14} />
                    </button>
                    <button 
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        className={cn("p-1.5 hover:bg-white/10 rounded-full transition-colors", showReactionPicker ? "text-warning" : "text-text-secondary hover:text-warning")}
                    >
                        <Smile size={14} />
                    </button>
                </div>
              )}

              {/* Reaction Picker */}
              <AnimatePresence>
                {showReactionPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className={cn(
                      "absolute top-full mt-2 flex gap-1 bg-bg-secondary border border-white/10 p-1 rounded-full shadow-xl z-20",
                      isMe ? "right-0" : "left-0"
                    )}
                  >
                    {REACTION_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          {/* Reactions Display */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
             <div className={cn("flex flex-wrap gap-1 mt-1", isMe ? "justify-end" : "justify-start")}>
               {Object.entries(message.reactions).map(([emoji, userIds]: [string, any]) => (
                 <button
                   key={emoji}
                   onClick={() => handleReaction(emoji)}
                   className={cn(
                     "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors",
                     (userIds as string[]).includes(currentUser?.id || '') 
                       ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan" 
                       : "bg-bg-secondary border-white/10 text-text-secondary hover:border-white/30"
                   )}
                 >
                   <span>{emoji}</span>
                   <span className="font-mono">{(userIds as string[]).length}</span>
                 </button>
               ))}
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
