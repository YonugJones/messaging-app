import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

import './Users.css';

const USERS_URL = '/users';

const Users = () => {
  const [users, setUsers] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getAllUsers = async () => {
      try {
        const { data } = await axios.get(USERS_URL, {
          signal: controller.signal
        });
        console.log(data.data);
        isMounted && setUsers(data.data);
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true })
      }
    }

    getAllUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location, navigate]);

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
    </article>
  );
};

export default Users;
