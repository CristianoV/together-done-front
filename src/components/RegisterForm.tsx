import React, { useState } from 'react';
import InputField from './InputField';
import { useRegister } from '../hooks/useRegister';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, isMutating } = useRegister({ email, password, firstName, lastName });

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!firstName || !lastName) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await register();
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      
      setTimeout(() => navigate('/login'), 2000); // Redireciona após 2s
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Ocorreu um erro desconhecido');
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setFirstName('');
      setLastName('');
    }
  };

  return (
    <form onSubmit={handleRegister} className="mt-8 space-y-6">
      <div className="space-y-4">
        <InputField
          label="Nome"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <InputField
          label="Sobrenome"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputField
          label="Confirmar Senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

      <button
        type="submit"
        className={`${
          isMutating ? 'bg-gray-400' : 'bg-green-500'
        } w-full px-4 py-2 text-white rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700`}
        disabled={isMutating}
      >
        {isMutating ? 'Carregando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default RegisterForm;
