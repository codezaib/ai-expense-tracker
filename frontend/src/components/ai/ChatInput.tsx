import { Paperclip, Send } from "lucide-react";
import { Button } from "../common/Button";

interface ChatInputProps {
  input: string;
  isTyping: boolean;
  onChange: (val: string) => void;
  onSend: () => void;
}

export const ChatInput = ({
  input,
  isTyping,
  onChange,
  onSend,
}: ChatInputProps) => (
  <div className="p-6 bg-panel/50 border-t border-app">
    <div className="relative group">
      <textarea
        placeholder="Type your message here..."
        className="w-full bg-app border border-app rounded-2xl pl-5 pr-32 py-4 h-16 resize-none outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button
          variant="primary"
          onClick={onSend}
          className="h-10 px-4 rounded-xl shadow-lg shadow-primary/20"
          icon={Send}
          disabled={!input.trim() || isTyping}
        >
          Send
        </Button>
      </div>
    </div>
    <p className="text-[10px] text-center text-muted-app font-bold mt-4 uppercase tracking-widest">
      SpendWise AI can analyze history and log new records automatically.
    </p>
  </div>
);
