import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getUsers } from '../../api/userService';
import useRefreshToken from '../../hooks/useRefreshToken';

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const data = await getUsers(axiosPrivate, controller.signal);
        if (isMounted) setUsers(data.data);
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

    fetchUsers();

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
          {users.map((user) => (
            <li key={user.id}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      <button onClick={() => refresh()}>Refresh</button>
      <br />
    </article>
  );
};

export default Users;
