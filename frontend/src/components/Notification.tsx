import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

export default function Notifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/notifications/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]); // 🔥 added dependency so it updates when userId changes

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className="p-3 border rounded-lg bg-muted hover:bg-accent transition"
          >
            <h3 className="font-medium">{n.title}</h3>
            <p className="text-sm text-muted-foreground">{n.message}</p>
            <span className="text-xs text-gray-400">{n.timestamp}</span>
          </div>
        ))
      )}
    </div>
  );
}
