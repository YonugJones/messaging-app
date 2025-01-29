// import axios from '../api/axios'
// import useAuth from './useAuth'

// const REFRESH_URL = '/refresh';

// const useRefreshToken = () => {
//   const { setAuth } = useAuth();

//   const refresh = async () => {
//     const { data } = await axios.get(REFRESH_URL, {
//       withCredentials: true,
//     });
//     setAuth((prev) => {
//       console.log(JSON.stringify(prev));
//       console.log(`Access Token:`, data.accessToken);
//       return { ...prev, accessToken: data.accessToken };
//     });
//     return data.accessToken;
//   }
//   return refresh;
// };

// export default useRefreshToken;