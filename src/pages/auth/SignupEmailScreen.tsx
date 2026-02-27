import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

export default function SignupEmailScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    // Simulate check if email is taken
    if (email === 'taken@example.com') {
      setError('This email is already linked to an account. Sign in instead?');
      return;
    }
    
    // Proceed to username selection
    navigate('/auth/signup/username', { state: { email } });
  };

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
          <h2 className="text-2xl font-display font-bold text-white">Identify Yourself</h2>
          <p className="text-text-secondary">Enter your email to begin transmission.</p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          <Input
            label="EMAIL ADDRESS"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={error}
            autoFocus
            className="text-lg"
          />

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={!email}
          >
            Continue
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
