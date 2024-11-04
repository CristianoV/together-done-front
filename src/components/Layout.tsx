import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  user: {
    firstName: string;
    lastName: string;
  } | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar user={user} onLogout={onLogout} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
