import {
  AlertCircle,
  AlertTriangle,
  Info,
  MoreVertical,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import {
  useMarkAlertReadMutation,
  useDismissAlertMutation,
} from "../../store/api/alertsApi";

interface Alert {
  id: number;
  type: "danger" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  is_read: boolean;
}

const ICON_STYLES = {
  danger: {
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
};

export const AlertItem = ({ alert }: { alert: Alert }) => {
  const [markRead] = useMarkAlertReadMutation();
  const [dismiss] = useDismissAlertMutation();

  const style = ICON_STYLES[alert.type] ?? ICON_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      className={clsx(
        "p-6 flex gap-6 transition-all hover:bg-muted/5 relative group",
        !alert.is_read && "bg-primary/[0.02]",
      )}
    >
      {!alert.is_read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}

      <div
        className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
          style.bg,
          style.color,
          style.border,
        )}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-lg">{alert.title}</h4>
          <span className="text-xs text-muted-app font-medium">
            {alert.time}
          </span>
        </div>
        <p className="text-muted-app font-medium leading-relaxed">
          {alert.message}
        </p>

        <div className="mt-4 flex items-center gap-3">
          {!alert.is_read && (
            <button
              className="text-xs font-bold text-muted-app hover:text-app cursor-pointer"
              onClick={() => markRead(alert.id)}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title="Dismiss"
          className="p-2 bg-danger/10 text-danger rounded-lg"
          onClick={() => dismiss(alert.id)}
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};
