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
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <main className="mt-16">{children}</main> {/* Espaço para Navbar fixa no topo */}
    </div>
  );
};

export default Layout;
