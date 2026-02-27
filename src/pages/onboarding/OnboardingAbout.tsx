import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/components/AuthLayout';
import { useStore } from '@/store';

export default function OnboardingAbout() {
  const navigate = useNavigate();
  const { updateUserProfile } = useStore();
  const [about, setAbout] = useState('');

  const handleContinue = () => {
    updateUserProfile({ about });
    navigate('/onboarding/complete');
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">Transmission</h2>
          <p className="text-text-secondary">Describe yourself (optional).</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <textarea 
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={140}
              placeholder="Bio, status, or coordinates..."
              className="w-full bg-bg-secondary/50 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-cyan transition-all font-body rounded-md h-32 resize-none clip-corners-sm"
              style={{
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
              }}
            />
            <div className="text-right text-xs font-mono text-text-secondary">
              {about.length}/140
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              variant="primary" 
              size="lg" 
              className="w-full"
            >
              Finish
            </Button>
            <Button 
              onClick={handleContinue}
              variant="ghost" 
              size="sm" 
              className="w-full"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
