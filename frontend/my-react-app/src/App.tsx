import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { UsernameModal } from './components/UsernameModal';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'username' | 'chat'>('landing');
  const [username, setUsername] = useState('');

  const handleEnterChat = () => {
    setScreen('username');
  };

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setScreen('chat');
  };

  const handleBackToLanding = () => {
    setScreen('landing');
    setUsername('');
  };

  return (
    <div className="min-h-screen bg-black">
      {screen === 'landing' && <LandingPage onEnterChat={handleEnterChat} />}
      {screen === 'username' && (
        <UsernameModal 
          onSubmit={handleUsernameSubmit} 
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'chat' && (
        <ChatInterface 
          username={username} 
          onExit={handleBackToLanding}
        />
      )}
    </div>
  );
}
