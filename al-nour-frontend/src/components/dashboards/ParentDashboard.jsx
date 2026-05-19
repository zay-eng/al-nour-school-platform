import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Download,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  User,
  Users,
  CheckCircle,
  Award,
  Clock,
  Megaphone,
  X,
  CreditCard,
  History,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Send,
  Paperclip,
  Image as ImageIcon,
  Phone,
  Video,
  MoreVertical,
  Search,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsPanel from '../common/NotificationsPanel';
import SettingsPanel from '../common/SettingsPanel';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnnouncementDetails, setShowAnnouncementDetails] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // New modal states
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  
  // Messaging states
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Attendance calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Payment states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Get announcements from context
  const { getAnnouncementsForAudience } = useAnnouncements();
  const { getUnreadCount } = useNotifications();
  
  // معلومات الطالب
  const studentInfo = {
    name: 'أحمد محمد علي',
    class: 'السنة الخامسة أ',
    photo: '/images/student-avatar.jpg',
    overallAverage: 16.5,
    attendance: 98,
    rank: 3,
    totalStudents: 32
  };
  
  // Get approved announcements for parents (filtered by child's class)
  const parentAnnouncements = getAnnouncementsForAudience('parents', 'approved', studentInfo.class);

  // الدرجات حسب المادة
  const grades = [
    { subject: 'الرياضيات', grade: 18, trend: 'up', change: '+2' },
    { subject: 'العلوم', grade: 17, trend: 'up', change: '+1' },
    { subject: 'اللغة العربية', grade: 16, trend: 'stable', change: '0' },
    { subject: 'اللغة الفرنسية', grade: 15, trend: 'down', change: '-1' },
    { subject: 'التاريخ', grade: 17, trend: 'up', change: '+3' },
  ];

  // Detailed grades with history
  const detailedGrades = [
    { 
      subject: 'الرياضيات', 
      exam1: 18, 
      exam2: 17, 
      homework: 19, 
      participation: 18,
      average: 18,
      history: [
        { month: 'سبتمبر', grade: 16 },
        { month: 'أكتوبر', grade: 17 },
        { month: 'نوفمبر', grade: 18 },
      ]
    },
    { 
      subject: 'العلوم', 
      exam1: 17, 
      exam2: 16, 
      homework: 18, 
      participation: 17,
      average: 17,
      history: [
        { month: 'سبتمبر', grade: 16 },
        { month: 'أكتوبر', grade: 16 },
        { month: 'نوفمبر', grade: 17 },
      ]
    },
    { 
      subject: 'اللغة العربية', 
      exam1: 16, 
      exam2: 15, 
      homework: 17, 
      participation: 16,
      average: 16,
      history: [
        { month: 'سبتمبر', grade: 16 },
        { month: 'أكتوبر', grade: 16 },
        { month: 'نوفمبر', grade: 16 },
      ]
    },
    { 
      subject: 'اللغة الفرنسية', 
      exam1: 15, 
      exam2: 14, 
      homework: 16, 
      participation: 15,
      average: 15,
      history: [
        { month: 'سبتمبر', grade: 16 },
        { month: 'أكتوبر', grade: 15 },
        { month: 'نوفمبر', grade: 15 },
      ]
    },
    { 
      subject: 'التاريخ', 
      exam1: 17, 
      exam2: 16, 
      homework: 18, 
      participation: 17,
      average: 17,
      history: [
        { month: 'سبتمبر', grade: 14 },
        { month: 'أكتوبر', grade: 16 },
        { month: 'نوفمبر', grade: 17 },
      ]
    },
  ];

  // Attendance data (30 days)
  const attendanceData = [
    { date: '2024-01-01', status: 'present' },
    { date: '2024-01-02', status: 'present' },
    { date: '2024-01-03', status: 'present' },
    { date: '2024-01-04', status: 'absent' },
    { date: '2024-01-05', status: 'present' },
    { date: '2024-01-08', status: 'present' },
    { date: '2024-01-09', status: 'late' },
    { date: '2024-01-10', status: 'present' },
    { date: '2024-01-11', status: 'present' },
    { date: '2024-01-12', status: 'present' },
    { date: '2024-01-15', status: 'present' },
    { date: '2024-01-16', status: 'present' },
    { date: '2024-01-17', status: 'present' },
    { date: '2024-01-18', status: 'present' },
    { date: '2024-01-19', status: 'present' },
    { date: '2024-01-22', status: 'present' },
    { date: '2024-01-23', status: 'present' },
    { date: '2024-01-24', status: 'present' },
    { date: '2024-01-25', status: 'present' },
    { date: '2024-01-26', status: 'present' },
  ];

  // Payment history
  const paymentHistory = [
    { id: 1, date: '2024-01-15', amount: 1500, method: 'بطاقة بنكية', status: 'مكتمل' },
    { id: 2, date: '2023-12-10', amount: 1500, method: 'نقداً', status: 'مكتمل' },
    { id: 3, date: '2023-11-05', amount: 1350, method: 'بطاقة بنكية', status: 'مكتمل' },
  ];

  // Conversations for messaging
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'أستاذ محمد',
      role: 'teacher',
      subject: 'الرياضيات',
      avatar: null,
      lastMessage: 'تحسن ملحوظ في الأداء',
      lastMessageTime: '10:30',
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'teacher', text: 'مرحباً، أحمد يتقدم بشكل ممتاز', time: '09:15', read: true },
        { id: 2, sender: 'parent', text: 'شكراً على المتابعة', time: '09:20', read: true },
        { id: 3, sender: 'teacher', text: 'تحسن ملحوظ في الأداء', time: '10:30', read: false },
      ]
    },
    {
      id: 2,
      name: 'أستاذ العلوم',
      role: 'teacher',
      subject: 'العلوم',
      avatar: null,
      lastMessage: 'يرجى مراجعة الدرس الأخير',
      lastMessageTime: 'أمس',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'teacher', text: 'يرجى مراجعة الدرس الأخير', time: 'أمس', read: true },
      ]
    },
    {
      id: 3,
      name: 'الإدارة',
      role: 'admin',
      subject: null,
      avatar: null,
      lastMessage: 'تذكير بموعد الامتحان',
      lastMessageTime: '3 أيام',
      unread: 0,
      online: true,
      messages: [
        { id: 1, sender: 'admin', text: 'تذكير بموعد الامتحان', time: '3 أيام', read: true },
      ]
    },
  ]);

  // حالة الدفع
  const paymentStatus = {
    totalDue: 5000,
    paid: 4350,
    remaining: 650,
    dueDate: '2024-06-15',
    status: 'partial'
  };

  // آخر الرسائل
  const recentMessages = [
    { id: 1, from: 'أستاذ الرياضيات', message: 'تحسن ملحوظ في الأداء', time: 'منذ يوم', unread: true },
    { id: 2, from: 'أستاذ العلوم', message: 'يرجى مراجعة الدرس الأخير', time: 'منذ يومين', unread: false },
    { id: 3, from: 'الإدارة', message: 'تذكير بموعد الامتحان', time: 'منذ 3 أيام', unread: false },
  ];

  // الأحداث القادمة
  const upcomingEvents = [
    { id: 1, title: 'امتحان الرياضيات', date: '2024-05-15', type: 'exam' },
    { id: 2, title: 'رحلة مدرسية', date: '2024-05-20', type: 'trip' },
    { id: 3, title: 'اجتماع أولياء الأمور', date: '2024-05-25', type: 'meeting' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDownloadReportCard = () => {
    console.log('Downloading report card...');
    alert('جاري تحميل بطاقة النتائج...');
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handleViewAllMessages = () => {
    setShowMessagingModal(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'parent',
      text: messageInput,
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageInput, lastMessageTime: 'الآن' }
        : conv
    ));
    
    setMessageInput('');
  };

  const handleProcessPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    
    alert(`تم الدفع بنجاح!\nالمبلغ: ${paymentAmount} درهم\nالطريقة: ${paymentMethod === 'card' ? 'بطاقة بنكية' : 'نقداً'}`);
    setShowPaymentModal(false);
    setPaymentAmount('');
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getAttendanceStatus = (day) => {
    const dateStr = `2024-01-${String(day).padStart(2, '0')}`;
    const record = attendanceData.find(a => a.date === dateStr);
    return record?.status || null;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <BookOpen className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">لوحة تحكم ولي الأمر</h1>
                <p className="text-sm text-gray-600">متابعة {studentInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Student Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{studentInfo.name}</h2>
                <p className="text-orange-100 mb-2">{studentInfo.class}</p>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 ml-1" />
                    الترتيب: {studentInfo.rank} من {studentInfo.totalStudents}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="grid grid-cols-2 gap-6">
                <div 
                  onClick={() => setShowGradesModal(true)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <p className="text-orange-100 text-sm mb-1">المعدل العام</p>
                  <p className="text-4xl font-bold">{studentInfo.overallAverage}</p>
                </div>
                <div 
                  onClick={() => setShowAttendanceModal(true)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <p className="text-orange-100 text-sm mb-1">نسبة الحضور</p>
                  <p className="text-4xl font-bold">{studentInfo.attendance}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">الدرجات حسب المادة</h2>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button 
                  onClick={() => setShowGradesModal(true)}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>التفاصيل</span>
                </button>
                <button 
                  onClick={handleDownloadReportCard}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل البطاقة</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {grades.map((grade, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4 space-x-reverse flex-1">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{grade.subject}</h3>
                      <div className="flex items-center space-x-2 space-x-reverse mt-1">
                        <span className={`text-xs font-semibold ${
                          grade.trend === 'up' 
                            ? 'text-green-600'
                            : grade.trend === 'down'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {grade.change}
                        </span>
                        {grade.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {grade.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {grade.grade}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">حالة الدفع</h2>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">المبلغ المدفوع</p>
                <p className="text-2xl font-bold text-green-600">{paymentStatus.paid} درهم</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">المبلغ المتبقي</p>
                <p className="text-2xl font-bold text-orange-600">{paymentStatus.remaining} درهم</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">تاريخ الاستحقاق</p>
                <p className="text-lg font-semibold text-gray-800">{paymentStatus.dueDate}</p>
              </div>

              <button 
                onClick={handlePayNow}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-semibold"
              >
                الدفع الآن
              </button>
            </div>
          </motion.div>
        </div>

        {/* Messages & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">الرسائل</h2>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-4 rounded-lg border ${msg.unread ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-800">{msg.from}</h4>
                    {msg.unread && (
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{msg.message}</p>
                  <p className="text-xs text-gray-500">{msg.time}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={handleViewAllMessages}
              className="w-full mt-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              عرض جميع الرسائل
            </button>
          </motion.div>

          {/* Announcements Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">الإعلانات</h2>
              <Megaphone className="w-5 h-5 text-orange-600" />
            </div>

            <div className="space-y-4">
              {parentAnnouncements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">لا توجد إعلانات جديدة</p>
                </div>
              ) : (
                parentAnnouncements.slice(0, 3).map((announcement) => (
                  <div 
                    key={announcement.id}
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowAnnouncementDetails(true);
                    }}
                    className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-r-4 border-orange-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{announcement.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        announcement.type === 'exam' 
                          ? 'bg-red-100 text-red-700'
                          : announcement.type === 'parents-teacher-meeting'
                          ? 'bg-purple-100 text-purple-700'
                          : announcement.type === 'holiday'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {announcement.type === 'exam' && 'امتحان'}
                        {announcement.type === 'parents-teacher-meeting' && 'اجتماع'}
                        {announcement.type === 'holiday' && 'عطلة'}
                        {announcement.type === 'event' && 'حدث'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{announcement.description}</p>
                    <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Calendar className="w-3 h-3" />
                        <span>{announcement.date}</span>
                      </div>
                      {announcement.time && (
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-3 h-3" />
                          <span>{announcement.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {parentAnnouncements.length > 3 && (
              <button className="w-full mt-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                عرض جميع الإعلانات ({parentAnnouncements.length})
              </button>
            )}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">الأحداث القادمة</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    event.type === 'exam' 
                      ? 'bg-red-100'
                      : event.type === 'trip'
                      ? 'bg-blue-100'
                      : 'bg-purple-100'
                  }`}>
                    {event.type === 'exam' && <FileText className="w-6 h-6 text-red-600" />}
                    {event.type === 'trip' && <Calendar className="w-6 h-6 text-blue-600" />}
                    {event.type === 'meeting' && <Users className="w-6 h-6 text-purple-600" />}
                  </div>
                  <div className="mr-4 flex-1">
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="w-4 h-4 ml-1" />
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        userRole="parent"
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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Megaphone className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
                    <p className="text-orange-100 text-sm mt-1">إعلان من {selectedAnnouncement.createdBy}</p>
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Type Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedAnnouncement.type === 'exam' 
                      ? 'bg-red-100 text-red-700'
                      : selectedAnnouncement.type === 'parents-teacher-meeting'
                      ? 'bg-purple-100 text-purple-700'
                      : selectedAnnouncement.type === 'holiday'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedAnnouncement.type === 'exam' && '📝 امتحان'}
                    {selectedAnnouncement.type === 'parents-teacher-meeting' && '👥 اجتماع أولياء الأمور'}
                    {selectedAnnouncement.type === 'holiday' && '🏖️ عطلة'}
                    {selectedAnnouncement.type === 'event' && '🎉 حدث'}
                  </span>
                  <span className="text-sm text-gray-600">{selectedAnnouncement.createdAt}</span>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">التاريخ</p>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <p className="text-lg font-bold text-blue-700">{selectedAnnouncement.date}</p>
                    </div>
                  </div>
                  {selectedAnnouncement.time && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">الوقت</p>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <p className="text-lg font-bold text-purple-700">{selectedAnnouncement.time}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Class (if applicable) */}
                {selectedAnnouncement.class && (
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">الصف</p>
                    <p className="text-lg font-bold text-indigo-700">{selectedAnnouncement.class}</p>
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">التفاصيل</p>
                  <p className="text-gray-800 leading-relaxed">{selectedAnnouncement.description}</p>
                </div>

                {/* Important Note for Exams */}
                {selectedAnnouncement.type === 'exam' && (
                  <div className="bg-red-50 border-r-4 border-red-500 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      <strong>⚠️ مهم:</strong> يرجى التأكد من حضور الطالب في الموعد المحدد ومراجعة المواد المطلوبة.
                    </p>
                  </div>
                )}

                {/* Important Note for Meetings */}
                {selectedAnnouncement.type === 'parents-teacher-meeting' && (
                  <div className="bg-purple-50 border-r-4 border-purple-500 rounded-lg p-4">
                    <p className="text-sm text-purple-800">
                      <strong>📌 ملاحظة:</strong> حضوركم مهم لمناقشة تقدم الطالب الأكاديمي.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowAnnouncementDetails(false)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;