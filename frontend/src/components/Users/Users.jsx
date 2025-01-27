import { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);

  return (
    <article>
      <h2>Users List</h2>
      { users?.length
        ? (
          <ul>
            { users.map((user, i) => <li>{ user?.username }</li>) }
          </ul>
        ) : <p>No users to display</p>
      }
    </article>
  )
}

export default Users;