import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  Search,
  Plus,
  Download,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  Edit,
  Trash2,
  Eye,
  X,
  Save
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

const FinanceManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const paymentsPerPage = 10;

  // Financial statistics
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    paidPayments: 0,
    overduePayments: 0
  });

  // Load payments from API
  useEffect(() => {
    loadPayments();
    loadStatistics();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      // Try to load from API
      const response = await paymentService.getPayments();
      const apiPayments = response.data.map(p => ({
        id: p.id,
        studentName: p.student_name,
        amount: p.amount,
        dueDate: p.due_date,
        paidDate: p.paid_date,
        status: p.status,
        paymentMethod: p.payment_method,
        invoiceNumber: p.invoice_number,
        month: p.month
      }));
      setPayments(apiPayments);
      setFilteredPayments(apiPayments);
    } catch (error) {
      console.error('Error loading payments from API, using mock data:', error);
      // Fallback to mock data if API fails
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const apiStats = await paymentService.getStatistics();
      setStats(apiStats);
    } catch (error) {
      console.error('Error loading statistics from API:', error);
      // Calculate from local data
      calculateLocalStats();
    }
  };

  const loadMockData = () => {
    const mockPayments = [
      {
        id: 1,
        studentName: 'أحمد محمد',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: '2024-04-28',
        status: 'paid',
        paymentMethod: 'نقدي',
        invoiceNumber: 'INV-2024-001',
        month: 'مايو 2024'
      },
      {
        id: 2,
        studentName: 'فاطمة علي',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: null,
        status: 'pending',
        paymentMethod: null,
        invoiceNumber: 'INV-2024-002',
        month: 'مايو 2024'
      },
      {
        id: 3,
        studentName: 'محمد حسن',
        amount: 1500,
        dueDate: '2024-04-01',
        paidDate: null,
        status: 'overdue',
        paymentMethod: null,
        invoiceNumber: 'INV-2024-003',
        month: 'أبريل 2024'
      },
      {
        id: 4,
        studentName: 'سارة أحمد',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: '2024-05-01',
        status: 'paid',
        paymentMethod: 'تحويل بنكي',
        invoiceNumber: 'INV-2024-004',
        month: 'مايو 2024'
      },
      {
        id: 5,
        studentName: 'يوسف إبراهيم',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: '2024-04-30',
        status: 'paid',
        paymentMethod: 'بطاقة',
        invoiceNumber: 'INV-2024-005',
        month: 'مايو 2024'
      },
      {
        id: 6,
        studentName: 'مريم خالد',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: null,
        status: 'pending',
        paymentMethod: null,
        invoiceNumber: 'INV-2024-006',
        month: 'مايو 2024'
      },
      {
        id: 7,
        studentName: 'عمر سعيد',
        amount: 1500,
        dueDate: '2024-03-01',
        paidDate: null,
        status: 'overdue',
        paymentMethod: null,
        invoiceNumber: 'INV-2024-007',
        month: 'مارس 2024'
      },
      {
        id: 8,
        studentName: 'نور عبدالرحمن',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: '2024-05-02',
        status: 'paid',
        paymentMethod: 'نقدي',
        invoiceNumber: 'INV-2024-008',
        month: 'مايو 2024'
      },
      {
        id: 9,
        studentName: 'ياسمين كريم',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: null,
        status: 'pending',
        paymentMethod: null,
        invoiceNumber: 'INV-2024-009',
        month: 'مايو 2024'
      },
      {
        id: 10,
        studentName: 'زينب طارق',
        amount: 1500,
        dueDate: '2024-05-01',
        paidDate: '2024-04-29',
        status: 'paid',
        paymentMethod: 'تحويل بنكي',
        invoiceNumber: 'INV-2024-010',
        month: 'مايو 2024'
      }
    ];

    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
    calculateLocalStats(mockPayments);
  };

  const calculateLocalStats = (paymentsData = payments) => {
    const totalRevenue = paymentsData
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = paymentsData.filter(p => p.status === 'pending').length;
    const paidPayments = paymentsData.filter(p => p.status === 'paid').length;
    const overduePayments = paymentsData.filter(p => p.status === 'overdue').length;

    setStats({
      totalRevenue,
      pendingPayments,
      paidPayments,
      overduePayments
    });
  };

  // Search and filter
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, payments]);

  // Pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const handleExportExcel = async () => {
    try {
      // Try to get export data from API
      let exportPayments = filteredPayments;
      try {
        const response = await paymentService.exportPayments({
          status: filterStatus
        });
        exportPayments = response.data.map(p => ({
          invoiceNumber: p.invoice_number,
          studentName: p.student_name,
          amount: p.amount,
          dueDate: p.due_date,
          paidDate: p.paid_date,
          status: p.status,
          paymentMethod: p.payment_method,
          month: p.month
        }));
      } catch (error) {
        console.log('Using local data for export');
      }

      const exportData = exportPayments.map(payment => ({
        'رقم الفاتورة': payment.invoiceNumber,
        'اسم التلميذ': payment.studentName,
        'المبلغ': payment.amount,
        'تاريخ الاستحقاق': payment.dueDate,
        'تاريخ الدفع': payment.paidDate || 'لم يدفع بعد',
        'الحالة': payment.status === 'paid' ? 'مدفوع' : payment.status === 'pending' ? 'قيد الانتظار' : 'متأخر',
        'طريقة الدفع': payment.paymentMethod || '-',
        'الشهر': payment.month
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const colWidths = [
        { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 15 },
        { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
      ];
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'المدفوعات');

      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `payments_${date}.xlsx`);
    } catch (error) {
      console.error('Error exporting payments:', error);
      alert('فشل تصدير المدفوعات');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-3 h-3 ml-1" />;
      case 'pending': return <Clock className="w-3 h-3 ml-1" />;
      case 'overdue': return <XCircle className="w-3 h-3 ml-1" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'مدفوع';
      case 'pending': return 'قيد الانتظار';
      case 'overdue': return 'متأخر';
      default: return status;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">إدارة المالية</h1>
        <p className="text-gray-600 dark:text-gray-400">متابعة المدفوعات والفواتير والتقارير المالية</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stats.totalRevenue} درهم</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stats.paidPayments}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">مدفوعات مكتملة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stats.pendingPayments}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">مدفوعات معلقة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stats.overduePayments}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">مدفوعات متأخرة</p>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث عن مدفوعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="paid">مدفوع</option>
              <option value="pending">قيد الانتظار</option>
              <option value="overdue">متأخر</option>
            </select>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">تصدير</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مدفوعة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600 dark:text-gray-400">جاري التحميل...</span>
          </div>
        )}
        
        {!loading && (
          <>
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">رقم الفاتورة</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">اسم التلميذ</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">تاريخ الاستحقاق</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">الحالة</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">{payment.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{payment.studentName}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{payment.amount} درهم</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{payment.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('هل أنت متأكد من حذف هذه المدفوعة؟')) {
                            try {
                              setLoading(true);
                              await paymentService.deletePayment(payment.id);
                              await loadPayments();
                              await loadStatistics();
                              alert('تم حذف المدفوعة بنجاح');
                            } catch (error) {
                              console.error('Error deleting payment:', error);
                              // Fallback to local delete
                              setPayments(payments.filter(p => p.id !== payment.id));
                              alert('تم حذف المدفوعة محلياً');
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              عرض {indexOfFirstPayment + 1} إلى {Math.min(indexOfLastPayment, filteredPayments.length)} من {filteredPayments.length} مدفوعة
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
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
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
              >
                التالي
              </button>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Payment Modal (Add/Edit/View) */}
      <PaymentModal
        isOpen={showAddModal || showEditModal || showViewModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setShowViewModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        mode={showAddModal ? 'add' : showEditModal ? 'edit' : 'view'}
        onSave={async (paymentData) => {
          try {
            setLoading(true);
            if (showAddModal) {
              // Convert to API format
              const apiData = {
                student_name: paymentData.studentName,
                amount: paymentData.amount,
                due_date: paymentData.dueDate,
                paid_date: paymentData.paidDate || null,
                status: paymentData.status,
                payment_method: paymentData.paymentMethod || null,
                month: paymentData.month
              };
              
              await paymentService.createPayment(apiData);
              alert('تم إضافة المدفوعة بنجاح');
            } else if (showEditModal) {
              // Convert to API format
              const apiData = {
                student_name: paymentData.studentName,
                amount: paymentData.amount,
                due_date: paymentData.dueDate,
                paid_date: paymentData.paidDate || null,
                status: paymentData.status,
                payment_method: paymentData.paymentMethod || null,
                month: paymentData.month
              };
              
              await paymentService.updatePayment(selectedPayment.id, apiData);
              alert('تم تحديث المدفوعة بنجاح');
            }
            
            // Reload data
            await loadPayments();
            await loadStatistics();
            
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedPayment(null);
          } catch (error) {
            console.error('Error saving payment:', error);
            // Fallback to local save
            if (showAddModal) {
              const newPayment = {
                id: payments.length + 1,
                ...paymentData,
                invoiceNumber: `INV-2024-${String(payments.length + 1).padStart(3, '0')}`
              };
              setPayments([...payments, newPayment]);
              alert('تم إضافة المدفوعة محلياً');
            } else if (showEditModal) {
              setPayments(payments.map(p => p.id === selectedPayment.id ? { ...p, ...paymentData } : p));
              alert('تم تحديث المدفوعة محلياً');
            }
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedPayment(null);
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, payment, mode, onSave }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    amount: '',
    dueDate: '',
    paidDate: '',
    status: 'pending',
    paymentMethod: '',
    month: ''
  });

  useEffect(() => {
    if (payment && (mode === 'edit' || mode === 'view')) {
      setFormData(payment);
    } else {
      setFormData({
        studentName: '',
        amount: '',
        dueDate: '',
        paidDate: '',
        status: 'pending',
        paymentMethod: '',
        month: ''
      });
    }
  }, [payment, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const title = mode === 'add' ? 'إضافة مدفوعة جديدة' : mode === 'edit' ? 'تعديل المدفوعة' : 'تفاصيل المدفوعة';

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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {isViewMode && payment && (
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Receipt className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{payment.invoiceNumber}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{payment.studentName}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  اسم التلميذ *
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  المبلغ (درهم) *
                </label>
                <input
                  type="number"
                  required
                  disabled={isViewMode}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ الاستحقاق *
                </label>
                <input
                  type="date"
                  required
                  disabled={isViewMode}
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ الدفع
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  value={formData.paidDate || ''}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  الحالة *
                </label>
                <select
                  required
                  disabled={isViewMode}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="paid">مدفوع</option>
                  <option value="overdue">متأخر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  طريقة الدفع
                </label>
                <select
                  disabled={isViewMode}
                  value={formData.paymentMethod || ''}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="">اختر طريقة الدفع</option>
                  <option value="نقدي">نقدي</option>
                  <option value="تحويل بنكي">تحويل بنكي</option>
                  <option value="بطاقة">بطاقة</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  الشهر *
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  placeholder="مثال: مايو 2024"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            </div>

            {!isViewMode && (
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
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold dark:text-white"
                >
                  إلغاء
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FinanceManagement;
