import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';
import useRefreshToken from '../hooks/useRefreshToken';

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    // attach accessToken to req header IF there is no req header AND if user's auth contains accessToken
  const requestIntercept = axiosPrivate.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization'] && auth?.accessToken) {
        config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        console.log('accesToken attached to request intercept');
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // get ready to attach to response
  const responseIntercept = axiosPrivate.interceptors.response.use(
    // if response return true, do nothing to it
    (response) => response,
    // if error
    async (error) => {
      // define prevRequest as error config
      const prevRequest = error?.config;
      // if error resopnse is   3 and response has been sent ONCE
      if (error?.response?.status === 403 && !prevRequest?.sent) {
        prevRequest.sent = true;
        // generate newAccessToken
        const newAccessToken = await refresh();
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

  return () => {
    axiosPrivate.interceptors.request.eject(requestIntercept);
    axiosPrivate.interceptors.response.eject(responseIntercept);
  };

  }, [auth, refresh]);

  return axiosPrivate;
}

export default useAxiosPrivate;
