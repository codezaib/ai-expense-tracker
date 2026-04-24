import React, { useState, useMemo } from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "../../components/common/Button";
import { AlertItem } from "../../components/alerts/AlertItem";
import { AlertTabs } from "../../components/alerts/AlertTabs";
import { AlertEmptyState } from "../../components/alerts/AlertEmptyState";
import {
  useGetAlertsQuery,
  useMarkAllReadMutation,
} from "../../store/api/alertsApi";

type Tab = "All" | "Unread" | "Critical";

const AlertsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const { data: alertsResponse, isLoading, isError } = useGetAlertsQuery();
  const alerts = alertsResponse?.alerts ?? [];
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllReadMutation();

  const filtered = useMemo(() => {
    if (activeTab === "Unread") return alerts?.filter((a) => !a.is_read);
    return alerts;
  }, [alerts, activeTab]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Notifications
          </h1>
          <p className="text-muted-app font-medium">
            Stay updated with your financial alerts and insights.
          </p>
        </div>
        <Button
          variant="secondary"
          icon={CheckCheck}
          onClick={() => markAllRead()}
          disabled={isMarkingAll}
          className={"cursor-pointer"}
        >
          Mark all as read
        </Button>
      </div>

      <div className="bg-surface border border-app rounded-3xl overflow-hidden shadow-sm">
        <AlertTabs active={activeTab} onChange={setActiveTab} />

        <div className="divide-y divide-app">
          {isLoading ? (
            <div className="p-20 text-center text-muted-app font-medium">
              Loading alerts...
            </div>
          ) : isError ? (
            <div className="p-20 text-center text-danger font-medium">
              Failed to load alerts.
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((alert: any) => (
              <AlertItem key={alert.id} alert={alert} />
            ))
          ) : (
            <AlertEmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
