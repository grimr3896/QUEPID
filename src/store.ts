import { create } from 'zustand';

export type UserStatus = 'active_signal' | 'standby' | 'cloaked' | 'offline';
export type AccountStatus = 'pending' | 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string; // stored without @
  displayName: string;
  avatarUrl: string;
  status: UserStatus;
  accountStatus: AccountStatus;
  lastSeen?: Date;
  about?: string;
  readReceiptsEnabled: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyToIds?: string[]; // Dual reply support
  reactions?: Record<string, string[]>; // emoji -> userIds
  destructAfter?: number; // seconds
  expiresAt?: Date;
}

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'blocked';

export interface ContactRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: RequestStatus;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: 'direct';
  name?: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
  requestId?: string; // Link to the request
  isAccepted: boolean; // False until request accepted
  blockedBy?: string; // ID of user who blocked
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  blockedUserIds: string[]; // List of blocked user IDs
  setCurrentUser: (user: User | null) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string, userId: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
  
  // New Actions
  sendRequest: (receiverUsername: string, message: string) => Promise<void>;
  startSelfChat: () => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  uploadFile: (file: File) => Promise<string>;
}

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  email: 'shepard@alliance.navy',
  emailVerified: true,
  username: 'commander_shep',
  displayName: 'Cmdr. Shepard',
  avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=Shepard&backgroundColor=080B14&shape1Color=00E5FF',
  status: 'active_signal',
  accountStatus: 'active',
  about: 'Spectre | Alliance Navy | N7',
  readReceiptsEnabled: true,
  createdAt: new Date(),
};

const MOCK_CONTACTS: User[] = [
  {
    id: 'u2',
    email: 'garrus@csec.citadel',
    emailVerified: true,
    username: 'garrus_v',
    displayName: 'Garrus V.',
    avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=Garrus&backgroundColor=0D1220&shape1Color=9B30FF',
    status: 'active_signal',
    accountStatus: 'active',
    about: 'Calibrating...',
    readReceiptsEnabled: true,
    createdAt: new Date(),
  },
  {
    id: 'u3',
    email: 'liara@shadowbroker.net',
    emailVerified: true,
    username: 'liara_tsoni',
    displayName: 'Dr. T\'Soni',
    avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=Liara&backgroundColor=0D1220&shape1Color=00E5FF',
    status: 'standby',
    accountStatus: 'active',
    about: 'Shadow Broker',
    readReceiptsEnabled: false,
    createdAt: new Date(),
  },
  {
    id: 'u4',
    email: 'wrex@tuchanka.clan',
    emailVerified: true,
    username: 'urdnot_wrex',
    displayName: 'Wrex',
    avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=Wrex&backgroundColor=0D1220&shape1Color=FF0000',
    status: 'offline',
    accountStatus: 'active',
    about: 'Shepard.',
    readReceiptsEnabled: true,
    createdAt: new Date(),
  }
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    type: 'direct',
    participants: [MOCK_USER, MOCK_CONTACTS[0]],
    unreadCount: 2,
    isAccepted: true,
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        content: 'Calibrations are complete. Systems at 100%.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 'u1',
        content: 'Excellent work. We move out at 0800.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'u2',
        content: 'Copy that. I\'ll be ready.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text',
      },
    ],
  },
  {
    id: 'c2',
    type: 'direct',
    participants: [MOCK_USER, MOCK_CONTACTS[1]],
    unreadCount: 0,
    isAccepted: true,
    messages: [
      {
        id: 'm4',
        senderId: 'u3',
        content: 'I\'ve found some interesting data patterns in the Prothean archives.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        type: 'text',
      },
    ],
  },
  // Pending Request Example
  {
    id: 'c3',
    type: 'direct',
    participants: [MOCK_USER, MOCK_CONTACTS[2]],
    unreadCount: 1,
    isAccepted: false,
    requestId: 'req1',
    messages: [
      {
        id: 'm5',
        senderId: 'u4',
        content: 'Shepard. We need to talk about the Genophage.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        type: 'text',
      }
    ]
  }
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  blockedUserIds: [],
  
  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  logout: () => set({ currentUser: null, isAuthenticated: false, activeConversationId: null }),
  
  addMessage: (conversationId, message) => set((state) => {
    const updatedConversations = state.conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, message],
          lastMessage: message,
        };
      }
      return c;
    });
    return { conversations: updatedConversations };
  }),

  addReaction: (conversationId, messageId, emoji, userId) => set((state) => {
    const updatedConversations = state.conversations.map((c) => {
      if (c.id === conversationId) {
        const updatedMessages = c.messages.map((m) => {
          if (m.id === messageId) {
            const currentReactions = m.reactions || {};
            const userIds = currentReactions[emoji] || [];
            
            // Toggle reaction
            let newUserIds;
            if (userIds.includes(userId)) {
              newUserIds = userIds.filter(id => id !== userId);
            } else {
              newUserIds = [...userIds, userId];
            }

            const newReactions = { ...currentReactions };
            if (newUserIds.length === 0) {
              delete newReactions[emoji];
            } else {
              newReactions[emoji] = newUserIds;
            }

            return { ...m, reactions: newReactions };
          }
          return m;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    });
    return { conversations: updatedConversations };
  }),

  updateUserProfile: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
  })),

  // --- New Actions Implementation (Mock) ---

  sendRequest: async (receiverUsername, message) => {
    // In a real app, this would be an API call
    console.log(`Sending request to @${receiverUsername}: ${message}`);
    // Simulate success
    return Promise.resolve();
  },

  startSelfChat: () => set((state) => {
    if (!state.currentUser) return state;
    
    // Check if self-chat already exists
    const existingChat = state.conversations.find(c => 
      c.participants.length === 1 && c.participants[0].id === state.currentUser?.id
    );

    if (existingChat) {
      return { activeConversationId: existingChat.id };
    }

    const newChat: Conversation = {
      id: `self_${state.currentUser.id}`,
      type: 'direct',
      participants: [state.currentUser],
      messages: [],
      unreadCount: 0,
      isAccepted: true,
    };

    return {
      conversations: [newChat, ...state.conversations],
      activeConversationId: newChat.id
    };
  }),

  acceptRequest: (requestId) => set((state) => ({
    conversations: state.conversations.map(c => 
      c.requestId === requestId ? { ...c, isAccepted: true } : c
    )
  })),

  declineRequest: (requestId) => set((state) => ({
    conversations: state.conversations.filter(c => c.requestId !== requestId)
  })),

  blockUser: (userId) => set((state) => ({
    blockedUserIds: [...state.blockedUserIds, userId],
    // Hide conversations with blocked user
    conversations: state.conversations.filter(c => 
      !c.participants.some(p => p.id === userId)
    )
  })),

  unblockUser: (userId) => set((state) => ({
    blockedUserIds: state.blockedUserIds.filter(id => id !== userId)
  })),

  uploadFile: async (file) => {
    // In a real app, this would upload to S3/Cloudinary/etc.
    // For now, we'll use a local object URL to simulate it.
    console.log('Uploading file:', file.name);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return URL.createObjectURL(file);
  },
}));
