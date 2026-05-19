import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, amount }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // محاكاة عملية الدفع
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // إغلاق النافذة بعد 2 ثانية
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {isSuccess ? (
                // Success Screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    تم الدفع بنجاح!
                  </h2>
                  <p className="text-gray-600">
                    تم استلام دفعتك بقيمة {amount} درهم
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">الدفع الإلكتروني</h2>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="text-orange-100 text-sm mb-1">المبلغ المطلوب</p>
                      <p className="text-3xl font-bold">{amount} درهم</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Payment Methods */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        اختر طريقة الدفع
                      </label>
                      <div className="space-y-3">
                        {/* Credit Card */}
                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'card'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-orange-600"
                          />
                          <CreditCard className="w-6 h-6 mx-3 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">بطاقة بنكية</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, CIB</p>
                          </div>
                        </label>

                        {/* Bank Transfer */}
                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'bank'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="bank"
                            checked={paymentMethod === 'bank'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-orange-600"
                          />
                          <Building2 className="w-6 h-6 mx-3 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">تحويل بنكي</p>
                            <p className="text-sm text-gray-600">من حسابك البنكي</p>
                          </div>
                        </label>

                        {/* Mobile Payment */}
                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'mobile'
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="mobile"
                            checked={paymentMethod === 'mobile'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-orange-600"
                          />
                          <Smartphone className="w-6 h-6 mx-3 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">الدفع عبر الهاتف</p>
                            <p className="text-sm text-gray-600">BaridiMob, CCP</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Card Details (if card selected) */}
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 mb-6"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم البطاقة
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            dir="ltr"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              تاريخ الانتهاء
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-800">
                        <strong>ملاحظة:</strong> هذا نموذج تجريبي. في النسخة الحقيقية، سيتم توجيهك إلى بوابة الدفع الآمنة.
                      </p>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-2"></div>
                          جاري المعالجة...
                        </div>
                      ) : (
                        `ادفع ${amount} درهم`
                      )}
                    </button>

                    {/* Security Notice */}
                    <p className="text-center text-xs text-gray-500 mt-4">
                      🔒 جميع المعاملات مشفرة وآمنة
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;