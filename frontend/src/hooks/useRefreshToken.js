import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const REFRESH_URL = '/refresh';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.get(REFRESH_URL);
      setAuth(prev => {
        console.log(JSON.stringify(prev)); // want to look at the prev auth state
        console.log(response.data.accessToken); // want to see the old accessToken
        return { ...prev, accessToken: response.data.accessToken };
      });
      return response.data.accessToken;
    } catch (err) {
      console.error('Error refreshing token:', err);
      setAuth(null);
      throw err;
    }
  };
  return refresh;
}

export default useRefreshToken;