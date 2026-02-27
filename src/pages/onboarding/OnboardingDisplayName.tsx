import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AuthLayout from '@/components/AuthLayout';
import { useStore } from '@/store';

export default function OnboardingDisplayName() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useStore();
  const [name, setName] = useState(currentUser?.username || '');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    updateUserProfile({ displayName: name });
    navigate('/onboarding/avatar');
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">Call Sign</h2>
          <p className="text-text-secondary">What should people call you?</p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          <Input
            label="DISPLAY NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            autoFocus
            className="text-lg"
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={!name.trim()}
          >
            Next
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
