import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Mock data - Replace with API call
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '0612345678',
        dateOfBirth: '2010-05-15',
        class: 'السنة الخامسة',
        address: 'الدار البيضاء، المغرب',
        parentName: 'محمد أحمد',
        parentPhone: '0612345679',
        enrollmentDate: '2020-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 2,
        firstName: 'فاطمة',
        lastName: 'علي',
        email: 'fatima@example.com',
        phone: '0612345680',
        dateOfBirth: '2011-03-20',
        class: 'السنة الرابعة',
        address: 'الرباط، المغرب',
        parentName: 'علي حسن',
        parentPhone: '0612345681',
        enrollmentDate: '2021-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 3,
        firstName: 'محمد',
        lastName: 'حسن',
        email: 'mohamed@example.com',
        phone: '0612345682',
        dateOfBirth: '2012-07-10',
        class: 'السنة الثالثة',
        address: 'فاس، المغرب',
        parentName: 'حسن محمود',
        parentPhone: '0612345683',
        enrollmentDate: '2022-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 4,
        firstName: 'سارة',
        lastName: 'أحمد',
        email: 'sara@example.com',
        phone: '0612345684',
        dateOfBirth: '2013-02-25',
        class: 'السنة الثانية',
        address: 'مراكش، المغرب',
        parentName: 'أحمد عبدالله',
        parentPhone: '0612345685',
        enrollmentDate: '2023-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 5,
        firstName: 'يوسف',
        lastName: 'إبراهيم',
        email: 'youssef@example.com',
        phone: '0612345686',
        dateOfBirth: '2009-11-30',
        class: 'السنة السادسة',
        address: 'طنجة، المغرب',
        parentName: 'إبراهيم يوسف',
        parentPhone: '0612345687',
        enrollmentDate: '2019-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 6,
        firstName: 'مريم',
        lastName: 'خالد',
        email: 'mariam@example.com',
        phone: '0612345688',
        dateOfBirth: '2014-04-18',
        class: 'السنة الأولى',
        address: 'أكادير، المغرب',
        parentName: 'خالد محمد',
        parentPhone: '0612345689',
        enrollmentDate: '2024-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 7,
        firstName: 'عمر',
        lastName: 'سعيد',
        email: 'omar@example.com',
        phone: '0612345690',
        dateOfBirth: '2010-09-12',
        class: 'السنة الخامسة',
        address: 'وجدة، المغرب',
        parentName: 'سعيد عمر',
        parentPhone: '0612345691',
        enrollmentDate: '2020-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 8,
        firstName: 'نور',
        lastName: 'عبدالرحمن',
        email: 'nour@example.com',
        phone: '0612345692',
        dateOfBirth: '2011-06-08',
        class: 'السنة الرابعة',
        address: 'تطوان، المغرب',
        parentName: 'عبدالرحمن نور',
        parentPhone: '0612345693',
        enrollmentDate: '2021-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 9,
        firstName: 'ياسمين',
        lastName: 'كريم',
        email: 'yasmine@example.com',
        phone: '0612345694',
        dateOfBirth: '2012-12-22',
        class: 'السنة الثالثة',
        address: 'الصويرة، المغرب',
        parentName: 'كريم ياسين',
        parentPhone: '0612345695',
        enrollmentDate: '2022-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 10,
        firstName: 'زينب',
        lastName: 'طارق',
        email: 'zainab@example.com',
        phone: '0612345696',
        dateOfBirth: '2013-08-14',
        class: 'السنة الثانية',
        address: 'القنيطرة، المغرب',
        parentName: 'طارق زين',
        parentPhone: '0612345697',
        enrollmentDate: '2023-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 11,
        firstName: 'حمزة',
        lastName: 'عثمان',
        email: 'hamza@example.com',
        phone: '0612345698',
        dateOfBirth: '2009-03-05',
        class: 'السنة السادسة',
        address: 'بني ملال، المغرب',
        parentName: 'عثمان حمزة',
        parentPhone: '0612345699',
        enrollmentDate: '2019-09-01',
        status: 'active',
        photo: null
      },
      {
        id: 12,
        firstName: 'ليلى',
        lastName: 'رشيد',
        email: 'layla@example.com',
        phone: '0612345700',
        dateOfBirth: '2014-10-28',
        class: 'السنة الأولى',
        address: 'الجديدة، المغرب',
        parentName: 'رشيد ليث',
        parentPhone: '0612345701',
        enrollmentDate: '2024-09-01',
        status: 'active',
        photo: null
      }
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Class filter
    if (filterClass !== 'all') {
      filtered = filtered.filter(student => student.class === filterClass);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterClass, students]);

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleAddStudent = (studentData) => {
    const newStudent = {
      id: students.length + 1,
      ...studentData,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
  };

  const handleEditStudent = (studentData) => {
    setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...studentData } : s));
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التلميذ؟')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleExportExcel = () => {
    // Prepare data for Excel
    const exportData = filteredStudents.map(student => ({
      'الاسم الأول': student.firstName,
      'الاسم الأخير': student.lastName,
      'البريد الإلكتروني': student.email,
      'رقم الهاتف': student.phone,
      'تاريخ الميلاد': student.dateOfBirth,
      'الصف': student.class,
      'العنوان': student.address,
      'اسم ولي الأمر': student.parentName,
      'هاتف ولي الأمر': student.parentPhone,
      'تاريخ التسجيل': student.enrollmentDate,
      'الحالة': student.status === 'active' ? 'نشط' : 'غير نشط'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, // الاسم الأول
      { wch: 15 }, // الاسم الأخير
      { wch: 25 }, // البريد الإلكتروني
      { wch: 15 }, // رقم الهاتف
      { wch: 15 }, // تاريخ الميلاد
      { wch: 15 }, // الصف
      { wch: 30 }, // العنوان
      { wch: 20 }, // اسم ولي الأمر
      { wch: 15 }, // هاتف ولي الأمر
      { wch: 15 }, // تاريخ التسجيل
      { wch: 10 }  // الحالة
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'التلاميذ');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `students_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">إدارة التلاميذ</h1>
        <p className="text-gray-600">إضافة وتعديل وحذف بيانات التلاميذ</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث عن تلميذ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الصفوف</option>
              <option value="السنة الأولى">السنة الأولى</option>
              <option value="السنة الثانية">السنة الثانية</option>
              <option value="السنة الثالثة">السنة الثالثة</option>
              <option value="السنة الرابعة">السنة الرابعة</option>
              <option value="السنة الخامسة">السنة الخامسة</option>
              <option value="السنة السادسة">السنة السادسة</option>
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تلميذ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الاسم الكامل</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الصف</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الهاتف</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">الحالة</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student.class}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student.phone}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      نشط
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
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
              عرض {indexOfFirstStudent + 1} إلى {Math.min(indexOfLastStudent, filteredStudents.length)} من {filteredStudents.length} تلميذ
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
                      ? 'bg-blue-600 text-white'
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

      {/* Add/Edit/View Modals */}
      <StudentFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStudent}
        title="إضافة تلميذ جديد"
      />

      <StudentFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleEditStudent}
        student={selectedStudent}
        title="تعديل بيانات التلميذ"
      />

      <StudentViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </div>
  );
};

// Student Form Modal Component
const StudentFormModal = ({ isOpen, onClose, onSubmit, student, title }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    class: '',
    address: '',
    parentName: '',
    parentPhone: ''
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        class: '',
        address: '',
        parentName: '',
        parentPhone: ''
      });
    }
  }, [student, isOpen]);

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الصف *
                </label>
                <select
                  required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الصف</option>
                  <option value="السنة الأولى">السنة الأولى</option>
                  <option value="السنة الثانية">السنة الثانية</option>
                  <option value="السنة الثالثة">السنة الثالثة</option>
                  <option value="السنة الرابعة">السنة الرابعة</option>
                  <option value="السنة الخامسة">السنة الخامسة</option>
                  <option value="السنة السادسة">السنة السادسة</option>
                </select>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم ولي الأمر *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  هاتف ولي الأمر *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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

// Student View Modal Component
const StudentViewModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

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
            <h2 className="text-xl font-bold text-gray-800">تفاصيل التلميذ</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-gray-600">{student.class}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                  <p className="font-semibold text-gray-800">{student.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800">{student.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ الميلاد</p>
                  <p className="font-semibold text-gray-800">{student.dateOfBirth}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">الصف</p>
                  <p className="font-semibold text-gray-800">{student.class}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <p className="font-semibold text-gray-800">{student.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">اسم ولي الأمر</p>
                  <p className="font-semibold text-gray-800">{student.parentName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">هاتف ولي الأمر</p>
                  <p className="font-semibold text-gray-800">{student.parentPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ التسجيل</p>
                  <p className="font-semibold text-gray-800">{student.enrollmentDate}</p>
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

export default StudentManagement;