import { motion } from 'motion/react';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';

interface LandingPageProps {
  onEnterChat: () => void;
}

export function LandingPage({ onEnterChat }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AnonChat
            </h1>
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12 max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-6">
            Chat with <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Strangers</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl">
            Connect anonymously with people around the world. No registration, no commitments, just real conversations.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterChat}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xl shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300"
        >
          Start Chatting
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full"
        >
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Anonymous"
            description="Stay completely anonymous. No personal info required."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Instant"
            description="Connect instantly with random strangers worldwide."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Safe"
            description="Skip and report inappropriate behavior anytime."
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl"
    >
      <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4 text-blue-400">
        {icon}
      </div>
      <h3 className="text-white text-xl mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}
