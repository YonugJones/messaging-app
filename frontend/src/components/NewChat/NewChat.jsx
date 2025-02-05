import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './NewChat.css';

const NewChat = ({ setShowNewChat, setChats }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const USERS_URL = '/users';
  const CREATE_CHAT_URL = '/chats/new';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosPrivate.get(USERS_URL);
        // Filter out the current user
        setUsers(data.data.filter(user => user.id !== auth?.id));
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [axiosPrivate, auth]);

  const handleCreateChat = async () => {
    if (selectedUserIds.length === 0) {
      console.error('Select at least one user to create a chat');
      return;
    }

    try {
      const { data } = await axiosPrivate.post(CREATE_CHAT_URL, {
        chatUserIds: selectedUserIds.map(id => parseInt(id, 10))
      });

      setChats(prevChats => [...prevChats, data.data]); // Update chat list
      navigate(`/chats/${data.data.id}`); // Redirect to the new chat
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  return (
    <div className='new-chat-container'>
      <h2>Create New Chat</h2>
      <div className='user-selection'>
        {users.map(user => (
          <div key={user.id} className='user-option'>
            <input
              type='checkbox'
              value={user.id}
              onChange={(e) => {
                const userId = e.target.value;
                setSelectedUserIds(prev =>
                  prev.includes(userId)
                    ? prev.filter(id => id !== userId) // Remove if already selected
                    : [...prev, userId] // Add if not selected
                );
              }}
            />
            <label>{user.username}</label>
          </div>
        ))}
      </div>
      <button onClick={handleCreateChat} disabled={selectedUserIds.length === 0}>
        Create Chat
      </button>
      <button onClick={() => setShowNewChat(false)}>Cancel</button>
    </div>
  );
};

export default NewChat;
