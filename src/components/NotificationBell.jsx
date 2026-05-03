import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle } from "lucide-react";
import api from "../api";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/api/notifications");
      setNotifications(response.data || []);
      setUnreadCount(response.data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
      if (!notifications.find(n => n.id === id)?.read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(201,168,76,0.1)",
          border: "1px solid rgba(201,168,76,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--gold)";
          e.currentTarget.style.color = "var(--navy)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201,168,76,0.1)";
          e.currentTarget.style.color = "var(--gold)";
        }}
      >
        <Bell size={20} color="var(--gold)" />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: -2,
            right: -2,
            background: "#ef4444",
            color: "#fff",
            fontSize: "0.65rem",
            fontWeight: 700,
            minWidth: 18,
            height: 18,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            style={{ 
              position: "fixed", 
              inset: 0, 
              zIndex: 999 
            }} 
            onClick={() => setIsOpen(false)} 
          />
          <div style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 340,
            maxHeight: 480,
            background: "rgba(10,22,40,.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(201,168,76,.2)",
            borderRadius: 8,
            zIndex: 1000,
            boxShadow: "0 16px 48px rgba(0,0,0,.4)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid rgba(255,255,255,.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ 
                color: "#fff", 
                fontSize: "0.9rem", 
                fontWeight: 600,
                margin: 0 
              }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--gold)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div style={{
              maxHeight: 380,
              overflowY: "auto",
              padding: "0.5rem 0"
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "rgba(255,255,255,.4)",
                  fontSize: "0.85rem"
                }}>
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    style={{
                      padding: "0.85rem 1.25rem",
                      borderBottom: "1px solid rgba(255,255,255,.04)",
                      cursor: notification.read ? "default" : "pointer",
                      background: notification.read ? "transparent" : "rgba(201,168,76,.03)",
                      display: "flex",
                      gap: "0.75rem",
                      position: "relative",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!notification.read) {
                        e.currentTarget.style.background = "rgba(201,168,76,.06)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notification.read ? "transparent" : "rgba(201,168,76,.03)";
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: notification.type === "success" 
                        ? "rgba(52,211,153,.1)" 
                        : "rgba(248,113,113,.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {notification.type === "success" ? (
                        <CheckCircle size={16} color="#34d399" />
                      ) : (
                        <AlertCircle size={16} color="#f87171" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: notification.read 
                          ? "rgba(255,255,255,.6)" 
                          : "#fff",
                        fontSize: "0.82rem",
                        marginBottom: "0.25rem",
                        fontWeight: notification.read ? 400 : 500
                      }}>
                        {notification.message}
                      </div>
                      <div style={{
                        color: "rgba(255,255,255,.3)",
                        fontSize: "0.7rem"
                      }}>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,.3)",
                        cursor: "pointer",
                        padding: 0,
                        opacity: 0,
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = 1;
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = 0;
                        e.currentTarget.style.color = "rgba(255,255,255,.3)";
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}