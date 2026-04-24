import { Bot, User } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const ChatMessage = ({ msg }: { msg: Message }) => (
  <motion.div
    key={msg.id}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
  >
    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
      msg.role === 'assistant'
        ? 'bg-primary/10 border-primary/20 text-primary'
        : 'bg-surface border-app text-muted-app'
    }`}>
      {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
    </div>

    <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
      <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed ${
        msg.role === 'assistant'
          ? 'bg-app border border-app rounded-tl-none'
          : 'bg-primary text-white rounded-tr-none'
      }`}>
        <Markdown components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-black">{children}</strong>,
        }}>
          {msg.text}
        </Markdown>
      </div>
      <p className="text-[10px] text-muted-app font-bold px-2">
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </motion.div>
);