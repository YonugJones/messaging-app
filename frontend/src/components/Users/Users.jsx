import { useState, useEffect } from 'react';
import axios from '../../api/axios';
// import { useNavigate, useLocation } from 'react-router-dom';
import useRefreshToken from '../../hooks/useRefreshToken';

import './Users.css';

const USERS_URL = '/users';

const Users = () => {
  // const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState();
  // const navigate = useNavigate();
  // const location = useLocation();
  const refresh = useRefreshToken();

  useEffect(() => {  
    let isMounted = true;
    const controller = new AbortController();

    const getAllUsers = async () => {
      try {
        console.log('get all users')
        const { data } = await axios.get(USERS_URL, {
          signal: controller.signal
        });
        isMounted && setUsers(data.data);
      } catch (err) {
        console.error(err);
        // navigate('/login', { state: { from: location }, replace: true })
      }
    }

    getAllUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length
        ? (
          <ul>
            {users.map((user) => <li key={user?.id}>{user?.username}</li>)}
          </ul>
        ) : <p>No users to display</p>
      }
      <button onClick={() => refresh()}>Refresh</button>
    </article>
  );
};

export default Users;
