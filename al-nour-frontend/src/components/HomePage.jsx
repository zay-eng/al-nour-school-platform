import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, BookOpen, UserCheck, Award, TrendingUp, Shield, CheckCircle, Star, Heart, Zap, Target } from 'lucide-react';

// Import images from assets
import studentsImg from '../assets/students.jpg';
import administrateurImg from '../assets/administrateur.jpg';
import teacherImg from '../assets/teacher.jpg';
import parentsImg from '../assets/parents.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: studentsImg,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      title: 'مدرسة النور الخاصة',
      subtitle: 'التميز في التعليم والإبداع في المستقبل',
      description: 'منصة رقمية متكاملة لإدارة المدرسة',
      isMainSlide: true
    },
    {
      id: 2,
      image: administrateurImg,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      title: 'لوحة تحكم المدير',
      subtitle: 'إدارة شاملة للمدرسة',
      description: 'متابعة الأداء والإحصائيات والمدفوعات',
      role: 'admin',
      icon: <UserCheck className="w-8 h-8" />,
      buttonText: 'تسجيل دخول كمدير'
    },
    {
      id: 3,
      image: teacherImg,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      title: 'منصة الأستاذ',
      subtitle: 'متابعة التلاميذ والدروس',
      description: 'إدارة الدرجات والحضور والموارد التعليمية',
      role: 'teacher',
      icon: <GraduationCap className="w-8 h-8" />,
      buttonText: 'تسجيل دخول كأستاذ'
    },
    {
      id: 4,
      image: parentsImg,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      title: 'بوابة ولي الأمر',
      subtitle: 'متابعة تقدم الطفل',
      description: 'مراقبة الأداء الأكاديمي والمالي والتواصل',
      role: 'parent',
      icon: <Users className="w-8 h-8" />,
      buttonText: 'تسجيل دخول كولي أمر'
    }
  ];

  const statistics = [
    {
      icon: <Users className="w-12 h-12" />,
      number: '342+',
      label: 'طالب وطالبة',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      number: '45+',
      label: 'معلم ومعلمة',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Award className="w-12 h-12" />,
      number: '%94',
      label: 'نسبة النجاح',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      number: '%87',
      label: 'رضا أولياء الأمور',
      color: 'from-red-500 to-red-600'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'أمان وخصوصية',
      description: 'حماية كاملة لبيانات الطلاب والمعلمين'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'متابعة الأداء',
      description: 'تقارير تفصيلية عن تقدم الطلاب الأكاديمي'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'سهولة الاستخدام',
      description: 'واجهة بسيطة وسهلة لجميع المستخدمين'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'سرعة وكفاءة',
      description: 'نظام سريع ومستقر لإدارة العمليات اليومية'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'تواصل فعال',
      description: 'نظام رسائل وإشعارات فوري بين جميع الأطراف'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'جودة التعليم',
      description: 'أدوات متقدمة لتحسين جودة التعليم'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleRoleLogin = (role) => {
    navigate(`/login/${role}`);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <BookOpen className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">مدرسة النور الخاصة</h1>
                <p className="text-sm text-gray-600">École Privée Al-Nour</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Carousel Section */}
        <div className="relative h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background gradient */}
              <div 
                className="absolute inset-0"
                style={{ background: currentSlideData.gradient }}
              />
              
              {/* Background image */}
              <img 
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />
              
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white px-6 max-w-4xl">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentSlideData.icon && (
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                          {currentSlideData.icon}
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-5xl md:text-6xl font-bold mb-4">
                      {currentSlideData.title}
                    </h2>
                    
                    <p className="text-xl md:text-2xl mb-6 text-blue-100">
                      {currentSlideData.subtitle}
                    </p>
                    
                    <p className="text-lg mb-8 text-gray-200">
                      {currentSlideData.description}
                    </p>

                    {currentSlideData.role && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleRoleLogin(currentSlideData.role)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all"
                      >
                        {currentSlideData.buttonText}
                      </motion.button>
                    )}

                    {currentSlideData.isMainSlide && (
                      <div className="space-y-4">
                        <p className="text-lg text-blue-100 mb-8">
                          اختر دورك للدخول إلى المنصة
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleRoleLogin('admin')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                          >
                            <UserCheck className="w-5 h-5 inline-block ml-2" />
                            دخول المدير
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleRoleLogin('teacher')}
                            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all"
                          >
                            <GraduationCap className="w-5 h-5 inline-block ml-2" />
                            دخول الأستاذ
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleRoleLogin('parent')}
                            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                          >
                            <Users className="w-5 h-5 inline-block ml-2" />
                            دخول ولي الأمر
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                إحصائيات المدرسة
              </h2>
              <p className="text-xl text-gray-600">
                أرقام تعكس تميزنا ونجاحنا
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${stat.color} text-white mb-6`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Platform Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                عن منصة النور
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                منصة رقمية متكاملة تربط بين الإدارة والمعلمين وأولياء الأمور لتوفير بيئة تعليمية متميزة
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badge Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                  <Award className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                معتمدون ومعترف بنا
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                مدرسة معتمدة من وزارة التربية الوطنية وحاصلة على شهادات الجودة التعليمية
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="font-semibold">معتمد من وزارة التربية</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="font-semibold">شهادة الجودة ISO 9001</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <p className="font-semibold">عضو اتحاد المدارس الخاصة</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Column */}
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-400 ml-3" />
                <h3 className="text-xl font-semibold">مدرسة النور الخاصة</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                منصة رقمية متكاملة لإدارة المدرسة تربط بين الإدارة والمعلمين وأولياء الأمور
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => handleRoleLogin('admin')} className="hover:text-blue-400 transition-colors">
                    دخول المدير
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleLogin('teacher')} className="hover:text-blue-400 transition-colors">
                    دخول الأستاذ
                  </button>
                </li>
                <li>
                  <button onClick={() => handleRoleLogin('parent')} className="hover:text-blue-400 transition-colors">
                    دخول ولي الأمر
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">تواصل معنا</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@alnour.edu</li>
                <li>📞 +212 5XX-XXXXXX</li>
                <li>📍 المغرب - الدار البيضاء</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مدرسة النور الخاصة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
