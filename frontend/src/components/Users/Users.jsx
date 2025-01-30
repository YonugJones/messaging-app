import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './Users.css';

const USERS_URL = '/users';

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState();

  useEffect(() => {  
    let isMounted = true;
    const controller = new AbortController();

    const getAllUsers = async () => {
      try {
        console.log('get all users')
        const { data } = await axiosPrivate.get(USERS_URL, {
          signal: controller.signal
        });
        isMounted && setUsers(data.data);
      } catch (err) {
        console.error(err);
      }
    }

    getAllUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

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
