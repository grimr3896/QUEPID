import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Mail, RefreshCw } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useStore } from '@/store';

export default function VerifyEmailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const { setCurrentUser } = useStore();
  
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!email) navigate('/auth/signup/email');
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Simulate magic link click (for demo purposes)
  const simulateVerification = () => {
    // In real app, this happens via deep link
    navigate('/auth/activated');
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <div className="w-20 h-20 bg-accent-purple/10 border border-accent-purple rounded-full flex items-center justify-center text-accent-purple animate-pulse">
            <Mail size={32} />
          </div>
          <div className="absolute inset-0 bg-accent-purple/20 blur-xl -z-10" />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">Check Comms</h2>
          <p className="text-text-secondary">
            We sent a magic link to <span className="text-white font-bold">{email}</span>.
            <br />
            Open it to activate your account.
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <Button 
            variant="ghost" 
            className="w-full"
            disabled={cooldown > 0}
            onClick={() => setCooldown(60)}
          >
            {cooldown > 0 ? `Resend Link (${cooldown}s)` : 'Resend Link'}
          </Button>
          
          <button 
            onClick={() => navigate('/auth/signup/email')}
            className="text-xs text-text-secondary hover:text-white underline decoration-white/20 underline-offset-4"
          >
            Wrong email?
          </button>
        </div>

        {/* DEMO ONLY BUTTON */}
        <div className="pt-8 border-t border-white/5 w-full">
          <Button variant="secondary" size="sm" className="w-full opacity-50 hover:opacity-100" onClick={simulateVerification}>
            [DEMO] Simulate Link Click
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
