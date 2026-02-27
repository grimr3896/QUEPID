import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Check } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { motion } from 'motion/react';
import { useStore } from '@/store';

export default function AccountActivatedScreen() {
  const navigate = useNavigate();
  const { setCurrentUser } = useStore();

  useEffect(() => {
    // Log the user in
    setCurrentUser({
      id: 'new_user',
      email: 'user@example.com',
      emailVerified: true,
      username: 'nova.x',
      displayName: '',
      avatarUrl: '',
      status: 'active_signal',
      accountStatus: 'active',
      readReceiptsEnabled: true,
      createdAt: new Date(),
    });

    // Redirect to onboarding after delay
    const timer = setTimeout(() => {
      navigate('/onboarding/name');
    }, 2500);

    return () => clearTimeout(timer);
  }, [setCurrentUser, navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-success/10 border border-success flex items-center justify-center text-success clip-corners">
            <Check size={48} strokeWidth={3} />
          </div>
          <div className="absolute inset-0 bg-success/20 blur-xl -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase">
            Transmission Confirmed
          </h2>
          <p className="text-text-secondary font-mono text-sm">
            Account Activated. Initializing...
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
