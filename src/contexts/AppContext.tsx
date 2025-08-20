import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'diagnostician';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isRTL: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('admin');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.className = theme;
  }, [language, theme, isRTL]);

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      language,
      setLanguage,
      theme,
      setTheme,
      isRTL
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}