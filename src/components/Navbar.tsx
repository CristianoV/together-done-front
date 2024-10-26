import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: {
    firstName: string;
    lastName: string;
  } | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md flex items-center justify-between">
      {/* Logotipo ou Título da Navbar */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        Toghether Done
      </div>

      {/* Links de Navegação */}
      <div className="flex space-x-4">
        <button onClick={() => navigate('/')} className="hover:text-indigo-200">
          Home
        </button>
        <button onClick={() => navigate('/about')} className="hover:text-indigo-200">
          Sobre
        </button>
        <button onClick={() => navigate('/contact')} className="hover:text-indigo-200">
          Contato
        </button>
      </div>

      {/* Saudação do Usuário e Botão de Logout */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="hidden sm:inline-block">
              Olá, {user.firstName} {user.lastName}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
