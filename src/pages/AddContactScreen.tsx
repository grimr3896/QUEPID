import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Search, QrCode, Loader2, AlertTriangle } from 'lucide-react';
import { HexAvatar } from '@/components/ui/HexAvatar';
import { useStore } from '@/store';

export default function AddContactScreen() {
  const navigate = useNavigate();
  const { sendRequest, startSelfChat, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null); // Mock result type
  const [requestMessage, setRequestMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState<'search' | 'compose'>('search');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate API search delay
    setTimeout(() => {
      setIsSearching(false);
      
      const query = searchQuery.toLowerCase();
      
      // Check for self
      if (currentUser && query === currentUser.username.toLowerCase()) {
        setSearchResult(currentUser);
        return;
      }

      // Mock result for demo
      if (query === 'thane') {
        setSearchResult({
          id: 'u_thane',
          username: 'thane_krios',
          displayName: 'Thane Krios',
          avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=Thane&backgroundColor=0D1220&shape1Color=00E5FF',
          about: 'Assassin. Drell. Repentant.',
          status: 'active_signal'
        });
      } else {
        setSearchResult(null);
      }
    }, 800);
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) return;
    
    setIsSending(true);
    await sendRequest(searchResult.username, requestMessage);
    setIsSending(false);
    navigate('/chats');
  };

  const handleSelfMessage = () => {
    startSelfChat();
    navigate('/chats');
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-primary relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-bg-secondary/80 backdrop-blur-md flex items-center gap-3 z-20">
        <button onClick={() => step === 'compose' ? setStep('search') : navigate(-1)} className="text-text-secondary hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-lg tracking-wide text-white">
          {step === 'search' ? 'ADD CONTACT' : 'NEW TRANSMISSION'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 z-10">
        {step === 'search' ? (
          <div className="space-y-8 max-w-md mx-auto">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <Input 
                  placeholder="Find by @username" 
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={!searchQuery || isSearching}>
                {isSearching ? <Loader2 className="animate-spin" /> : 'Search Signal'}
              </Button>
            </form>

            {/* QR Scan Option */}
            <div className="relative border-t border-white/10 pt-8 text-center">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-primary px-2 text-xs text-text-secondary font-mono">OR</span>
              <Button variant="secondary" className="w-full gap-2 h-12">
                <QrCode size={20} />
                SCAN QR CODE
              </Button>
            </div>

            {/* Search Results */}
            {searchQuery && !isSearching && (
              <div className="mt-8">
                {searchResult ? (
                  <div className="bg-bg-secondary border border-white/10 rounded-xl p-6 flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <HexAvatar 
                      src={searchResult.avatarUrl} 
                      alt={searchResult.displayName} 
                      size="xl"
                      className="w-24 h-24"
                    />
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">{searchResult.displayName}</h3>
                      <p className="text-accent-cyan font-mono text-sm">@{searchResult.username}</p>
                    </div>
                    <p className="text-text-secondary text-sm italic">"{searchResult.about}"</p>
                    
                    {currentUser && searchResult.id === currentUser.id ? (
                      <Button 
                        variant="primary" 
                        glow 
                        className="w-full mt-4"
                        onClick={handleSelfMessage}
                      >
                        Message Yourself
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        glow 
                        className="w-full mt-4"
                        onClick={() => setStep('compose')}
                      >
                        Message
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-text-secondary py-8 border border-dashed border-white/10 rounded-xl">
                    <p>No signal found for <span className="text-white font-bold">@{searchQuery}</span></p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 max-w-md mx-auto animate-in fade-in slide-in-from-right-8">
            {/* Compose Request */}
            <div className="bg-accent-cyan/5 border border-accent-cyan/20 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-accent-cyan flex-shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-accent-cyan font-bold text-sm uppercase tracking-wide">Restricted Channel</p>
                <p className="text-text-secondary text-xs leading-relaxed">
                  You can send <span className="text-white font-bold">one message</span>. 
                  @{searchResult.username} must accept your request to unlock full communication.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">Message Request</label>
              <textarea 
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                maxLength={200}
                placeholder="Identify yourself..."
                className="w-full bg-bg-secondary/50 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-cyan transition-all font-body rounded-md h-32 resize-none clip-corners-sm"
                autoFocus
              />
              <div className="text-right text-xs font-mono text-text-secondary">
                {requestMessage.length}/200
              </div>
            </div>

            <Button 
              onClick={handleSendRequest}
              variant="primary" 
              size="lg" 
              className="w-full"
              disabled={!requestMessage.trim() || isSending}
            >
              {isSending ? <Loader2 className="animate-spin" /> : 'Send Request'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
