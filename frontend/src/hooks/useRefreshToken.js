import axios from '../api/axios';
import useAuth from './useAuth';

const REFRESH_URL = '/refresh';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get(REFRESH_URL, {
        withCredentials: true,
      });
      setAuth(prev => {
        console.log('Previous Auth State:', prev);
        console.log('New Access Token:', response.data.accessToken);
        return { ...prev, accessToken: response.data.accessToken };
      });
      return response.data.accessToken;
    } catch (err) {
      console.error('Error refreshing token:', err);
      setAuth({});
      throw err; // Ensure this propagates correctly
    }
  };
  
  return refresh;
}

export default useRefreshToken;