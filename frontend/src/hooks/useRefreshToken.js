import axios from '../api/axios';
import useAuth from './useAuth';

const REFRESH_URL = '/refresh'; 

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const { data } = await axios.get(REFRESH_URL, {
        withCredentials: true, // Send the HTTP-only cookie
      });

      setAuth(prev => {
        return { ...prev, accessToken: data.accessToken };
      });

      return data.accessToken;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return null; // Handle expired refresh token
    }
  };

  return refresh;
};

export default useRefreshToken;
