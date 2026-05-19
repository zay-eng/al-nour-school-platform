import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  UserPlus,
  FileText,
  Calendar,
  BarChart3,
  Download,
  Bell,
  Settings,
  LogOut,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  MessageSquare,
  FileDown,
  Megaphone,
  Check,
  X,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsPanel from '../common/NotificationsPanel';
import SettingsPanel from '../common/SettingsPanel';
import StudentManagement from '../admin/StudentManagement';
import TeacherManagement from '../admin/TeacherManagement';
import FinanceManagement from '../admin/FinanceManagement';
import MessagingSystem from '../admin/MessagingSystem';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { announcements, getPendingAnnouncements, approveAnnouncement, rejectAnnouncement } = useAnnouncements();
  const { getUnreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnnouncementDetails, setShowAnnouncementDetails] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementFilter, setAnnouncementFilter] = useState('pending'); // 'pending', 'approved', 'all'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Navigation menu items
  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'students', label: 'التلاميذ', icon: <Users className="w-5 h-5" /> },
    { id: 'teachers', label: 'الأساتذة', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'finance', label: 'المالية', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'messages', label: 'الرسائل', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'announcements', label: 'الإعلانات', icon: <Megaphone className="w-5 h-5" />, badge: getPendingAnnouncements().length },
  ];

  // بيانات إحصائية
  const stats = [
    {
      title: 'إجمالي التلاميذ',
      value: '342',
      change: '+12',
      changeType: 'increase',
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'نسبة الأداء المالي',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'نسبة الحضور',
      value: '94%',
      change: '+2%',
      changeType: 'increase',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'التنبيهات النشطة',
      value: '7',
      change: '-3',
      changeType: 'decrease',
      icon: <AlertCircle className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // آخر التلاميذ المسجلين
  const recentStudents = [
    { id: 1, name: 'أحمد محمد', class: 'السنة الخامسة', status: 'paid', date: '2024-05-01' },
    { id: 2, name: 'فاطمة علي', class: 'السنة الرابعة', status: 'pending', date: '2024-05-02' },
    { id: 3, name: 'محمد حسن', class: 'السنة السادسة', status: 'paid', date: '2024-05-03' },
    { id: 4, name: 'سارة أحمد', class: 'السنة الثالثة', status: 'unpaid', date: '2024-05-04' },
  ];

  // التنبيهات
  const alerts = [
    { id: 1, type: 'warning', message: '15 عائلة لم تدفع منذ أكثر من 30 يوماً', time: 'منذ ساعة' },
    { id: 2, type: 'info', message: 'امتحان نهاية الفصل الأول بعد أسبوعين', time: 'منذ 3 ساعات' },
    { id: 3, type: 'success', message: 'تم تسجيل 5 تلاميذ جدد هذا الأسبوع', time: 'منذ يوم' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddStudent = () => {
    console.log('Adding new student...');
    // TODO: Implement add student functionality
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
    // TODO: Implement Excel export
  };

  const handleViewAllStudents = () => {
    console.log('Viewing all students...');
    // TODO: Navigate to students page
  };

  const handleViewAllAlerts = () => {
    console.log('Viewing all alerts...');
    // TODO: Navigate to alerts page
  };

  const handleApproveAnnouncement = (announcementId) => {
    approveAnnouncement(announcementId);
    alert('تم الموافقة على الإعلان بنجاح!');
    setShowAnnouncementDetails(false);
  };

  const handleRejectAnnouncement = (announcementId) => {
    if (confirm('هل أنت متأكد من رفض هذا الإعلان؟ سيتم حذفه نهائياً.')) {
      rejectAnnouncement(announcementId);
      alert('تم رفض وحذف الإعلان!');
      setShowAnnouncementDetails(false);
    }
  };

  const handleViewAnnouncementDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200" dir="rtl">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        className="w-64 bg-white dark:bg-gray-800 shadow-lg fixed right-0 top-0 h-full overflow-y-auto transition-all duration-300 z-40"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white">مدرسة النور</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">لوحة المدير</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors relative ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    {menuItems.find(item => item.id === activeTab)?.label || 'لوحة التحكم'}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">مدرسة النور الخاصة</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {getUnreadCount() > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount()}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>خروج</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main>
          {activeTab === 'overview' && <OverviewContent stats={stats} recentStudents={recentStudents} alerts={alerts} handleAddStudent={handleAddStudent} handleExportExcel={handleExportExcel} handleViewAllStudents={handleViewAllStudents} handleViewAllAlerts={handleViewAllAlerts} />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'teachers' && <TeacherManagement />}
          {activeTab === 'finance' && <FinanceManagement />}
          {activeTab === 'messages' && <MessagingSystem />}
          {activeTab === 'announcements' && <AnnouncementsManagement announcements={announcements} announcementFilter={announcementFilter} setAnnouncementFilter={setAnnouncementFilter} handleViewAnnouncementDetails={handleViewAnnouncementDetails} />}
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        userRole="admin"
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Announcement Details Modal */}
      {showAnnouncementDetails && selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAnnouncementDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Megaphone className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
                    <p className="text-blue-100 text-sm mt-1">إعلان من {selectedAnnouncement.createdBy}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnnouncementDetails(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedAnnouncement.status === 'approved' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedAnnouncement.status === 'approved' ? '✓ موافق عليه' : '⏳ في انتظار الموافقة'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{selectedAnnouncement.createdAt}</span>
                </div>

                {/* Type Badge */}
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">نوع الإعلان</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {selectedAnnouncement.type === 'exam' && '📝 امتحان'}
                    {selectedAnnouncement.type === 'parents-teacher-meeting' && '👥 اجتماع أولياء الأمور'}
                    {selectedAnnouncement.type === 'holiday' && '🏖️ عطلة'}
                    {selectedAnnouncement.type === 'event' && '🎉 حدث'}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">التاريخ</p>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{selectedAnnouncement.date}</p>
                    </div>
                  </div>
                  {selectedAnnouncement.time && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">الوقت</p>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{selectedAnnouncement.time}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Class (if applicable) */}
                {selectedAnnouncement.class && (
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">الصف</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400">{selectedAnnouncement.class}</p>
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">التفاصيل</p>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{selectedAnnouncement.description}</p>
                </div>

                {/* Target Audience */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">الجمهور المستهدف</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.targetAudience.map((audience, idx) => (
                      <span key={idx} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-semibold flex items-center space-x-2 space-x-reverse">
                        <Users className="w-4 h-4" />
                        <span>
                          {audience === 'parents' && 'أولياء الأمور'}
                          {audience === 'teachers' && 'المعلمون'}
                          {audience === 'admin' && 'الإدارة'}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 flex justify-between">
              <button
                onClick={() => setShowAnnouncementDetails(false)}
                className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                إغلاق
              </button>
              {selectedAnnouncement.status === 'pending' && (
                <div className="flex space-x-3 space-x-reverse">
                  <button
                    onClick={() => handleRejectAnnouncement(selectedAnnouncement.id)}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                    <span>رفض</span>
                  </button>
                  <button
                    onClick={() => handleApproveAnnouncement(selectedAnnouncement.id)}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    <Check className="w-5 h-5" />
                    <span>موافقة</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Announcements Management Component
const AnnouncementsManagement = ({ announcements, announcementFilter, setAnnouncementFilter, handleViewAnnouncementDetails }) => {
  const filteredAnnouncements = announcementFilter === 'all' 
    ? announcements 
    : announcements.filter(a => a.status === announcementFilter);

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الإعلانات</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">الموافقة على الإعلانات أو رفضها</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 space-x-reverse mb-6 border-b dark:border-gray-700">
          <button 
            onClick={() => setAnnouncementFilter('pending')}
            className={`px-4 py-2 text-sm font-semibold ${
              announcementFilter === 'pending'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            في الانتظار ({announcements.filter(a => a.status === 'pending').length})
          </button>
          <button 
            onClick={() => setAnnouncementFilter('approved')}
            className={`px-4 py-2 text-sm font-semibold ${
              announcementFilter === 'approved'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            موافق عليها ({announcements.filter(a => a.status === 'approved').length})
          </button>
          <button 
            onClick={() => setAnnouncementFilter('all')}
            className={`px-4 py-2 text-sm font-semibold ${
              announcementFilter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            الكل ({announcements.length})
          </button>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
              <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-semibold">لا توجد إعلانات</p>
              <p className="text-sm mt-2">
                {announcementFilter === 'pending' && 'لا توجد إعلانات في انتظار الموافقة'}
                {announcementFilter === 'approved' && 'لا توجد إعلانات موافق عليها'}
                {announcementFilter === 'all' && 'لا توجد إعلانات بعد'}
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all p-6 border-r-4 cursor-pointer ${
                  announcement.status === 'pending' ? 'border-yellow-500' : 'border-green-500'
                }`}
                onClick={() => handleViewAnnouncementDetails(announcement)}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    announcement.status === 'approved' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {announcement.status === 'approved' ? 'موافق عليه' : 'في الانتظار'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{announcement.createdAt}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{announcement.title}</h3>

                {/* Type Badge */}
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold mb-3">
                  {announcement.type === 'parents-teacher-meeting' && 'اجتماع'}
                  {announcement.type === 'exam' && 'امتحان'}
                  {announcement.type === 'holiday' && 'عطلة'}
                  {announcement.type === 'event' && 'حدث'}
                </span>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{announcement.description}</p>

                {/* Date & Time */}
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Calendar className="w-4 h-4" />
                    <span>{announcement.date}</span>
                  </div>
                  {announcement.time && (
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-4 h-4" />
                      <span>{announcement.time}</span>
                    </div>
                  )}
                </div>

                {/* Creator */}
                <div className="pt-4 border-t dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    بواسطة: <span className="font-semibold">{announcement.createdBy}</span>
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Statistics */}
        {announcements.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">في الانتظار</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {announcements.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">موافق عليها</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {announcements.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">إجمالي الإعلانات</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{announcements.length}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Overview Content Component (extracted from original dashboard)
const OverviewContent = ({ stats, recentStudents, alerts, handleAddStudent, handleExportExcel, handleViewAllStudents, handleViewAllAlerts }) => {
  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center text-sm font-semibold ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  stat.changeType === 'decrease' ? 'rotate-180' : ''
                }`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">آخر التلاميذ المسجلين</h2>
            <button 
              onClick={handleAddStudent}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة تلميذ</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الاسم</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الصف</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">حالة الدفع</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{student.class}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : student.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status === 'paid' && <CheckCircle className="w-3 h-3 ml-1" />}
                        {student.status === 'pending' && <Clock className="w-3 h-3 ml-1" />}
                        {student.status === 'unpaid' && <XCircle className="w-3 h-3 ml-1" />}
                        {student.status === 'paid' ? 'مدفوع' : student.status === 'pending' ? 'قيد الانتظار' : 'غير مدفوع'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{student.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button 
              onClick={handleViewAllStudents}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              عرض جميع التلاميذ
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">تصدير Excel</span>
            </button>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-6">التنبيهات</h2>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border-r-4 ${
                  alert.type === 'warning' 
                    ? 'bg-orange-50 border-orange-500'
                    : alert.type === 'info'
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start">
                  <AlertCircle className={`w-5 h-5 ml-3 mt-0.5 ${
                    alert.type === 'warning' 
                      ? 'text-orange-500'
                      : alert.type === 'info'
                      ? 'text-blue-500'
                      : 'text-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleViewAllAlerts}
            className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            عرض جميع التنبيهات
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: <UserPlus className="w-6 h-6" />, label: 'إضافة تلميذ', color: 'blue' },
          { icon: <FileText className="w-6 h-6" />, label: 'التقارير', color: 'green' },
          { icon: <Calendar className="w-6 h-6" />, label: 'التقويم المدرسي', color: 'purple' },
          { icon: <BarChart3 className="w-6 h-6" />, label: 'الإحصائيات', color: 'orange' },
        ].map((action, index) => (
          <button
            key={index}
            className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4 space-x-reverse group`}
          >
            <div className={`p-3 bg-${action.color}-50 rounded-lg group-hover:scale-110 transition-transform`}>
              <div className={`text-${action.color}-600`}>
                {action.icon}
              </div>
            </div>
            <span className="font-semibold text-gray-800">{action.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;