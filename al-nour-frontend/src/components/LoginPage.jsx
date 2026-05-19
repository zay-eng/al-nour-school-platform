import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from '../services/authService';
import { 
  Eye, 
  EyeOff, 
  UserCheck, 
  GraduationCap, 
  Users,
  ArrowRight,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  AlertCircle
} from 'lucide-react';

// Schema validation
const loginSchema = yup.object({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

const LoginPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // CAPTCHA state
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Generate simple math CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(answer);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Generate CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // معلومات كل دور
  const roleConfig = {
    admin: {
      title: 'تسجيل دخول المدير',
      subtitle: 'إدارة شاملة للمدرسة',
      icon: <UserCheck className="w-12 h-12" />,
      color: 'from-purple-600 to-blue-600',
      dashboard: '/admin/dashboard'
    },
    teacher: {
      title: 'تسجيل دخول الأستاذ',
      subtitle: 'متابعة التلاميذ والدروس',
      icon: <GraduationCap className="w-12 h-12" />,
      color: 'from-green-600 to-teal-600',
      dashboard: '/teacher/dashboard'
    },
    parent: {
      title: 'تسجيل دخول ولي الأمر',
      subtitle: 'متابعة تقدم الطفل',
      icon: <Users className="w-12 h-12" />,
      color: 'from-orange-600 to-red-600',
      dashboard: '/parent/dashboard'
    }
  };

  const currentRole = roleConfig[role] || roleConfig.admin;

  const onSubmit = async (data) => {
    // Verify CAPTCHA first
    if (parseInt(captchaInput) !== captchaAnswer) {
      setCaptchaError('الإجابة غير صحيحة. حاول مرة أخرى.');
      generateCaptcha();
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Call real backend API
      const response = await authService.login({
        email: data.email,
        password: data.password
      });
      
      if (response.success) {
        // Get user role from response
        const userRole = response.user.role;
        
        // Map role to dashboard route
        const dashboardMap = {
          'admin': '/admin/dashboard',
          'teacher': '/teacher/dashboard',
          'parent': '/parent/dashboard'
        };
        
        // Navigate to appropriate dashboard
        const dashboardRoute = dashboardMap[userRole] || '/admin/dashboard';
        navigate(dashboardRoute);
      } else {
        setLoginError(response.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      generateCaptcha(); // Regenerate CAPTCHA on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors group mb-6"
        >
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">العودة للصفحة الرئيسية</span>
        </motion.button>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${currentRole.color} text-white rounded-2xl mb-4 shadow-lg`}
            >
              {currentRole.icon}
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {currentRole.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {currentRole.subtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Login Error Message */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-600 ml-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-800 mb-1">خطأ في تسجيل الدخول</h4>
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full pr-12 pl-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="أدخل البريد الإلكتروني"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pr-12 pl-14 py-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-4 flex items-center hover:scale-110 transition-transform"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* CAPTCHA Verification */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-100">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-indigo-600 ml-2" />
                <h3 className="text-sm font-bold text-gray-800">التحقق من أنك لست روبوت</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-white p-4 rounded-lg border-2 border-indigo-200 text-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {captchaQuestion}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-3 bg-white hover:bg-indigo-50 rounded-lg border-2 border-indigo-200 transition-colors"
                  title="تحديث السؤال"
                >
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                </button>
              </div>
              
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError('');
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  captchaError ? 'border-red-500' : 'border-indigo-200 hover:border-indigo-300'
                }`}
                placeholder="أدخل الإجابة"
                required
              />
              
              {captchaError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <span className="mr-1">⚠️</span>
                  {captchaError}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="mr-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">تذكرني</span>
              </label>
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gradient-to-r ${currentRole.color} text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group`}
            >
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-2"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  'تسجيل الدخول'
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
          >
            <h3 className="text-sm font-bold text-gray-800 mb-2">بيانات تجريبية للاختبار</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center">
                <Mail className="w-4 h-4 ml-2 text-gray-500" />
                <span className="font-mono">admin@alnour.edu</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 ml-2 text-gray-500" />
                <span className="font-mono">Admin@123</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
