import useSWRMutation from 'swr/mutation';
import { sendRequest } from './FEATCH/sendRequest';

export const useRegister = ({
  email,
  password,
  firstName,
  lastName
} : {email: string, password: string, firstName: string, lastName: string}) => {
  const { trigger, isMutating } = useSWRMutation('/api/auth/register', sendRequest);

  const register = async () => {
    try {
      const data = await trigger( { email, password, firstName, lastName } );
      return data;
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  return { register, isMutating };
};