export const translations = {
  en: {
    // Navigation & Common
    dashboard: 'Dashboard',
    patients: 'Patients',
    appointments: 'Appointments',
    diagnostics: 'Diagnostics',
    billing: 'Billing',
    logout: 'Logout',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    actions: 'Actions',
    
    // Roles
    admin: 'Admin',
    doctor: 'Doctor',
    nurse: 'Nurse',
    receptionist: 'Receptionist',
    diagnostician: 'Diagnostician',
    
    // KPIs
    bedOccupancy: 'Bed Occupancy',
    avgConsultationTime: 'Avg. Consultation Time',
    doctorSuccessRate: 'Doctor Success Rate',
    patientWaitTime: 'Patient Wait Time',
    totalPatients: 'Total Patients',
    todayAppointments: 'Today\'s Appointments',
    pendingTests: 'Pending Tests',
    completedTests: 'Completed Tests',
    urgentTasks: 'Urgent Tasks',
    
    // Patient Management
    patientRegistration: 'Patient Registration',
    patientProfile: 'Patient Profile',
    medicalHistory: 'Medical History',
    vitalSigns: 'Vital Signs',
    allergies: 'Allergies',
    medications: 'Medications',
    
    // Nursing Features
    dischargeSummary: 'Discharge Summary',
    nursingNotes: 'Nursing Notes',
    carePlan: 'Care Plan',
    carePlans: 'Care Plans',
    dischargeForm: 'Discharge Form',
    
    // Appointments
    newAppointment: 'New Appointment',
    rescheduleAppointment: 'Reschedule Appointment',
    appointmentDetails: 'Appointment Details',
    appointmentTime: 'Appointment Time',
    appointmentType: 'Appointment Type',
    
    // Tasks
    myTasks: 'My Tasks',
    pendingTasks: 'Pending Tasks',
    completedTasks: 'Completed Tasks',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    urgent: 'Urgent',
    normal: 'Normal',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    add: 'Add',
    update: 'Update'
  },
  ar: {
    // Navigation & Common
    dashboard: 'لوحة التحكم',
    patients: 'المرضى',
    appointments: 'المواعيد',
    diagnostics: 'التشخيصات',
    billing: 'الفواتير',
    logout: 'تسجيل الخروج',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    today: 'اليوم',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    actions: 'الإجراءات',
    
    // Roles
    admin: 'مدير',
    doctor: 'طبيب',
    nurse: 'ممرض',
    receptionist: 'موظف استقبال',
    diagnostician: 'أخصائي تشخيص',
    
    // KPIs
    bedOccupancy: 'إشغال الأسرة',
    avgConsultationTime: 'متوسط وقت الاستشارة',
    doctorSuccessRate: 'معدل نجاح الطبيب',
    patientWaitTime: 'وقت انتظار المريض',
    totalPatients: 'إجمالي المرضى',
    todayAppointments: 'مواعيد اليوم',
    pendingTests: 'الفحوصات المعلقة',
    completedTests: 'الفحوصات المكتملة',
    urgentTasks: 'المهام العاجلة',
    
    // Patient Management
    patientRegistration: 'تسجيل المريض',
    patientProfile: 'ملف المريض',
    medicalHistory: 'التاريخ الطبي',
    vitalSigns: 'العلامات الحيوية',
    allergies: 'الحساسية',
    medications: 'الأدوية',
    
    // Nursing Features
    dischargeSummary: 'ملخص الخروج',
    nursingNotes: 'ملاحظات التمريض',
    carePlan: 'خطة الرعاية',
    dischargeForm: 'نموذج الخروج',
    
    // Appointments
    newAppointment: 'موعد جديد',
    rescheduleAppointment: 'إعادة جدولة الموعد',
    appointmentDetails: 'تفاصيل الموعد',
    appointmentTime: 'وقت الموعد',
    appointmentType: 'نوع الموعد',
    
    // Tasks
    myTasks: 'مهامي',
    pendingTasks: 'المهام المعلقة',
    completedTasks: 'المهام المكتملة',
    
    // Status
    active: 'نشط',
    inactive: 'غير نشط',
    pending: 'معلق',
    completed: 'مكتمل',
    urgent: 'عاجل',
    normal: 'عادي',
    
    // Actions
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    add: 'إضافة',
    update: 'تحديث'
  }
};

export function t(key: string, language: 'en' | 'ar'): string {
  return translations[language][key as keyof typeof translations.en] || key;
}