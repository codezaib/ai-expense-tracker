import { Bot } from "lucide-react";
import { motion } from "motion/react";

export const TypingIndicator = () => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
      <Bot className="w-5 h-5" />
    </div>
    <div className="bg-app border border-app px-6 py-4 rounded-3xl rounded-tl-none flex items-center gap-1.5">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.6, delay }}
          className="w-1.5 h-1.5 bg-primary rounded-full"
        ></motion.div>
      ))}
    </div>
  </div>
);
