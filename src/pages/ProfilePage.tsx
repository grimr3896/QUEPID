import React, { useState, useRef } from 'react';
import { useStore } from '@/store';
import { HexAvatar } from '@/components/ui/HexAvatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Edit2, Check, X, Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { currentUser, updateUserProfile, uploadFile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const startEditing = () => {
    setEditName(currentUser.displayName);
    setEditAbout(currentUser.about || '');
    setIsEditing(true);
  };

  const saveProfile = () => {
    updateUserProfile({
      displayName: editName,
      about: editAbout,
    });
    setIsEditing(false);
  };

  const toggleReadReceipts = () => {
    updateUserProfile({
      readReceiptsEnabled: !currentUser.readReceiptsEnabled,
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      updateUserProfile({ avatarUrl: url });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto border-r border-white/5 bg-bg-primary/50 backdrop-blur-sm overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold tracking-wider text-white">
          IDENTITY
        </h1>
        {!isEditing ? (
          <button onClick={startEditing} className="text-accent-cyan hover:text-white transition-colors">
            <Edit2 size={18} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="text-danger hover:text-white transition-colors">
              <X size={18} />
            </button>
            <button onClick={saveProfile} className="text-success hover:text-white transition-colors">
              <Check size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col items-center gap-8">
        {/* Avatar Section */}
        <div className="relative group">
            <div className="absolute inset-0 bg-accent-cyan/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <HexAvatar 
                src={currentUser.avatarUrl} 
                alt={currentUser.displayName} 
                status={currentUser.status}
                size="xl"
                className="w-40 h-40"
            />
            <button 
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 p-3 bg-bg-secondary border border-white/10 rounded-full cursor-pointer hover:bg-white/10 transition-colors text-accent-cyan shadow-lg disabled:opacity-50"
            >
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
        </div>

        {/* Info Section */}
        <div className="w-full space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-accent-cyan uppercase tracking-widest opacity-80">
              Display Name
            </label>
            {isEditing ? (
              <Input 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={60}
                className="text-lg font-display font-bold"
              />
            ) : (
              <h2 className="text-2xl font-display font-bold text-white">{currentUser.displayName}</h2>
            )}
          </div>

          {/* Search Signal (Username) */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-accent-cyan uppercase tracking-widest opacity-80">
              Search Signal
            </label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2">
              <span className="text-accent-cyan font-bold select-none">@</span>
              <span className="font-mono text-white tracking-wide select-all">{currentUser.username}</span>
            </div>
            <p className="text-[10px] text-text-secondary font-mono opacity-60">
              This is your unique ID. Others can use this to find you.
            </p>
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-accent-cyan uppercase tracking-widest opacity-80">
              About
            </label>
            {isEditing ? (
              <textarea 
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
                maxLength={140}
                className="w-full bg-bg-secondary/50 border border-white/10 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-cyan transition-all font-body rounded-md h-24 resize-none"
              />
            ) : (
              <p className="text-text-secondary font-body text-sm leading-relaxed">
                {currentUser.about || 'No status set.'}
              </p>
            )}
          </div>

          {/* Blue Ticks Toggle */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-transparent hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded transition-colors", currentUser.readReceiptsEnabled ? "bg-accent-cyan/10 text-accent-cyan" : "bg-bg-primary text-text-secondary")}>
                  <Shield size={18} />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-text-primary block">Blue Ticks</span>
                  <span className="text-xs text-text-secondary font-mono">Read Receipts</span>
                </div>
              </div>
              
              <button 
                onClick={toggleReadReceipts}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300",
                  currentUser.readReceiptsEnabled ? "bg-accent-cyan/20" : "bg-white/10"
                )}
              >
                <motion.div 
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300",
                    currentUser.readReceiptsEnabled ? "bg-accent-cyan left-7" : "bg-text-secondary left-1"
                  )}
                  layout
                />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-text-secondary font-mono opacity-60 px-1">
              {currentUser.readReceiptsEnabled 
                ? "ON: Contacts can see when you read their messages." 
                : "OFF: Read receipts disabled. You also won't see when others read your messages."}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 text-center">
            <p className="text-[10px] font-mono text-text-secondary opacity-50">
                QUEPID v1.1.0 // BUILD 2026.02.27
            </p>
            <p className="text-[10px] font-mono text-text-secondary opacity-30 mt-1">
                ENCRYPTED CONNECTION ESTABLISHED
            </p>
        </div>
      </div>
    </div>
  );
}
