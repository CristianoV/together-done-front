import useSWRMutation from 'swr/mutation';
import { sendRequest } from './sendRequest';

export const useLogin = (email: string, password: string) => {
  const { trigger, isMutating } = useSWRMutation('/api/auth/login', sendRequest);

  const login = async () => {
    try {
      const data = await trigger( { email, password } );
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  return { login, isMutating };
};
