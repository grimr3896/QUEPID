import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { HexAvatar } from '@/components/ui/HexAvatar';
import { Camera, Upload } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { useStore } from '@/store';

export default function OnboardingAvatar() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useStore();

  const handleContinue = () => {
    // In a real app, handle upload here
    // For demo, set a default if none
    if (!currentUser?.avatarUrl) {
      updateUserProfile({ 
        avatarUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${currentUser?.username}&backgroundColor=080B14&shape1Color=00E5FF` 
      });
    }
    navigate('/onboarding/about');
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
          <div className="w-2 h-2 rounded-full bg-accent-cyan" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-display font-bold text-white">Visual ID</h2>
          <p className="text-text-secondary">Put a face to your signal.</p>
        </div>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative group cursor-pointer">
            <HexAvatar 
              src={currentUser?.avatarUrl || `https://api.dicebear.com/9.x/shapes/svg?seed=${currentUser?.username}&backgroundColor=080B14&shape1Color=00E5FF`} 
              alt="Avatar Preview" 
              size="xl"
              className="w-40 h-40"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hexagon-clip">
              <Camera className="text-white" size={32} />
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Button variant="secondary" className="flex-1 gap-2">
              <Camera size={18} /> Camera
            </Button>
            <Button variant="secondary" className="flex-1 gap-2">
              <Upload size={18} /> Gallery
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleContinue}
            variant="primary" 
            size="lg" 
            className="w-full"
          >
            Continue
          </Button>
          <Button 
            onClick={handleContinue}
            variant="ghost" 
            size="sm" 
            className="w-full"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
