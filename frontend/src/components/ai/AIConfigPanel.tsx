import { Cloud, Eye, EyeOff, Maximize2, Save, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../common/Button";
import { useGetModelsQuery } from "../../store/api/aiApi";
import toast from "react-hot-toast";

interface AIConfig {
  model: string;
  apiKey: string;
  systemPrompt: string;
}

interface AIConfigPanelProps {
  config: AIConfig;
  onChange: (config: Partial<AIConfig>) => void;
  onReset: () => void;
  onClose: () => void;
}

export const AIConfigPanel = ({
  config,
  onChange,
  onReset,
  onClose,
}: AIConfigPanelProps) => {
  const [showKey, setShowKey] = useState(false);
  const { data: modelsData } = useGetModelsQuery(undefined);
  const models: { id: string; name: string }[] = modelsData?.models ?? [];
  const [draft, setDraft] = useState(config);

  const handleSave = () => {
    onChange(draft);
    toast.success("Config saved!");
    onClose();
  };

  const handleReset = () => {
    onReset();
    setDraft({ model: "", apiKey: "", systemPrompt: "" });
    toast.success("Reset to defaults!");
    onClose();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-y-0 right-0 w-80 bg-surface border-l border-app z-30 shadow-2xl p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-lg font-black">AI Config</h4>
        <button onClick={onClose} className="p-2 hover:bg-muted/10 rounded-lg">
          <Maximize2 className="w-4 h-4 rotate-45" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-2 text-success mb-2">
            <Cloud className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">
              Live Service
            </span>
          </div>
          <p className="text-[10px] text-muted-app font-medium">
            Configure models and keys for advanced analysis.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            AI Model
          </label>
          <select
            className="w-full bg-app border border-app rounded-xl px-4 py-3 text-xs focus:border-primary outline-none"
            value={draft.model}
            onChange={(e) => setDraft({ ...draft, model: e.target.value })}
          >
            <option value="">Default</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name ?? m.id}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              className="w-full bg-app border border-app rounded-xl pl-4 pr-10 py-3 text-xs focus:border-primary outline-none"
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-app hover:text-app"
            >
              {showKey ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-app ml-1">
            System Prompt (optional)
          </label>
          <textarea
            className="w-full bg-app border border-app rounded-xl px-4 py-3 text-xs focus:border-primary outline-none min-h-[100px]"
            value={draft.systemPrompt}
            onChange={(e) =>
              setDraft({ ...draft, systemPrompt: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Button
            icon={Save}
            className="w-full py-3 text-sm"
            variant="secondary"
            onClick={handleSave}
          >
            Save Config
          </Button>
          <Button
            icon={RotateCcw}
            className="w-full py-3 text-sm"
            variant="secondary"
            onClick={handleReset}
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
