import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Trash2, 
  MessageSquare,
  Megaphone,
  DollarSign,
  Clock,
  ClipboardList,
  Users,
  Award,
  BookOpen,
  Check,
  XCircle
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

const NotificationsPanel = ({ isOpen, onClose, userRole = 'all' }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    getUnreadCount,
    getNotificationsForRole 
  } = useNotifications();

  // Filter notifications by user role
  const roleNotifications = getNotificationsForRole(userRole);

  const getIcon = (type, icon) => {
    // Use custom icon if provided
    if (icon) {
      switch (icon) {
        case 'message':
          return <MessageSquare className="w-5 h-5 text-blue-600" />;
        case 'megaphone':
          return <Megaphone className="w-5 h-5 text-orange-600" />;
        case 'dollar':
          return <DollarSign className="w-5 h-5 text-green-600" />;
        case 'clock':
          return <Clock className="w-5 h-5 text-orange-600" />;
        case 'clipboard':
          return <ClipboardList className="w-5 h-5 text-purple-600" />;
        case 'users':
          return <Users className="w-5 h-5 text-indigo-600" />;
        case 'award':
          return <Award className="w-5 h-5 text-yellow-600" />;
        case 'book':
          return <BookOpen className="w-5 h-5 text-blue-600" />;
        case 'check':
          return <Check className="w-5 h-5 text-green-600" />;
        case 'x':
          return <XCircle className="w-5 h-5 text-red-600" />;
        case 'alert':
          return <AlertTriangle className="w-5 h-5 text-orange-600" />;
        default:
          return <Bell className="w-5 h-5 text-gray-600" />;
      }
    }

    // Fallback to type-based icons
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'announcement':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const unreadCount = roleNotifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Bell className="w-6 h-6" />
                  <h2 className="text-xl font-bold">الإشعارات</h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-100 hover:text-white transition-colors"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto h-[calc(100%-140px)] p-4">
              {roleNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {roleNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${getBgColor(notification.type)} ${
                        !notification.read ? 'border-r-4' : ''
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {getIcon(notification.type, notification.icon)}
                          <h3 className="font-semibold text-gray-800">
                            {notification.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            تحديد كمقروء
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;