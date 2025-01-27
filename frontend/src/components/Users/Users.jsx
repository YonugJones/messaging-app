import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const USERS_URL = '/users';

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(USERS_URL, {
          signal: controller.signal,
        });
        console.log(response.data);
        if (isMounted) setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);

        if (err?.response?.status === 403) {
          navigate('/login', { state: { from: location }, replace: true });
        } else if (!err.response) {
          console.error('Network or server error:', err.message);
        } else {
          console.error('Unexpected error:', err.response?.data || err.message);
        }
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, location, navigate]);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
