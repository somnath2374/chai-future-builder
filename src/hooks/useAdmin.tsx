
import { useState, useEffect } from 'react';

interface AdminUser {
  username: string;
  isAdmin: boolean;
}

export const useAdmin = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in from localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      const admin = { username: 'admin', isAdmin: true };
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  return {
    adminUser,
    isAdminAuthenticated,
    adminLogin,
    adminLogout
  };
};
