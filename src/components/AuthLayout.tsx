import React from 'react';
import { motion } from 'motion/react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-bg-primary relative flex items-center justify-center overflow-hidden">
      {/* Animated Star Field Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.8 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
            }}
          />
        ))}
        {/* Nebula effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[120px]" />
      </div>

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative z-10 w-full max-w-md p-6"
      >
        {children}
      </motion.div>
    </div>
  );
}
