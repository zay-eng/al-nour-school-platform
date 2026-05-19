import { createContext, useState, useContext } from 'react';

const AnnouncementsContext = createContext();

export const AnnouncementsProvider = ({ children, notificationsContext }) => {
  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'اجتماع أولياء الأمور', 
      type: 'parents-teacher-meeting',
      description: 'اجتماع مهم لمناقشة تقدم التلاميذ في الفصل الأول',
      date: '2024-02-15',
      time: '14:00',
      targetAudience: ['parents', 'teachers', 'admin'],
      status: 'approved',
      createdBy: 'أستاذ محمد',
      createdAt: '2024-01-20'
    },
    { 
      id: 2, 
      title: 'امتحان الرياضيات', 
      type: 'exam',
      description: 'امتحان الفصل الأول - الرياضيات. يرجى مراجعة الفصول 1-5',
      date: '2024-02-20',
      time: '09:00',
      class: 'السنة الخامسة أ',
      targetAudience: ['parents', 'teachers'],
      status: 'pending',
      createdBy: 'أستاذ محمد',
      createdAt: '2024-01-22'
    },
    { 
      id: 3, 
      title: 'عطلة الربيع', 
      type: 'holiday',
      description: 'عطلة الربيع - المدرسة مغلقة',
      date: '2024-03-01',
      targetAudience: ['parents', 'teachers', 'admin'],
      status: 'approved',
      createdBy: 'الإدارة',
      createdAt: '2024-01-15'
    },
    { 
      id: 4, 
      title: 'يوم رياضي', 
      type: 'event',
      description: 'يوم رياضي للتلاميذ - يرجى إحضار ملابس رياضية',
      date: '2024-02-25',
      time: '08:00',
      targetAudience: ['parents', 'teachers'],
      status: 'approved',
      createdBy: 'الإدارة',
      createdAt: '2024-01-18'
    }
  ]);

  const addAnnouncement = (announcement) => {
    const newAnnouncement = {
      ...announcement,
      id: announcements.length + 1,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Notify admin about new announcement
    if (notificationsContext?.notifyNewAnnouncement) {
      notificationsContext.notifyNewAnnouncement(
        newAnnouncement.title,
        newAnnouncement.type,
        'admin'
      );
    }
    
    return newAnnouncement;
  };

  const updateAnnouncement = (id, updates) => {
    setAnnouncements(announcements.map(ann =>
      ann.id === id ? { ...ann, ...updates } : ann
    ));
  };

  const approveAnnouncement = (id) => {
    const announcement = announcements.find(ann => ann.id === id);
    setAnnouncements(announcements.map(ann =>
      ann.id === id ? { ...ann, status: 'approved' } : ann
    ));
    
    // Notify creator (teacher) about approval
    if (announcement && notificationsContext?.notifyAnnouncementApproved) {
      notificationsContext.notifyAnnouncementApproved(
        announcement.title,
        'teacher'
      );
    }
    
    // Notify target audience about new announcement
    if (announcement && notificationsContext?.notifyNewAnnouncement) {
      announcement.targetAudience.forEach(audience => {
        if (audience !== 'admin') {
          notificationsContext.notifyNewAnnouncement(
            announcement.title,
            announcement.type,
            audience === 'parents' ? 'parent' : audience
          );
        }
      });
    }
  };

  const rejectAnnouncement = (id) => {
    const announcement = announcements.find(ann => ann.id === id);
    setAnnouncements(announcements.filter(ann => ann.id !== id));
    
    // Notify creator (teacher) about rejection
    if (announcement && notificationsContext?.notifyAnnouncementRejected) {
      notificationsContext.notifyAnnouncementRejected(
        announcement.title,
        'teacher'
      );
    }
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  // Get announcements for specific audience
  const getAnnouncementsForAudience = (audience, status = null, childClass = null) => {
    return announcements.filter(ann => {
      const audienceMatch = ann.targetAudience.includes(audience);
      const statusMatch = status ? ann.status === status : true;
      const classMatch = childClass ? (!ann.class || ann.class === childClass) : true;
      return audienceMatch && statusMatch && classMatch;
    });
  };

  // Get pending announcements (for admin)
  const getPendingAnnouncements = () => {
    return announcements.filter(ann => ann.status === 'pending');
  };

  const value = {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    approveAnnouncement,
    rejectAnnouncement,
    deleteAnnouncement,
    getAnnouncementsForAudience,
    getPendingAnnouncements
  };

  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within AnnouncementsProvider');
  }
  return context;
};
