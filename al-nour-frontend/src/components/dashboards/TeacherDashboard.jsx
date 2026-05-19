import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Users,
  ClipboardCheck,
  MessageSquare,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  Upload,
  AlertTriangle,
  X,
  Download,
  Save,
  UserCheck,
  UserX,
  Clock,
  Home,
  GraduationCap,
  ClipboardList,
  Megaphone,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsPanel from '../common/NotificationsPanel';
import SettingsPanel from '../common/SettingsPanel';
import TeacherMessagingSystem from '../teacher/TeacherMessagingSystem';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { announcements, addAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { getUnreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Modal states
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showReportCardModal, setShowReportCardModal] = useState(false);
  const [showExamAnnouncementModal, setShowExamAnnouncementModal] = useState(false);
  const [showLessonDetailsModal, setShowLessonDetailsModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showAnnouncementDetailsModal, setShowAnnouncementDetailsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementFilter, setAnnouncementFilter] = useState('all'); // 'all', 'pending', 'approved'
  
  // Selected session for attendance
  const [selectedSession, setSelectedSession] = useState(null);
  
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    type: '',
    description: '',
    date: '',
    time: '',
    class: '',
    targetAudience: []
  });
  
  // Students data for attendance
  const [students, setStudents] = useState([
    { id: 1, name: 'أحمد محمد علي', status: null },
    { id: 2, name: 'فاطمة حسن', status: null },
    { id: 3, name: 'محمد عبدالله', status: null },
    { id: 4, name: 'سارة أحمد', status: null },
    { id: 5, name: 'علي حسين', status: null },
    { id: 6, name: 'مريم خالد', status: null },
    { id: 7, name: 'يوسف إبراهيم', status: null },
    { id: 8, name: 'نور الهدى', status: null },
  ]);
  
  // Grades data with class information
  const [gradesData, setGradesData] = useState([
    { id: 1, name: 'أحمد محمد علي', class: 'السنة الخامسة أ', exam1: '15', exam2: '16', homework: '14', participation: '17' },
    { id: 2, name: 'فاطمة حسن', class: 'السنة الخامسة أ', exam1: '18', exam2: '17', homework: '19', participation: '18' },
    { id: 3, name: 'محمد عبدالله', class: 'السنة الخامسة أ', exam1: '12', exam2: '13', homework: '11', participation: '14' },
    { id: 4, name: 'سارة أحمد', class: 'السنة السادسة ب', exam1: '16', exam2: '15', homework: '17', participation: '16' },
    { id: 5, name: 'علي حسين', class: 'السنة السادسة ب', exam1: '14', exam2: '15', homework: '13', participation: '15' },
    { id: 6, name: 'مريم خالد', class: 'السنة السادسة ب', exam1: '19', exam2: '18', homework: '20', participation: '19' },
    { id: 7, name: 'يوسف إبراهيم', class: 'السنة الرابعة أ', exam1: '13', exam2: '14', homework: '12', participation: '13' },
    { id: 8, name: 'نور الهدى', class: 'السنة الرابعة أ', exam1: '17', exam2: '16', homework: '18', participation: '17' },
    { id: 9, name: 'خالد محمود', class: 'السنة الرابعة أ', exam1: '11', exam2: '12', homework: '10', participation: '12' },
    { id: 10, name: 'ليلى حسن', class: 'السنة الخامسة أ', exam1: '16', exam2: '17', homework: '15', participation: '16' },
  ]);
  
  // Class filter for grades
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  
  // Lesson upload data
  const [lessonData, setLessonData] = useState({
    title: '',
    class: '',
    subject: '',
    description: '',
    file: null
  });
  
  // Uploaded lessons
  const [uploadedLessons, setUploadedLessons] = useState([
    { id: 1, title: 'درس الكسور', class: 'السنة الخامسة أ', subject: 'الرياضيات', date: '2024-01-15' },
    { id: 2, title: 'الأعداد العشرية', class: 'السنة السادسة ب', subject: 'الرياضيات', date: '2024-01-14' },
  ]);

  // جدول اليوم
  const todaySchedule = [
    { id: 1, time: '08:00 - 09:00', class: 'السنة الخامسة أ', subject: 'الرياضيات', room: 'قاعة 12' },
    { id: 2, time: '09:00 - 10:00', class: 'السنة السادسة ب', subject: 'الرياضيات', room: 'قاعة 15' },
    { id: 3, time: '10:30 - 11:30', class: 'السنة الرابعة أ', subject: 'الرياضيات', room: 'قاعة 12' },
  ];

  // آخر الرسائل
  const recentMessages = [
    { id: 1, from: 'أحمد محمد (ولي أمر)', message: 'استفسار عن درجات الابن في الامتحان الأخير', time: 'منذ ساعة', unread: true },
    { id: 2, from: 'فاطمة علي (ولي أمر)', message: 'شكراً على المتابعة المستمرة', time: 'منذ 3 ساعات', unread: false },
    { id: 3, from: 'الإدارة', message: 'تذكير: تسليم درجات الفصل الأول', time: 'منذ يوم', unread: true },
  ];

  // التنبيهات
  const alerts = [
    { id: 1, type: 'warning', student: 'محمد حسن', message: 'غياب متكرر (5 أيام)', class: 'السنة الخامسة أ' },
    { id: 2, type: 'info', student: 'سارة أحمد', message: 'تراجع في الدرجات (-15%)', class: 'السنة السادسة ب' },
  ];

  // إحصائيات سريعة
  const stats = [
    { label: 'الحصص اليوم', value: '3', icon: <Calendar className="w-6 h-6" />, color: 'blue' },
    { label: 'رسائل جديدة', value: '5', icon: <MessageSquare className="w-6 h-6" />, color: 'green' },
    { label: 'واجبات معلقة', value: '12', icon: <FileText className="w-6 h-6" />, color: 'orange' },
    { label: 'تنبيهات', value: '2', icon: <AlertTriangle className="w-6 h-6" />, color: 'red' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMarkAttendance = (session) => {
    setSelectedSession(session);
    setShowAttendanceModal(true);
  };

  const handleAttendanceChange = (studentId, status) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const handleSaveAttendance = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    
    alert(`تم حفظ الحضور بنجاح!\nحاضر: ${present} | غائب: ${absent} | متأخر: ${late}`);
    setShowAttendanceModal(false);
    // Reset attendance
    setStudents(students.map(s => ({ ...s, status: null })));
  };

  const handleViewAllMessages = () => {
    console.log('Viewing all messages...');
  };

  const handleEnterGrades = () => {
    setShowGradesModal(true);
  };

  const handleGradeChange = (studentId, field, value) => {
    // Validate grade (0-20)
    const numValue = parseFloat(value);
    if (value === '' || (numValue >= 0 && numValue <= 20)) {
      setGradesData(gradesData.map(student =>
        student.id === studentId ? { ...student, [field]: value } : student
      ));
    }
  };

  const calculateAverage = (student) => {
    const grades = [
      parseFloat(student.exam1) || 0,
      parseFloat(student.exam2) || 0,
      parseFloat(student.homework) || 0,
      parseFloat(student.participation) || 0
    ];
    const sum = grades.reduce((a, b) => a + b, 0);
    const avg = sum / 4;
    return avg.toFixed(2);
  };

  // Calculate sum of all grades for a student
  const calculateSum = (student) => {
    const grades = [
      parseFloat(student.exam1) || 0,
      parseFloat(student.exam2) || 0,
      parseFloat(student.homework) || 0,
      parseFloat(student.participation) || 0
    ];
    return grades.reduce((a, b) => a + b, 0).toFixed(2);
  };

  // Filter students by class
  const filteredGradesData = selectedClassFilter === 'all' 
    ? gradesData 
    : gradesData.filter(student => student.class === selectedClassFilter);

  // Get unique classes for filter
  const uniqueClasses = [...new Set(gradesData.map(student => student.class))];

  const handleSaveGrades = () => {
    alert('تم حفظ الدرجات بنجاح!');
    setShowGradesModal(false);
  };

  const handleUploadLesson = () => {
    setShowLessonModal(true);
  };

  const handleLessonInputChange = (field, value) => {
    setLessonData({ ...lessonData, [field]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLessonData({ ...lessonData, file });
  };

  const handleSaveLesson = () => {
    if (!lessonData.title || !lessonData.class || !lessonData.subject) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    
    const newLesson = {
      id: uploadedLessons.length + 1,
      title: lessonData.title,
      class: lessonData.class,
      subject: lessonData.subject,
      date: new Date().toISOString().split('T')[0],
      file: lessonData.file, // Store the file
      description: lessonData.description
    };
    
    setUploadedLessons([newLesson, ...uploadedLessons]);
    alert('تم رفع الدرس بنجاح!');
    setShowLessonModal(false);
    setLessonData({ title: '', class: '', subject: '', description: '', file: null });
  };

  const handleDownloadLesson = (lesson) => {
    if (lesson.file) {
      // Create a download link for the actual file
      const url = URL.createObjectURL(lesson.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = lesson.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(`✅ تم تحميل الملف بنجاح: ${lesson.title}`);
    } else {
      // If no file, create a sample PDF
      alert(`⚠️ لا يوجد ملف مرفق لهذا الدرس.\n\nالدرس: ${lesson.title}\nالمادة: ${lesson.subject}\nالصف: ${lesson.class}`);
    }
  };

  const handleViewLessonDetails = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonDetailsModal(true);
  };

  const handleGenerateReportCard = () => {
    setShowReportCardModal(true);
  };

  const handleDownloadReportCard = (studentId) => {
    alert(`جاري تحميل بطاقة النتائج للطالب رقم ${studentId}...`);
  };

  const handleDownloadAllReportCards = () => {
    alert('جاري تحميل جميع بطاقات النتائج...');
  };

  const handleSendMessage = () => {
    console.log('Sending message...');
  };

  // Sidebar menu items
  const menuItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: <Home className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'courses',
      label: 'الدروس',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'announcements',
      label: 'الإعلانات',
      icon: <Megaphone className="w-5 h-5" />,
      color: 'orange'
    },
    {
      id: 'exams',
      label: 'الامتحانات',
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'purple',
      action: () => setShowGradesModal(true)
    },
    {
      id: 'messages',
      label: 'رسائل أولياء الأمور',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'indigo'
    },
    {
      id: 'attendance',
      label: 'الحضور والغياب',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'teal',
      submenu: [
        { id: 'class-5a', label: 'السنة الخامسة أ', action: () => handleMarkAttendance(todaySchedule[0]) },
        { id: 'class-6b', label: 'السنة السادسة ب', action: () => handleMarkAttendance(todaySchedule[1]) },
        { id: 'class-4a', label: 'السنة الرابعة أ', action: () => handleMarkAttendance(todaySchedule[2]) },
      ]
    },
    {
      id: 'report-cards',
      label: 'بطاقات النتائج',
      icon: <FileText className="w-5 h-5" />,
      color: 'pink',
      action: () => setShowReportCardModal(true)
    }
  ];

  const handleMenuClick = (item) => {
    if (item.action && item.id !== 'courses' && item.id !== 'announcements') {
      item.action();
    } else if (!item.submenu) {
      setActiveSection(item.id);
    }
  };

  const handleDeleteLesson = (lessonId) => {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      setUploadedLessons(uploadedLessons.filter(lesson => lesson.id !== lessonId));
      alert('تم حذف الدرس بنجاح!');
    }
  };

  const handleDeleteAnnouncement = (announcementId) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      deleteAnnouncement(announcementId);
      alert('تم حذف الإعلان بنجاح!');
    }
  };

  const handleViewAnnouncementDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementDetailsModal(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementData.title || !announcementData.type || !announcementData.date) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    const newAnnouncement = {
      ...announcementData,
      createdBy: 'أستاذ محمد'
    };

    addAnnouncement(newAnnouncement);
    alert('تم إضافة الإعلان بنجاح! في انتظار موافقة الإدارة.');
    setShowExamAnnouncementModal(false);
    setAnnouncementData({
      title: '',
      type: '',
      description: '',
      date: '',
      time: '',
      class: '',
      targetAudience: []
    });
  };

  const handleAnnouncementInputChange = (field, value) => {
    setAnnouncementData({ ...announcementData, [field]: value });
  };

  const handleTargetAudienceToggle = (audience) => {
    const current = announcementData.targetAudience || [];
    if (current.includes(audience)) {
      setAnnouncementData({
        ...announcementData,
        targetAudience: current.filter(a => a !== audience)
      });
    } else {
      setAnnouncementData({
        ...announcementData,
        targetAudience: [...current, audience]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -288 }}
        className="fixed right-0 top-0 h-full bg-white shadow-2xl z-40 w-72 transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b bg-gradient-to-r from-green-600 to-teal-600">
            <div className="flex items-center space-x-3 space-x-reverse text-white">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h2 className="font-bold text-lg">أستاذ محمد</h2>
                <p className="text-sm text-green-100">معلم الرياضيات</p>
              </div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? `bg-${item.color}-50 text-${item.color}-700 font-semibold`
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`${activeSection === item.id ? `text-${item.color}-600` : 'text-gray-500'}`}>
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.submenu && <ChevronRight className="w-4 h-4" />}
                  </button>
                  
                  {/* Submenu */}
                  {item.submenu && (
                    <div className="mr-8 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={subItem.action}
                          className="w-full text-right px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-72' : 'mr-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <BookOpen className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">لوحة تحكم الأستاذ</h1>
                  <p className="text-sm text-gray-600">مرحباً، أستاذ محمد</p>
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
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Dashboard View */}
        {activeSection === 'dashboard' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                      <div className={`text-${stat.color}-600`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">جدول اليوم</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {todaySchedule.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-r-4 border-green-500 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{session.subject}</h3>
                      <span className="text-sm text-gray-600">{session.time}</span>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 ml-1" />
                        {session.class}
                      </span>
                      <span>{session.room}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMarkAttendance(session)}
                    className="mr-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    تسجيل الحضور
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                  className={`p-4 rounded-lg border ${msg.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-800">{msg.from}</h4>
                    {msg.unread && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-gray-500">{msg.time}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={handleViewAllMessages}
              className="w-full mt-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              عرض جميع الرسائل
            </button>
          </motion.div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Student Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-6">تنبيهات التلاميذ</h2>
            
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-r-4 ${
                    alert.type === 'warning' 
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{alert.student}</h4>
                    <span className="text-xs text-gray-600">{alert.class}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-6">إجراءات سريعة</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleEnterGrades}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800">إدخال الدرجات</p>
              </button>
              
              <button
                onClick={handleUploadLesson}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div className="text-green-600 mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800">رفع درس</p>
              </button>
              
              <button
                onClick={handleGenerateReportCard}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <div className="text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800">بطاقة النتائج</p>
              </button>
              
              <button
                onClick={handleSendMessage}
                className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
              >
                <div className="text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-gray-800">إرسال رسالة</p>
              </button>
            </div>
          </motion.div>
        </div>
        </>
        )}

        {/* Courses View */}
        {activeSection === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">إدارة الدروس</h2>
                <p className="text-sm text-gray-600 mt-1">جميع الدروس المرفوعة للتلاميذ</p>
              </div>
              <button
                onClick={() => setShowLessonModal(true)}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Upload className="w-5 h-5" />
                <span>رفع درس جديد</span>
              </button>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                    <th className="p-4 text-right font-semibold text-gray-700">#</th>
                    <th className="p-4 text-right font-semibold text-gray-700">عنوان الدرس</th>
                    <th className="p-4 text-right font-semibold text-gray-700">المادة</th>
                    <th className="p-4 text-right font-semibold text-gray-700">الصف</th>
                    <th className="p-4 text-right font-semibold text-gray-700">تاريخ الرفع</th>
                    <th className="p-4 text-center font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedLessons.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-semibold">لا توجد دروس مرفوعة بعد</p>
                        <p className="text-sm mt-2">ابدأ برفع أول درس للتلاميذ</p>
                      </td>
                    </tr>
                  ) : (
                    uploadedLessons.map((lesson, index) => (
                      <tr key={lesson.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-600">{index + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">{lesson.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {lesson.subject}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {lesson.class}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{lesson.date}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleViewLessonDetails(lesson)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="عرض التفاصيل"
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadLesson(lesson)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="تحميل"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Statistics */}
            {uploadedLessons.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">إجمالي الدروس</p>
                  <p className="text-3xl font-bold text-blue-600">{uploadedLessons.length}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">الصفوف المستهدفة</p>
                  <p className="text-3xl font-bold text-green-600">
                    {new Set(uploadedLessons.map(l => l.class)).size}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">المواد</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {new Set(uploadedLessons.map(l => l.subject)).size}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Announcements View */}
        {activeSection === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">إدارة الإعلانات</h2>
                <p className="text-sm text-gray-600 mt-1">جميع الإعلانات والإشعارات</p>
              </div>
              <button
                onClick={() => setShowExamAnnouncementModal(true)}
                className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Megaphone className="w-5 h-5" />
                <span>إضافة إعلان جديد</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 space-x-reverse mb-6 border-b">
              <button 
                onClick={() => setAnnouncementFilter('all')}
                className={`px-4 py-2 text-sm font-semibold ${
                  announcementFilter === 'all'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                الكل ({announcements.length})
              </button>
              <button 
                onClick={() => setAnnouncementFilter('pending')}
                className={`px-4 py-2 text-sm font-semibold ${
                  announcementFilter === 'pending'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                في الانتظار ({announcements.filter(a => a.status === 'pending').length})
              </button>
              <button 
                onClick={() => setAnnouncementFilter('approved')}
                className={`px-4 py-2 text-sm font-semibold ${
                  announcementFilter === 'approved'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                موافق عليها ({announcements.filter(a => a.status === 'approved').length})
              </button>
            </div>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const filteredAnnouncements = announcementFilter === 'all' 
                  ? announcements 
                  : announcements.filter(a => a.status === announcementFilter);
                
                return filteredAnnouncements.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500">
                  <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-semibold">لا توجد إعلانات بعد</p>
                  <p className="text-sm mt-2">ابدأ بإضافة أول إعلان</p>
                </div>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all p-6 border-r-4 border-orange-500"
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
                      <span className="text-xs text-gray-500">{announcement.createdAt}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{announcement.title}</h3>

                    {/* Type Badge */}
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-3">
                      {announcement.type === 'parents-teacher-meeting' && 'اجتماع أولياء الأمور'}
                      {announcement.type === 'exam' && 'امتحان'}
                      {announcement.type === 'holiday' && 'عطلة'}
                      {announcement.type === 'event' && 'حدث'}
                    </span>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{announcement.description}</p>

                    {/* Date & Time */}
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mb-4">
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

                    {/* Target Audience */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {announcement.targetAudience.map((audience, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {audience === 'parents' && 'أولياء الأمور'}
                          {audience === 'teachers' && 'المعلمون'}
                          {audience === 'admin' && 'الإدارة'}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <button
                        onClick={() => handleViewAnnouncementDetails(announcement)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                      >
                        عرض التفاصيل
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              );
              })()}
            </div>

            {/* Statistics */}
            {announcements.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">إجمالي الإعلانات</p>
                  <p className="text-3xl font-bold text-orange-600">{announcements.length}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">موافق عليها</p>
                  <p className="text-3xl font-bold text-green-600">
                    {announcements.filter(a => a.status === 'approved').length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">في الانتظار</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {announcements.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">هذا الشهر</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {announcements.filter(a => a.createdAt.startsWith('2024-01')).length}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Messages View */}
        {activeSection === 'messages' && (
          <TeacherMessagingSystem />
        )}
      </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        userRole="teacher"
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAttendanceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">تسجيل الحضور</h2>
                    {selectedSession && (
                      <p className="text-green-100">
                        {selectedSession.subject} - {selectedSession.class} - {selectedSession.time}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {students.filter(s => s.status === 'present').length}
                    </p>
                    <p className="text-sm text-gray-600">حاضر</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {students.filter(s => s.status === 'absent').length}
                    </p>
                    <p className="text-sm text-gray-600">غائب</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">
                      {students.filter(s => s.status === 'late').length}
                    </p>
                    <p className="text-sm text-gray-600">متأخر</p>
                  </div>
                </div>

                {/* Students List */}
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800">{student.name}</span>
                      </div>
                      
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            student.status === 'present'
                              ? 'bg-green-600 text-white shadow-lg'
                              : 'bg-white text-gray-600 hover:bg-green-50'
                          }`}
                        >
                          حاضر
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            student.status === 'absent'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-white text-gray-600 hover:bg-red-50'
                          }`}
                        >
                          غائب
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'late')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            student.status === 'late'
                              ? 'bg-orange-600 text-white shadow-lg'
                              : 'bg-white text-gray-600 hover:bg-orange-50'
                          }`}
                        >
                          متأخر
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ الحضور</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grades Modal */}
      <AnimatePresence>
        {showGradesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGradesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">إدخال الدرجات</h2>
                    <p className="text-blue-100">إدارة درجات التلاميذ</p>
                  </div>
                  <button
                    onClick={() => setShowGradesModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Class Filter */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-blue-100 mb-2">
                    تصفية حسب الصف
                  </label>
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="all" className="text-gray-800">جميع الصفوف ({gradesData.length} تلميذ)</option>
                    {uniqueClasses.map((className) => (
                      <option key={className} value={className} className="text-gray-800">
                        {className} ({gradesData.filter(s => s.class === className).length} تلميذ)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {filteredGradesData.length}
                    </p>
                    <p className="text-sm text-gray-600">عدد التلاميذ</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <ClipboardCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {filteredGradesData.filter(s => parseFloat(calculateAverage(s)) >= 10).length}
                    </p>
                    <p className="text-sm text-gray-600">ناجح</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {filteredGradesData.filter(s => parseFloat(calculateAverage(s)) < 10).length}
                    </p>
                    <p className="text-sm text-gray-600">راسب</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                        <th className="p-3 text-right font-semibold text-gray-700">اسم التلميذ</th>
                        <th className="p-3 text-center font-semibold text-gray-700">الصف</th>
                        <th className="p-3 text-center font-semibold text-gray-700">امتحان 1</th>
                        <th className="p-3 text-center font-semibold text-gray-700">امتحان 2</th>
                        <th className="p-3 text-center font-semibold text-gray-700">الواجبات</th>
                        <th className="p-3 text-center font-semibold text-gray-700">المشاركة</th>
                        <th className="p-3 text-center font-semibold text-gray-700">المجموع</th>
                        <th className="p-3 text-center font-semibold text-gray-700">المعدل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGradesData.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-semibold text-gray-800">{student.name}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {student.class}
                            </span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.exam1}
                              onChange={(e) => handleGradeChange(student.id, 'exam1', e.target.value)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0-20"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.exam2}
                              onChange={(e) => handleGradeChange(student.id, 'exam2', e.target.value)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0-20"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.homework}
                              onChange={(e) => handleGradeChange(student.id, 'homework', e.target.value)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0-20"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.participation}
                              onChange={(e) => handleGradeChange(student.id, 'participation', e.target.value)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0-20"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-block px-3 py-1 rounded-full font-bold bg-indigo-100 text-indigo-700">
                              {calculateSum(student)} / 80
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full font-bold ${
                              parseFloat(calculateAverage(student)) >= 10
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {calculateAverage(student)} / 20
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ملاحظة:</strong> الدرجات من 0 إلى 20. المعدل يحسب تلقائياً من جميع الدرجات.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowGradesModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveGrades}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ الدرجات</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Upload Modal */}
      <AnimatePresence>
        {showLessonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLessonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">رفع درس جديد</h2>
                    <p className="text-green-100">إضافة مواد تعليمية للتلاميذ</p>
                  </div>
                  <button
                    onClick={() => setShowLessonModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Lesson Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان الدرس *
                    </label>
                    <input
                      type="text"
                      value={lessonData.title}
                      onChange={(e) => handleLessonInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="مثال: درس الكسور"
                    />
                  </div>

                  {/* Class and Subject */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الصف *
                      </label>
                      <select
                        value={lessonData.class}
                        onChange={(e) => handleLessonInputChange('class', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">اختر الصف</option>
                        <option value="السنة الرابعة أ">السنة الرابعة أ</option>
                        <option value="السنة الخامسة أ">السنة الخامسة أ</option>
                        <option value="السنة السادسة ب">السنة السادسة ب</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        المادة *
                      </label>
                      <select
                        value={lessonData.subject}
                        onChange={(e) => handleLessonInputChange('subject', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">اختر المادة</option>
                        <option value="الرياضيات">الرياضيات</option>
                        <option value="العلوم">العلوم</option>
                        <option value="اللغة العربية">اللغة العربية</option>
                        <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وصف الدرس
                    </label>
                    <textarea
                      value={lessonData.description}
                      onChange={(e) => handleLessonInputChange('description', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="وصف مختصر عن محتوى الدرس..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملف الدرس (PDF)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="lesson-file"
                      />
                      <label
                        htmlFor="lesson-file"
                        className="cursor-pointer text-green-600 hover:text-green-700 font-semibold"
                      >
                        اضغط لاختيار ملف
                      </label>
                      {lessonData.file && (
                        <p className="mt-2 text-sm text-gray-600">
                          الملف المحدد: {lessonData.file.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Previously Uploaded Lessons */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">الدروس المرفوعة سابقاً</h3>
                    <div className="space-y-2">
                      {uploadedLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{lesson.title}</p>
                            <p className="text-sm text-gray-600">
                              {lesson.class} - {lesson.subject} - {lesson.date}
                            </p>
                          </div>
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveLesson}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
                >
                  <Upload className="w-5 h-5" />
                  <span>رفع الدرس</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Card Modal */}
      <AnimatePresence>
        {showReportCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReportCardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">بطاقات النتائج</h2>
                    <p className="text-purple-100">السنة الخامسة أ - الفصل الأول</p>
                  </div>
                  <button
                    onClick={() => setShowReportCardModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-3">
                  {gradesData.map((student) => {
                    const average = calculateAverage(student);
                    const isPassing = parseFloat(average) >= 10;
                    
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            isPassing ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}>
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{student.name}</p>
                            <p className="text-sm text-gray-600">
                              المعدل: <span className={`font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                                {average}/20
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDownloadReportCard(student.id)}
                          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Download className="w-5 h-5" />
                          <span>تحميل</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>ملاحظة:</strong> بطاقات النتائج تحتوي على جميع الدرجات والمعدلات والتقييمات.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-between">
                <button
                  onClick={handleDownloadAllReportCards}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل الكل</span>
                </button>
                <button
                  onClick={() => setShowReportCardModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Details Modal */}
      <AnimatePresence>
        {showAnnouncementDetailsModal && selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAnnouncementDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedAnnouncement.title}</h2>
                      <p className="text-orange-100 text-sm mt-1">تفاصيل الإعلان</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAnnouncementDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedAnnouncement.status === 'approved' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedAnnouncement.status === 'approved' ? '✓ موافق عليه' : '⏳ في انتظار الموافقة'}
                    </span>
                    <span className="text-sm text-gray-600">
                      تم الإنشاء: {selectedAnnouncement.createdAt}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">نوع الإعلان</p>
                    <p className="text-lg font-bold text-orange-700">
                      {selectedAnnouncement.type === 'parents-teacher-meeting' && 'اجتماع أولياء الأمور'}
                      {selectedAnnouncement.type === 'exam' && 'امتحان'}
                      {selectedAnnouncement.type === 'holiday' && 'عطلة'}
                      {selectedAnnouncement.type === 'event' && 'حدث'}
                    </p>
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
                      <p className="text-sm text-gray-600 mb-1">الصف المستهدف</p>
                      <p className="text-lg font-bold text-indigo-700">{selectedAnnouncement.class}</p>
                    </div>
                  )}

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">التفاصيل</p>
                    <p className="text-gray-800 leading-relaxed">{selectedAnnouncement.description}</p>
                  </div>

                  {/* Target Audience */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">الجمهور المستهدف</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnnouncement.targetAudience.map((audience, idx) => (
                        <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold flex items-center space-x-2 space-x-reverse">
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

                  {/* Creator Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">تم الإنشاء بواسطة</p>
                    <p className="text-lg font-bold text-green-700">{selectedAnnouncement.createdBy}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-between">
                <button
                  onClick={() => setShowAnnouncementDetailsModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    handleDeleteAnnouncement(selectedAnnouncement.id);
                    setShowAnnouncementDetailsModal(false);
                  }}
                  className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <X className="w-5 h-5" />
                  <span>حذف الإعلان</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Details Modal */}
      <AnimatePresence>
        {showLessonDetailsModal && selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLessonDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                      <p className="text-blue-100 text-sm mt-1">تفاصيل الدرس</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLessonDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">المادة</p>
                      <p className="text-lg font-bold text-blue-700">{selectedLesson.subject}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">الصف</p>
                      <p className="text-lg font-bold text-purple-700">{selectedLesson.class}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">تاريخ الرفع</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedLesson.date}</p>
                  </div>

                  {/* Description */}
                  {selectedLesson.description && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">وصف الدرس</p>
                      <p className="text-gray-800 leading-relaxed">{selectedLesson.description}</p>
                    </div>
                  )}

                  {/* File Info */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {selectedLesson.file ? selectedLesson.file.name : 'لا يوجد ملف مرفق'}
                          </p>
                          {selectedLesson.file && (
                            <p className="text-sm text-gray-600">
                              الحجم: {(selectedLesson.file.size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedLesson.file && (
                        <button
                          onClick={() => handleDownloadLesson(selectedLesson)}
                          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Download className="w-5 h-5" />
                          <span>تحميل</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">معلومات إضافية</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">رقم الدرس</p>
                        <p className="text-lg font-bold text-indigo-700">#{selectedLesson.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">الحالة</p>
                        <p className="text-lg font-bold text-green-700">
                          {selectedLesson.file ? 'متاح للتحميل' : 'بدون ملف'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-between">
                <button
                  onClick={() => setShowLessonDetailsModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
                {selectedLesson.file && (
                  <button
                    onClick={() => {
                      handleDownloadLesson(selectedLesson);
                      setShowLessonDetailsModal(false);
                    }}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>تحميل الملف</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Announcement Modal */}
      <AnimatePresence>
        {showExamAnnouncementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowExamAnnouncementModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">إضافة إعلان جديد</h2>
                    <p className="text-orange-100">سيتم إرسال الإعلان بعد موافقة الإدارة</p>
                  </div>
                  <button
                    onClick={() => setShowExamAnnouncementModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Exam Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المادة *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="">اختر المادة</option>
                      <option value="الرياضيات">الرياضيات</option>
                      <option value="العلوم">العلوم</option>
                      <option value="اللغة العربية">اللغة العربية</option>
                      <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                    </select>
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الصف *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="">اختر الصف</option>
                      <option value="السنة الرابعة أ">السنة الرابعة أ</option>
                      <option value="السنة الخامسة أ">السنة الخامسة أ</option>
                      <option value="السنة السادسة ب">السنة السادسة ب</option>
                    </select>
                  </div>

                  {/* Exam Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تاريخ الامتحان *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Exam Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وقت الامتحان *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Topics Covered */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المواضيع المشمولة
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="مثال: الفصل 1 - الكسور، الفصل 2 - الأعداد العشرية..."
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="أي ملاحظات أو تعليمات إضافية للتلاميذ..."
                    />
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>ملاحظة:</strong> سيتم إرسال إشعار فوري لجميع أولياء أمور التلاميذ في الصف المحدد.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-6 bg-gray-50 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowExamAnnouncementModal(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    alert('تم إرسال إعلان الامتحان بنجاح!');
                    setShowExamAnnouncementModal(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
                >
                  <Megaphone className="w-5 h-5" />
                  <span>إرسال الإعلان</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;
