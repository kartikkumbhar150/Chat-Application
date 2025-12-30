import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, SkipForward, LogOut, Users } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";

interface ChatInterfaceProps {
  username: string;
  onExit: () => void;
}

interface Message {
  id: string;
  sender: "you" | "stranger";
  text: string;
  timestamp: Date;
}

export function ChatInterface({ username, onExit }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [strangerName, setStrangerName] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useRef(uuidv4());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  //  when tab closes / refreshes → leave room & requeue
useEffect(() => {
  const handleUnload = () => {
    if (client) {
      client.publish({
        destination: `/app/next/${userId.current}`,
      });
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  return () => window.removeEventListener("beforeunload", handleUnload);
}, [client]);


  // connect to backend + queue
  useEffect(() => {
  const setup = async () => {
    const socket = new SockJS("http://localhost:8080/chat");

    const c = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 3000,
    });

    c.onConnect = () => {
      c.subscribe(`/topic/queue/${userId.current}`, (msg) => {
  const body = msg.body;

  if (body === "WAIT") {
    setIsConnected(false);
    setStrangerName("Searching...");
    return;
  }

  if (body.startsWith("ROOM:")) {
    const room = body.split(":")[1];
    setRoomId(room);
    setIsConnected(true);
    setStrangerName("Stranger");
  }

  if (body === "LEFT") {
    setIsConnected(false);
    setRoomId(null);
    setStrangerName("Searching...");
    setMessages([]);

    client?.publish({
    destination: `/app/queue/${userId.current}`,
  });
  }
});


        
      c.publish({
        destination: `/app/queue/${userId.current}`,
      });
    };

    c.activate();
    setClient(c);

    return () => c.deactivate();
  };

  setup();
}, []);


  // subscribe to room messages
  useEffect(() => {
    if (!client || !roomId) return;

    client.subscribe(`/topic/room/${roomId}`, (msg) => {
      const m = JSON.parse(msg.body);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: m.sender === username ? "you" : "stranger",
          text: m.content,
          timestamp: new Date(),
        },
      ]);
    });
  }, [client, roomId, username]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !client || !roomId) return;

    client.publish({
      destination: `/app/room/${roomId}`,
      body: JSON.stringify({
        sender: username,
        content: inputValue.trim(),
      }),
    });

    setInputValue("");
  };

  const handleSkip = () => {
    setMessages([]);
    setIsConnected(false);
    setRoomId(null);

    client?.publish({
      destination: `/app/next/${userId.current}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-white">{username}</span>
                <span className="text-slate-500">↔</span>
                <span className="text-blue-400">
                  {strangerName || "Connecting..."}
                </span>
              </div>

              {isConnected && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-400">Connected</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExit}
              className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {!isConnected && (
            <div className="text-center py-8">
              <div className="inline-block p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Connecting to a stranger...
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.sender === "you" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-5 py-3 rounded-2xl ${
                  message.sender === "you"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-slate-800 text-slate-100"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </motion.div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected}
              className="flex-1 px-6 py-4 bg-slate-950/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            />

            <motion.button
              type="submit"
              disabled={!isConnected || !inputValue.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
