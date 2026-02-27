import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, User, Hexagon, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HexAvatar } from './ui/HexAvatar';
import { useStore } from '@/store';

export function MobileNav() {
  const navItems = [
    { icon: MessageSquare, label: 'Chats', path: '/chats' },
    { icon: UserPlus, label: 'Add Contact', path: '/contacts/add' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg-secondary/95 backdrop-blur-lg border-t border-white/5 flex justify-around items-center h-16 z-50 px-2 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors w-16",
              isActive ? "text-accent-cyan" : "text-text-secondary"
            )
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-mono uppercase">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
