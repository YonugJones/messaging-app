import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';
import useRefreshToken from '../hooks/useRefreshToken';

const useAxiosPrivate = () => {
  const { auth } = useAuth(); 
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        // this is not a retry, there has been no auth header set
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      }, (error) => Promise.reject(error)
    );

    // potentially added a NEW accessToken to response auth header
    const responseIntercept = axiosPrivate.interceptors.response.use(
      // if accessToken is attached and not expired, return the response with no changes to interceptors
      response => response,
      // if accessToken has expired
      async (error) => {
        const prevRequest = error?.config;
        // forbidden error if accessToken has expired or this has only tried once
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(newAccessToken);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // on unmount eject the attached auth headers so they don't pile up
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh]);

  // axiosPrivate instance returned with attached interceptors to req and res
  return axiosPrivate;
}

export default useAxiosPrivate;
