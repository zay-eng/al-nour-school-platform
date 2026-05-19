import { createContext, useState, useContext, useEffect } from 'react';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      time: 'الآن',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotification, ...notifications]);
    return newNotification;
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Get notifications for specific user role
  const getNotificationsForRole = (role) => {
    return notifications.filter(notif => 
      !notif.targetRole || notif.targetRole === role || notif.targetRole === 'all'
    );
  };

  // Helper functions to create specific notification types
  const notifyNewMessage = (from, message, targetRole = 'all') => {
    return addNotification({
      type: 'message',
      title: 'رسالة جديدة',
      message: `رسالة من ${from}: ${message}`,
      icon: 'message',
      targetRole
    });
  };

  const notifyNewAnnouncement = (title, type, targetRole = 'all') => {
    const typeLabels = {
      'exam': 'امتحان',
      'parents-teacher-meeting': 'اجتماع',
      'holiday': 'عطلة',
      'event': 'حدث'
    };
    return addNotification({
      type: 'announcement',
      title: 'إعلان جديد',
      message: `${typeLabels[type]}: ${title}`,
      icon: 'megaphone',
      targetRole
    });
  };

  const notifyAnnouncementApproved = (title, targetRole = 'teacher') => {
    return addNotification({
      type: 'success',
      title: 'تمت الموافقة على الإعلان',
      message: `تمت الموافقة على إعلان: ${title}`,
      icon: 'check',
      targetRole
    });
  };

  const notifyAnnouncementRejected = (title, targetRole = 'teacher') => {
    return addNotification({
      type: 'warning',
      title: 'تم رفض الإعلان',
      message: `تم رفض إعلان: ${title}`,
      icon: 'x',
      targetRole
    });
  };

  const notifyPaymentReceived = (amount, studentName, targetRole = 'admin') => {
    return addNotification({
      type: 'success',
      title: 'تم استلام دفعة',
      message: `تم استلام دفعة بقيمة ${amount} درهم من ${studentName}`,
      icon: 'dollar',
      targetRole
    });
  };

  const notifyPaymentDue = (amount, dueDate, targetRole = 'parent') => {
    return addNotification({
      type: 'warning',
      title: 'تذكير بالدفع',
      message: `موعد دفع ${amount} درهم في ${dueDate}`,
      icon: 'clock',
      targetRole
    });
  };

  const notifyExamReminder = (subject, date, time, targetRole = 'parent') => {
    return addNotification({
      type: 'info',
      title: 'تذكير بالامتحان',
      message: `امتحان ${subject} في ${date} الساعة ${time}`,
      icon: 'clipboard',
      targetRole
    });
  };

  const notifyMeetingReminder = (title, date, time, targetRole = 'all') => {
    return addNotification({
      type: 'info',
      title: 'تذكير بالاجتماع',
      message: `${title} في ${date} الساعة ${time}`,
      icon: 'users',
      targetRole
    });
  };

  const notifyGradePosted = (subject, grade, targetRole = 'parent') => {
    return addNotification({
      type: 'success',
      title: 'درجة جديدة',
      message: `تم نشر درجة ${subject}: ${grade}/20`,
      icon: 'award',
      targetRole
    });
  };

  const notifyAbsence = (studentName, date, targetRole = 'parent') => {
    return addNotification({
      type: 'warning',
      title: 'غياب',
      message: `غياب ${studentName} في ${date}`,
      icon: 'alert',
      targetRole
    });
  };

  const notifyLessonUploaded = (title, subject, className, targetRole = 'parent') => {
    return addNotification({
      type: 'info',
      title: 'درس جديد',
      message: `تم رفع درس ${title} - ${subject} لصف ${className}`,
      icon: 'book',
      targetRole
    });
  };

  // Update notification times (call this periodically)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => {
          const createdAt = new Date(notif.createdAt);
          const now = new Date();
          const diffMinutes = Math.floor((now - createdAt) / 60000);
          const diffHours = Math.floor(diffMinutes / 60);
          const diffDays = Math.floor(diffHours / 24);

          let timeText = 'الآن';
          if (diffMinutes < 1) {
            timeText = 'الآن';
          } else if (diffMinutes < 60) {
            timeText = `منذ ${diffMinutes} دقيقة`;
          } else if (diffHours < 24) {
            timeText = `منذ ${diffHours} ساعة`;
          } else {
            timeText = `منذ ${diffDays} يوم`;
          }

          return { ...notif, time: timeText };
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getUnreadCount,
    getNotificationsForRole,
    // Helper functions
    notifyNewMessage,
    notifyNewAnnouncement,
    notifyAnnouncementApproved,
    notifyAnnouncementRejected,
    notifyPaymentReceived,
    notifyPaymentDue,
    notifyExamReminder,
    notifyMeetingReminder,
    notifyGradePosted,
    notifyAbsence,
    notifyLessonUploaded
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};
