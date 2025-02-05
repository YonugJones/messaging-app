import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import './ChatsList.css';
import NewChat from '../NewChat/NewChat';

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const CHATS_URL = '/chats';

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserChats = async () => {
      try {
        const { data } = await axiosPrivate.get(CHATS_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setChats(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getUserChats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  return (
    <section className='chats-list-container'>
      <div className='chats-list-header'>
        <div className='chats-list-header-left'>
          <h2>User chats</h2>
        </div>
        <div 
          className='chats-list-header-right' 
          onClick={() => setShowNewChat(true)} 
          style={{ cursor: 'pointer' }}
        >
          <p>NEW CHAT</p>
        </div>
      </div>

      {showNewChat ? (
        <NewChat setShowNewChat={setShowNewChat} setChats={setChats} />
      ) : chats?.length ? (
        <ul className='chats-list'>
          {chats.map((chat) => (
            <li 
              className='chat-list-item' 
              key={chat.id} 
              onClick={() => navigate(`/chats/${chat.id}`)} 
              style={{ cursor: 'pointer' }}
            >
              <strong>
                {chat?.chatUsers
                  ? chat.chatUsers
                      .map((chatUser) => chatUser?.user)
                      .filter((user) => user && user.id !== auth?.id)
                      .map((user) => user.username)
                      .join(', ') || `Chat ${chat.id}`
                  : `Chat ${chat.id}`}
              </strong>  
              {chat.messages?.length > 0 ? (
                <p>{chat.messages[0].content}</p>
              ) : (
                <p>No messages yet</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats to display</p>
      )}
    </section>
  );
}

export default ChatsList;