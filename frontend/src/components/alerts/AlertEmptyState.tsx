import { Bell } from 'lucide-react';

export const AlertEmptyState = () => (
  <div className="p-20 text-center">
    <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Bell className="w-10 h-10 text-muted-app/50" />
    </div>
    <h3 className="text-xl font-bold mb-2">No new alerts</h3>
    <p className="text-muted-app font-medium">
      You're all caught up! We'll notify you when something needs attention.
    </p>
  </div>
);