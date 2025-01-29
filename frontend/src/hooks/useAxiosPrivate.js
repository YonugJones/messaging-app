import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';
import useRefreshToken from '../hooks/useRefreshToken';

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  // attach accessToken to req header IF there is no req header AND if user's auth contains accessToken
  axiosPrivate.interceptors.request.use(
    async (config) => {
      if (!config.headers['Authorization'] && auth?.accessToken) {
        config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // get ready to attach to response
  axiosPrivate.interceptors.response.use(
    // if response return true, do nothing to it
    (response) => response,
    // if error
    async (error) => {
      // define prevRequest as error config
      const prevRequest = error?.config;
      // if error resopnse is 403 and response has been sent ONCE
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        // generate newAccessToken
        const newAccessToken = refresh();
        // if success
        if (newAccessToken) {
          // set access token in response headers
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
      }
      return Promise.reject(error);
    }
  );
  return axiosPrivate;
}

export default useAxiosPrivate;
