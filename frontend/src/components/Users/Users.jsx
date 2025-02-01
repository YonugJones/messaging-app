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
    <article className='user-list-container'>
      <h2>Users List</h2>
      {users?.length
        ? (
          <ul className='user-list'>
            {users.map((user) => <li className='user-list-item' key={user?.id}>{user?.username}</li>)}
          </ul>
        ) : <p>No users to display</p>
      }
    </article>
  );
};

export default Users;
