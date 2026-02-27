import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { cn } from '@/lib/utils';

export default function SignupPasswordScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, username } = location.state || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!email || !username) navigate('/auth/signup/email');
  }, [email, username, navigate]);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (strength < 3) return;

    // Proceed to verification
    navigate('/auth/verify', { state: { email } });
  };

  const getStrengthLabel = (s: number) => {
    if (s <= 1) return { label: 'WEAK', color: 'bg-danger' };
    if (s === 2) return { label: 'FAIR', color: 'bg-warning' };
    if (s === 3) return { label: 'GOOD', color: 'bg-yellow-400' };
    if (s === 4) return { label: 'STRONG', color: 'bg-accent-cyan' };
    return { label: 'FORTRESS', color: 'bg-accent-purple' };
  };

  const strengthInfo = getStrengthLabel(strength);

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
          <h2 className="text-2xl font-display font-bold text-white">Secure Access</h2>
          <p className="text-text-secondary">Create a password to encrypt your signal.</p>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div className="space-y-1">
            <div className="relative">
              <Input
                label="PASSWORD"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-text-secondary hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Strength Bar */}
            <div className="flex gap-1 h-1 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 rounded-full transition-colors duration-300",
                    i <= strength ? strengthInfo.color : "bg-white/10"
                  )} 
                />
              ))}
            </div>
            <div className="flex justify-end">
              <span className={cn("text-[10px] font-mono font-bold transition-colors", strengthInfo.color.replace('bg-', 'text-'))}>
                {password && strengthInfo.label}
              </span>
            </div>
          </div>

          <Input
            label="CONFIRM PASSWORD"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={strength < 3 || password !== confirmPassword}
          >
            Create Account
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
