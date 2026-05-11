import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import api from "../api";
import { useAppContext } from "../context/AppContext";

export default function NotificationBell() {
  const { lang } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifsRes, countRes] = await Promise.all([
          api.get("/api/notifications"),
          api.get("/api/notifications/unread-count")
        ]);

        setNotifications(notifsRes);
        setUnreadCount(countRes.count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/api/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDelete = async (id) => {
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

  const content = {
    en: {
      title: "Notifications",
      markAllRead: "Mark all as read",
      noNotifications: "No notifications",
      empty: "You're all caught up!",
      types: {
        NEW_PROPERTY: "New Property",
        PRICE_CHANGE: "Price Change",
        LEAD_RESPONSE: "Lead Response",
        REMINDER: "Reminder"
      }
    },
    ar: {
      title: "الإشعارات",
      markAllRead: "تعيين الكل كمقروء",
      noNotifications: "لا توجد إشعارات",
      empty: "لقد قرأت جميع الإشعارات!",
      types: {
        NEW_PROPERTY: "عقار جديد",
        PRICE_CHANGE: "تغيير السعر",
        LEAD_RESPONSE: "رد على الاستفسار",
        REMINDER: "تذكير"
      }
    }
  };

  const t = content[lang];

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
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#ef4444",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white"
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
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 12,
            width: "min(380px, calc(100vw - 2rem))",
            maxHeight: "min(500px, 80vh)",
            background: "white",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            zIndex: 1000,
            overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <h3 style={{
                fontFamily: "var(--serif)",
                fontSize: "1.2rem",
                color: "var(--navy)",
                fontWeight: 400,
                margin: 0
              }}>
                {t.title}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    padding: "6px 12px",
                    background: "var(--gold)",
                    color: "var(--navy)",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--navy)";
                    e.currentTarget.style.color = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--gold)";
                    e.currentTarget.style.color = "var(--navy)";
                  }}
                >
                  {t.markAllRead}
                </button>
              )}
            </div>

            <div style={{
              maxHeight: 400,
              overflowY: "auto"
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "var(--gray)"
                }}>
                  <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                  <p style={{ margin: 0 }}>{t.empty}</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      background: notification.read ? "transparent" : "rgba(201,168,76,0.03)",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notification.read ? "transparent" : "rgba(201,168,76,0.03)";
                    }}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12
                    }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: notification.read ? "rgba(0,0,0,0.05)" : "var(--gold)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {notification.read ? (
                          <Check size={16} color="var(--gray)" />
                        ) : (
                          <Bell size={16} color="var(--navy)" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4
                        }}>
                          <span style={{
                            fontSize: "0.75rem",
                            color: "var(--gold)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}>
                            {t.types[notification.type] || notification.type}
                          </span>
                          <span style={{
                            fontSize: "0.75rem",
                            color: "var(--gray)"
                          }}>
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 style={{
                          fontFamily: "var(--serif)",
                          fontSize: "1rem",
                          color: "var(--navy)",
                          fontWeight: 400,
                          margin: "0 0 4px 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {notification.title}
                        </h4>
                        <p style={{
                          fontSize: "0.85rem",
                          color: "var(--gray)",
                          margin: 0,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}>
                          {notification.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        style={{
                          padding: 4,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--gray)",
                          transition: "all 0.3s ease",
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--gray)";
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
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
