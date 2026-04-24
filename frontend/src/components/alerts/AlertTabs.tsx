import { clsx } from "clsx";

type Tab = "All" | "Unread";
const TABS: Tab[] = ["All", "Unread"];

interface AlertTabsProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export const AlertTabs = ({ active, onChange }: AlertTabsProps) => (
  <div className="flex border-b border-app">
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={clsx(
          "px-8 py-5 text-sm font-bold border-b-2 transition-all",
          active === tab
            ? "border-primary text-primary"
            : "border-transparent text-muted-app hover:text-app hover:bg-muted/5",
        )}
      >
        {tab}
      </button>
    ))}
  </div>
);
