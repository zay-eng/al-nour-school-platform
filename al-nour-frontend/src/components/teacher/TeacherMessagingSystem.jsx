import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  X,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Pin,
  Archive,
  Trash2,
  Download,
  Image as ImageIcon,
  FileText,
  Plus,
  Users,
  Bell,
  BellOff
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';

const TeacherMessagingSystem = () => {
  const { notifyNewMessage } = useNotifications();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUserId = 2; // Teacher user ID

  // Mock conversations data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        type: 'individual',
        participant: {
          id: 3,
          name: 'فاطمة علي',
          role: 'parent',
          avatar: '👩',
          online: false
        },
        lastMessage: {
          content: 'متى موعد الاجتماع؟',
          timestamp: new Date(Date.now() - 60 * 60000),
          senderId: 3
        },
        unreadCount: 2,
        pinned: true
      },
      {
        id: 2,
        type: 'individual',
        participant: {
          id: 1,
          name: 'الإدارة',
          role: 'admin',
          avatar: '👨‍💼',
          online: true
        },
        lastMessage: {
          content: 'تذكير: تسليم درجات الفصل الأول',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          senderId: 1
        },
        unreadCount: 0,
        pinned: false
      },
      {
        id: 3,
        type: 'individual',
        participant: {
          id: 6,
          name: 'سارة أحمد',
          role: 'parent',
          avatar: '👩',
          online: false
        },
        lastMessage: {
          content: 'ابني سيكون غائباً غداً',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000),
          senderId: 6
        },
        unreadCount: 0,
        pinned: false
      },
      {
        id: 4,
        type: 'individual',
        participant: {
          id: 7,
          name: 'محمد حسن',
          role: 'parent',
          avatar: '👨',
          online: true
        },
        lastMessage: {
          content: 'شكراً على المتابعة',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
          senderId: 7
        },
        unreadCount: 0,
        pinned: false
      }
    ];

    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      setTimeout(() => {
        setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id ? { ...conv, unreadCount: 0 } : conv
        ));
      }, 1000);
    }
  }, [selectedConversation, messages.length]);

  // Mock messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const mockMessages = [
        {
          id: 1,
          conversationId: selectedConversation.id,
          senderId: selectedConversation.participant.id,
          senderName: selectedConversation.participant.name,
          content: 'مرحباً، كيف حالك؟',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: true,
          type: 'text'
        },
        {
          id: 2,
          conversationId: selectedConversation.id,
          senderId: currentUserId,
          senderName: 'أنت',
          content: 'بخير والحمد لله، كيف يمكنني مساعدتك؟',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60000),
          read: true,
          type: 'text'
        },
        {
          id: 3,
          conversationId: selectedConversation.id,
          senderId: selectedConversation.participant.id,
          senderName: selectedConversation.participant.name,
          content: 'أريد الاستفسار عن نتائج الامتحانات',
          timestamp: new Date(Date.now() - 60 * 60000),
          read: true,
          type: 'text'
        },
        {
          id: 4,
          conversationId: selectedConversation.id,
          senderId: currentUserId,
          senderName: 'أنت',
          content: 'النتائج ستكون جاهزة نهاية هذا الأسبوع',
          timestamp: new Date(Date.now() - 30 * 60000),
          read: true,
          type: 'text'
        },
        {
          id: 5,
          conversationId: selectedConversation.id,
          senderId: selectedConversation.participant.id,
          senderName: selectedConversation.participant.name,
          content: selectedConversation.lastMessage.content,
          timestamp: selectedConversation.lastMessage.timestamp,
          read: false,
          type: 'text'
        }
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  // Format timestamp
  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `${minutes} دقيقة`;
    if (hours < 24) return `${hours} ساعة`;
    if (days < 7) return `${days} يوم`;
    return date.toLocaleDateString('ar');
  };

  // Format message time
  const formatMessageTime = (date) => {
    return date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'parent': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get role text
  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'إدارة';
      case 'parent': return 'ولي أمر';
      default: return '';
    }
  };

  // Filter and sort conversations
  const filteredConversations = conversations
    .filter(conv =>
      conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned conversations first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then by last message timestamp
      return b.lastMessage.timestamp - a.lastMessage.timestamp;
    });

  // Handle file download
  const handleDownloadFile = (message) => {
    if (message.fileUrl) {
      const link = document.createElement('a');
      link.href = message.fileUrl;
      link.download = message.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: messages.length + 1,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: 'أنت',
      content: messageInput,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Update conversation last message
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: {
              content: messageInput,
              timestamp: new Date(),
              senderId: currentUserId
            }
          }
        : conv
    ));

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response = {
          id: messages.length + 2,
          conversationId: selectedConversation.id,
          senderId: selectedConversation.participant.id,
          senderName: selectedConversation.participant.name,
          content: 'شكراً لك!',
          timestamp: new Date(),
          read: false,
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
        
        // Trigger notification for received message
        notifyNewMessage(selectedConversation.participant.name, 'شكراً لك!', 'teacher');
      }, 2000);
    }, 1000);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
      return;
    }

    // Detect file type
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'];

    if (imageTypes.includes(file.type)) {
      handleImageUpload(file);
    } else if (documentTypes.includes(file.type)) {
      handleDocumentUpload(file);
    } else {
      alert('نوع الملف غير مدعوم');
    }

    // Reset file input
    e.target.value = '';
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newMessage = {
        id: messages.length + 1,
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: 'أنت',
        imageUrl: e.target.result,
        timestamp: new Date(),
        read: false,
        type: 'image'
      };

      setMessages([...messages, newMessage]);

      // Update conversation last message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: {
                content: '📷 صورة',
                timestamp: new Date(),
                senderId: currentUserId
              }
            }
          : conv
      ));
    };
    reader.readAsDataURL(file);
  };

  // Handle document upload
  const handleDocumentUpload = (file) => {
    const fileSize = (file.size / 1024).toFixed(2) + ' KB';
    if (file.size > 1024 * 1024) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const newMessage = {
        id: messages.length + 1,
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: 'أنت',
        fileName: file.name,
        fileSize: fileSizeMB,
        fileUrl: URL.createObjectURL(file),
        timestamp: new Date(),
        read: false,
        type: 'file'
      };

      setMessages([...messages, newMessage]);
    } else {
      const newMessage = {
        id: messages.length + 1,
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: 'أنت',
        fileName: file.name,
        fileSize: fileSize,
        fileUrl: URL.createObjectURL(file),
        timestamp: new Date(),
        read: false,
        type: 'file'
      };

      setMessages([...messages, newMessage]);
    }

    // Update conversation last message
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: {
              content: '📎 ' + file.name,
              timestamp: new Date(),
              senderId: currentUserId
            }
          }
        : conv
    ));
  };

  // Handle new message modal send
  const handleNewMessageSend = (recipientId, message) => {
    const existingConv = conversations.find(c => c.participant.id === recipientId);
    if (existingConv) {
      setSelectedConversation(existingConv);
      // Add message to existing conversation
      const newMessage = {
        id: messages.length + 1,
        conversationId: existingConv.id,
        senderId: currentUserId,
        senderName: 'أنت',
        content: message,
        timestamp: new Date(),
        read: false,
        type: 'text'
      };
      setMessages([...messages, newMessage]);
    }
    setShowNewMessageModal(false);
  };

  // Toggle pin conversation
  const handleTogglePin = (convId) => {
    setConversations(prev => prev.map(conv =>
      conv.id === convId ? { ...conv, pinned: !conv.pinned } : conv
    ));
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col" dir="rtl">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">الرسائل</h1>
            <p className="text-gray-600 dark:text-gray-400">التواصل مع أولياء الأمور والإدارة</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>رسالة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex">
        {/* Conversations List */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن محادثة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {searchTerm ? 'لا توجد نتائج' : 'لا توجد محادثات بعد'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                    selectedConversation?.id === conv.id
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
                        {conv.participant.avatar}
                      </div>
                      {conv.participant.online && (
                        <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                          {conv.participant.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(conv.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(conv.participant.role)}`}>
                          {getRoleText(conv.participant.role)}
                        </span>
                        {conv.pinned && <Pin className="w-3 h-3 text-gray-400" />}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                    {selectedConversation.participant.avatar}
                  </div>
                  {selectedConversation.participant.online && (
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white">
                    {selectedConversation.participant.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedConversation.participant.online ? 'متصل الآن' : 'غير متصل'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === currentUserId ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] ${message.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                    {/* Message Content */}
                    {message.type === 'text' && (
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.senderId === currentUserId
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    )}

                    {/* Image Message */}
                    {message.type === 'image' && (
                      <div className="rounded-2xl overflow-hidden cursor-pointer">
                        <img
                          src={message.imageUrl}
                          alt="Shared image"
                          className="max-w-full h-auto"
                          onClick={() => {
                            setPreviewImage(message.imageUrl);
                            setShowImagePreview(true);
                          }}
                        />
                      </div>
                    )}

                    {/* File Message */}
                    {message.type === 'file' && (
                      <div
                        className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${
                          message.senderId === currentUserId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        <FileText className="w-8 h-8" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{message.fileName}</p>
                          <p className="text-xs opacity-75">{message.fileSize}</p>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(message)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {/* Timestamp and Read Receipt */}
                    <div className={`flex items-center gap-1 mt-1 ${message.senderId === currentUserId ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {message.senderId === currentUserId && (
                        message.read ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Check className="w-3 h-3 text-gray-400" />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="اكتب رسالتك..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                اختر محادثة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                اختر محادثة من القائمة لبدء المراسلة
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        conversations={conversations}
        onSendMessage={handleNewMessageSend}
      />

      {/* Image Preview Modal */}
      {showImagePreview && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Download Button */}
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewImage;
                  link.download = 'image.jpg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="absolute -top-12 left-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Download className="w-6 h-6 text-white" />
              </button>

              {/* Image */}
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// New Message Modal Component
const NewMessageModal = ({ isOpen, onClose, conversations, onSendMessage }) => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [searchContact, setSearchContact] = useState('');

  // Available contacts (parents and admin only)
  const availableContacts = conversations
    .filter(conv => conv.type === 'individual')
    .filter(conv => 
      conv.participant.name.toLowerCase().includes(searchContact.toLowerCase())
    );

  const handleSend = () => {
    if (!selectedRecipient || !message.trim()) {
      alert('الرجاء اختيار المستلم وكتابة الرسالة');
      return;
    }
    onSendMessage(selectedRecipient, message);
    setSelectedRecipient('');
    setMessage('');
    setSearchContact('');
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">رسالة جديدة</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Search Contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                البحث عن مستلم
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن ولي أمر أو إدارة..."
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Select Recipient */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                اختر المستلم *
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                {availableContacts.map((conv) => (
                  <div
                    key={conv.participant.id}
                    onClick={() => setSelectedRecipient(conv.participant.id)}
                    className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      selectedRecipient === conv.participant.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                      {conv.participant.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {conv.participant.name}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        conv.participant.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {conv.participant.role === 'admin' ? 'إدارة' : 'ولي أمر'}
                      </span>
                    </div>
                    {selectedRecipient === conv.participant.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                الرسالة *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSend}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Send className="w-5 h-5" />
                إرسال
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold dark:text-white"
              >
                إلغاء
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeacherMessagingSystem;
