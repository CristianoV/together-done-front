import React, { useState } from 'react';
import InputField from './InputField';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login, isMutating } = useLogin(email, password);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login();

      const { access_token, refresh_token, user } = response;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');

    } catch (error: unknown) {
      if (error instanceof Error) {
        // setError(error.message);
        console.log(error.message);
        
        if (error.message === 'Error: 401 Unauthorized') {
          setError('Credenciais inválidas');
        } else {
          setError('Ocorreu um erro desconhecido, tente novamente mais tarde');
        }
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setPassword('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleLogin} className='mt-8 space-y-6'>
      <div className='space-y-4'>
        <InputField
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label='Senha'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <button
        type='submit'
        className={`${
          isMutating ? 'bg-gray-400' : 'bg-blue-500'
        } w-full px-4 py-2 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700`}
        disabled={isMutating}
      >
        {isMutating ? 'Carregando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
