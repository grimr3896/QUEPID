import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Hexagon } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center space-y-12">
        <div className="relative">
          <div className="w-24 h-24 bg-accent-cyan/10 border border-accent-cyan flex items-center justify-center text-accent-cyan clip-corners animate-pulse-slow">
            <Hexagon size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 bg-accent-cyan/20 blur-xl -z-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold tracking-widest text-white">
            QUEPID
          </h1>
          <p className="text-text-secondary font-mono text-sm tracking-widest uppercase">
            Transmit. Connect. Disappear.
          </p>
        </div>

        <div className="w-full space-y-4">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full h-14 text-lg" 
            glow
            onClick={() => navigate('/auth/signup/email')}
          >
            Create Account
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full h-14 text-lg"
            onClick={() => navigate('/auth/login')}
          >
            Sign In
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
