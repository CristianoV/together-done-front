import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../pages/login';
import Index from '../pages';
import Home from '../pages/home';
import Layout from '../components/Layout.tsx';
import { useEffect, useState } from 'react';

export const AppRoutes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <Routes>
      {/* Rotas com o Navbar */}
      <Route
        path='/'
        element={
          <Layout user={user} onLogout={handleLogout}>
            <Index />
          </Layout>
        }
      />
      <Route
        path='/home'
        element={
          <Layout user={user} onLogout={handleLogout}>
            <Home />
          </Layout>
        }
      />

      {/* Rota sem o Navbar */}
      <Route path='/login' element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
