import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { motion } from 'motion/react';

export default function OnboardingComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/chats');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="relative"
        >
          <div className="w-24 h-24 bg-accent-cyan/10 border border-accent-cyan flex items-center justify-center text-accent-cyan clip-corners animate-pulse">
            <Hexagon size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 bg-accent-cyan/20 blur-xl -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">
            Signal Established
          </h2>
          <p className="text-text-secondary font-mono text-sm tracking-wide">
            Welcome to QUEPID.
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
