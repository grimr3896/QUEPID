import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function SignupUsernameScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Redirect if no email (direct access prevention)
  useEffect(() => {
    if (!email) navigate('/auth/signup/email');
  }, [email, navigate]);

  const validateUsername = (val: string) => {
    if (val.length < 3) return 'Too short (min 3)';
    if (val.length > 20) return 'Too long (max 20)';
    if (!/^[a-zA-Z0-9._-]+$/.test(val)) return 'Invalid characters';
    if (/^[._-]/.test(val) || /[._-]$/.test(val)) return 'Cannot start/end with special chars';
    if (/([._-])\1/.test(val)) return 'No consecutive special chars';
    if (/^\d+$/.test(val)) return 'Cannot be all numbers';
    return null;
  };

  const checkAvailability = async (val: string) => {
    setStatus('checking');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (val.toLowerCase() === 'admin' || val.toLowerCase() === 'taken') {
      setStatus('taken');
      setErrorMsg('This ID is taken.');
    } else {
      setStatus('available');
      setErrorMsg('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!username) {
        setStatus('idle');
        setErrorMsg('');
        return;
      }

      const validationError = validateUsername(username);
      if (validationError) {
        setStatus('invalid');
        setErrorMsg(validationError);
      } else {
        checkAvailability(username);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleContinue = () => {
    if (status === 'available') {
      setShowConfirmation(true);
    }
  };

  const handleLockIn = () => {
    navigate('/auth/signup/password', { state: { email, username } });
  };

  if (showConfirmation) {
    return (
      <AuthLayout>
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">Confirm Identity</h2>
            <div className="py-8">
              <span className="text-4xl font-display font-bold text-accent-cyan drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                @{username}
              </span>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg flex gap-3 items-start">
            <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <p className="text-warning font-bold text-sm uppercase tracking-wide">Permanent Selection</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                This will be your permanent QUEPID ID. It cannot be changed, ever. 
                Make sure you're happy with <span className="text-white font-bold">@{username}</span> before continuing.
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowConfirmation(false)}>
              Change it
            </Button>
            <Button variant="primary" glow className="flex-1" onClick={handleLockIn}>
              Lock it in
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <button 
          onClick={() => navigate(-1)} 
          className="text-text-secondary hover:text-white transition-colors flex items-center gap-2 text-sm font-mono uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">Choose your ID</h2>
          <p className="text-text-secondary">This is permanent and cannot be changed.</p>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-mono text-lg select-none">
              @
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className={cn(
                "w-full bg-bg-secondary/50 border px-3 py-3 pl-8 text-lg font-mono text-white focus:outline-none transition-all clip-corners-sm",
                status === 'available' ? "border-success focus:border-success shadow-[0_0_10px_rgba(0,255,156,0.1)]" :
                status === 'taken' || status === 'invalid' ? "border-danger focus:border-danger" :
                "border-white/10 focus:border-accent-cyan"
              )}
              style={{
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
              }}
              placeholder="username"
              autoFocus
            />
            
            {/* Status Indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {status === 'checking' && <Loader2 className="animate-spin text-accent-cyan" size={20} />}
              {status === 'available' && <Check className="text-success" size={20} />}
              {(status === 'taken' || status === 'invalid') && <X className="text-danger" size={20} />}
            </div>
          </div>

          <div className="flex justify-between items-start h-6">
            <span className={cn(
              "text-xs font-mono transition-colors",
              status === 'available' ? "text-success" :
              status === 'taken' || status === 'invalid' ? "text-danger" :
              "text-text-secondary"
            )}>
              {errorMsg || (status === 'available' ? 'ID Available' : 'Choose wisely.')}
            </span>
            <span className="text-xs font-mono text-text-secondary">
              {username.length}/20
            </span>
          </div>

          <Button 
            onClick={handleContinue}
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={status !== 'available'}
          >
            Continue
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
