import React from 'react';
import { useStore } from '@/store';
import ChatList from './ChatList';
import { MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function ChatsPage() {
  return (
    <div className="flex h-full w-full">
      {/* Chat List - Full width always */}
      <div className="w-full h-full flex-shrink-0">
        <ChatList />
      </div>
    </div>
  );
}
