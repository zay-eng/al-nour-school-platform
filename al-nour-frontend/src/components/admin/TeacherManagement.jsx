import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Award,
  Briefcase
} from 'lucide-react';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockTeachers = [
      {
        id: 1,
        firstName: 'محمد',
        lastName: 'العلوي',
        email: 'mohamed.alaoui@alnour.edu',
        phone: '0612345678',
        dateOfBirth: '1985-03-15',
        subject: 'الرياضيات',
        qualification: 'ماجستير في الرياضيات',
        experience: '10 سنوات',
        address: 'الدار البيضاء، المغرب',
        hireDate: '2015-09-01',
        salary: '8000',
        status: 'active'
      },
      {
        id: 2,
        firstName: 'فاطمة',
        lastName: 'الحسني',
        email: 'fatima.hasani@alnour.edu',
        phone: '0612345679',
        dateOfBirth: '1988-07-22',
        subject: 'اللغة العربية',
        qualification: 'ماجستير في اللغة العربية',
        experience: '8 سنوات',
        address: 'الرباط، المغرب',
        hireDate: '2017-09-01',
        salary: '7500',
        status: 'active'
      },
      {
        id: 3,
        firstName: 'أحمد',
        lastName: 'بنعلي',
        email: 'ahmed.benali@alnour.edu',
        phone: '0612345680',
        dateOfBirth: '1982-11-10',
        subject: 'العلوم',
        qualification: 'دكتوراه في الفيزياء',
        experience: '15 سنوات',
        address: 'فاس، المغرب',
        hireDate: '2010-09-01',
        salary: '9000',
        status: 'active'
      },
      {
        id: 4,
        firstName: 'سعاد',
        lastName: 'المرابط',
        email: 'souad.marabit@alnour.edu',
        phone: '0612345681',
        dateOfBirth: '1990-05-18',
        subject: 'اللغة الفرنسية',
        qualification: 'ماجستير في اللغة الفرنسية',
        experience: '6 سنوات',
        address: 'مراكش، المغرب',
        hireDate: '2019-09-01',
        salary: '7000',
        status: 'active'
      },
      {
        id: 5,
        firstName: 'يوسف',
        lastName: 'الإدريسي',
        email: 'youssef.idrissi@alnour.edu',
        phone: '0612345682',
        dateOfBirth: '1987-09-25',
        subject: 'التاريخ والجغرافيا',
        qualification: 'ماجستير في التاريخ',
        experience: '9 سنوات',
        address: 'طنجة، المغرب',
        hireDate: '2016-09-01',
        salary: '7500',
        status: 'active'
      },
      {
        id: 6,
        firstName: 'نادية',
        lastName: 'الزهراوي',
        email: 'nadia.zahraoui@alnour.edu',
        phone: '0612345683',
        dateOfBirth: '1992-02-14',
        subject: 'اللغة الإنجليزية',
        qualification: 'ماجستير في اللغة الإنجليزية',
        experience: '5 سنوات',
        address: 'أكادير، المغرب',
        hireDate: '2020-09-01',
        salary: '6500',
        status: 'active'
      },
      {
        id: 7,
        firstName: 'عبدالله',
        lastName: 'الفاسي',
        email: 'abdullah.fassi@alnour.edu',
        phone: '0612345684',
        dateOfBirth: '1984-12-08',
        subject: 'التربية الإسلامية',
        qualification: 'ماجستير في الدراسات الإسلامية',
        experience: '12 سنوات',
        address: 'وجدة، المغرب',
        hireDate: '2013-09-01',
        salary: '8500',
        status: 'active'
      },
      {
        id: 8,
        firstName: 'خديجة',
        lastName: 'السباعي',
        email: 'khadija.sebbai@alnour.edu',
        phone: '0612345685',
        dateOfBirth: '1989-06-30',
        subject: 'التربية البدنية',
        qualification: 'إجازة في التربية البدنية',
        experience: '7 سنوات',
        address: 'تطوان، المغرب',
        hireDate: '2018-09-01',
        salary: '6000',
        status: 'active'
      }
    ];
    setTeachers(mockTeachers);
    setFilteredTeachers(mockTeachers);
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.includes(searchTerm)
      );
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter(teacher => teacher.subject === filterSubject);
    }

    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterSubject, teachers]);

  // Pagination
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handleAddTeacher = (teacherData) => {
    const newTeacher = {
      id: teachers.length + 1,
      ...teacherData,
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setTeachers([...teachers, newTeacher]);
    setShowAddModal(false);
  };

  const handleEditTeacher = (teacherData) => {
    setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { ...t, ...teacherData } : t));
    setShowEditModal(false);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredTeachers.map(teacher => ({
      'الاسم الأول': teacher.firstName,
      'الاسم الأخير': teacher.lastName,
      'البريد الإلكتروني': teacher.email,
      'رقم الهاتف': teacher.phone,
      'تاريخ الميلاد': teacher.dateOfBirth,
      'المادة': teacher.subject,
      'المؤهل': teacher.qualification,
      'الخبرة': teacher.experience,
      'العنوان': teacher.address,
      'تاريخ التوظيف': teacher.hireDate,
      'الراتب': teacher.salary + ' درهم',
      'الحالة': teacher.status === 'active' ? 'نشط' : 'غير نشط'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const colWidths = [
      { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 15 },
      { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 10 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الأساتذة');

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `teachers_${date}.xlsx`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">إدارة الأساتذة</h1>
        <p className="text-gray-600">إضافة وتعديل وحذف بيانات الأساتذة</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث عن أستاذ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">جميع المواد</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="اللغة العربية">اللغة العربية</option>
              <option value="العلوم">العلوم</option>
              <option value="اللغة الفرنسية">اللغة الفرنسية</option>
              <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
              <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
              <option value="التربية الإسلامية">التربية الإسلامية</option>
              <option value="التربية البدنية">التربية البدنية</option>
            </select>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">تصدير</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أستاذ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الاسم الكامل</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">المادة</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الهاتف</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الخبرة</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentTeachers.map((teacher) => (
                <motion.tr
                  key={teacher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {teacher.firstName} {teacher.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.subject}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{teacher.experience}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              عرض {indexOfFirstTeacher + 1} إلى {Math.min(indexOfLastTeacher, filteredTeachers.length)} من {filteredTeachers.length} أستاذ
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals - To be added */}
      <TeacherFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTeacher}
        title="إضافة أستاذ جديد"
      />

      <TeacherFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTeacher(null);
        }}
        onSubmit={handleEditTeacher}
        teacher={selectedTeacher}
        title="تعديل بيانات الأستاذ"
      />

      <TeacherViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />
    </div>
  );
};

export default TeacherManagement;


// Teacher Form Modal Component
const TeacherFormModal = ({ isOpen, onClose, onSubmit, teacher, title }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    subject: '',
    qualification: '',
    experience: '',
    address: '',
    salary: ''
  });

  useEffect(() => {
    if (teacher) {
      setFormData(teacher);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        subject: '',
        qualification: '',
        experience: '',
        address: '',
        salary: ''
      });
    }
  }, [teacher, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الأول *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الأخير *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تاريخ الميلاد *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المادة *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">اختر المادة</option>
                  <option value="الرياضيات">الرياضيات</option>
                  <option value="اللغة العربية">اللغة العربية</option>
                  <option value="العلوم">العلوم</option>
                  <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                  <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                  <option value="التربية الإسلامية">التربية الإسلامية</option>
                  <option value="التربية البدنية">التربية البدنية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المؤهل العلمي *
                </label>
                <input
                  type="text"
                  required
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="مثال: ماجستير في الرياضيات"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  سنوات الخبرة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="مثال: 10 سنوات"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الراتب (درهم) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Save className="w-5 h-5" />
                حفظ
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Teacher View Modal Component
const TeacherViewModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">تفاصيل الأستاذ</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {teacher.firstName} {teacher.lastName}
                </h3>
                <p className="text-gray-600">{teacher.subject}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                  <p className="font-semibold text-gray-800">{teacher.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800">{teacher.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                  <p className="font-semibold text-gray-800">{teacher.dateOfBirth}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">المادة</p>
                  <p className="font-semibold text-gray-800">{teacher.subject}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">المؤهل العلمي</p>
                  <p className="font-semibold text-gray-800">{teacher.qualification}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">الخبرة</p>
                  <p className="font-semibold text-gray-800">{teacher.experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <p className="font-semibold text-gray-800">{teacher.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ التوظيف</p>
                  <p className="font-semibold text-gray-800">{teacher.hireDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-1 text-gray-400">💰</div>
                <div>
                  <p className="text-sm text-gray-600">الراتب</p>
                  <p className="font-semibold text-gray-800">{teacher.salary} درهم</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">الحالة</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    نشط
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
