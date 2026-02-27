import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useStore } from '@/store';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { setCurrentUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
      setCurrentUser({
        id: 'u1',
        email: email,
        emailVerified: true,
        username: 'commander_shep',
        displayName: 'Cmdr. Shepard',
        avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=Shepard&backgroundColor=080B14&shape1Color=00E5FF',
        status: 'active_signal',
        accountStatus: 'active',
        about: 'Spectre | Alliance Navy | N7',
        readReceiptsEnabled: true,
        createdAt: new Date(),
      });
      navigate('/chats');
    } else {
      setError('Incorrect email or password.');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <button 
          onClick={() => navigate('/')} 
          className="text-text-secondary hover:text-white transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">Establish Link</h2>
          <p className="text-text-secondary">Sign in to resume transmission.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="EMAIL"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          
          <div className="space-y-1">
            <Input
              label="PASSWORD"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />
            <div className="flex justify-end">
              <button type="button" className="text-xs text-text-secondary hover:text-accent-cyan transition-colors">
                Forgot password?
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={!email || !password}
          >
            Sign In
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
