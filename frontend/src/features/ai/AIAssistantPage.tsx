import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Settings, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSendMessageMutation } from "../../store/api/aiApi";
import { ChatMessage } from "../../components/ai/ChatMessage";
import { TypingIndicator } from "../../components/ai/TypingIndicator";
import { ChatInput } from "../../components/ai/ChatInput";
import { AIConfigPanel } from "../../components/ai/AIConfigPanel";
import { useAIPreferences } from "../../utils/useAIPreferences";

const INITIAL_MESSAGE = {
  id: 1,
  role: "assistant" as const,
  text: 'Hello! I am your SpendWise Assistant. You can tell me things like "I spent $50 on groceries today" or ask "How much did I spend in April?"',
  timestamp: new Date(),
};

const AIAssistantPage = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const { prefs, updatePrefs, resetPrefs } = useAIPreferences();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sendMessage, { isLoading: isTyping }] = useSendMessageMutation();

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev: any) => [
      ...prev,
      { id: Date.now(), role: "user", text: input, timestamp: new Date() },
    ]);
    setInput("");

    try {
      const result = await sendMessage({
        message: input,
        model: prefs.model || undefined,
        apiKey: prefs.apiKey || undefined,
        prompt: prefs.systemPrompt || undefined,
      }).unwrap();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: result.response ?? "I'm sorry, I couldn't process that.",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      toast.error(
        "AI assistant is currently unavailable. reset model, api key to default",
      );
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col max-w-4xl mx-auto bg-panel border border-app rounded-3xl overflow-hidden shadow-2xl relative">
      <AnimatePresence>
        {isConfigOpen && (
          <AIConfigPanel
            config={prefs}
            onChange={updatePrefs}
            onReset={resetPrefs}
            onClose={() => setIsConfigOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-app flex items-center justify-between bg-panel/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black">AI Assistant</h3>
            <p className="text-[10px] uppercase font-bold text-success tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Connected & Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`p-2 rounded-lg transition-colors ${isConfigOpen ? "bg-primary/20 text-primary" : "hover:bg-muted/10 text-muted-app hover:text-app cursor-pointer"}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMessages([INITIAL_MESSAGE])}
            className="p-2 hover:bg-danger/10 text-muted-app cursor-pointer rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
      </div>

      <ChatInput
        input={input}
        isTyping={isTyping}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
};

export default AIAssistantPage;
