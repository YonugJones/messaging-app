import './Chat.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';


const Chat = () => {
  const axiosPrivate = useAxiosPrivate();
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const CHAT_URL = `/chats/${chatId}`;
  const { auth } = useAuth();

  // fetches chat and messages on mount and when message dependency changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchChat = async () => {
      try {
        const { data } = await axiosPrivate.get(CHAT_URL, {
          signal: controller.signal
        });
        if (isMounted) {
          setChat(data.data);
          setMessages(data.data.messages)
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchChat();

    return () => {
      isMounted = false;
      controller.abort();
    }

  }, [axiosPrivate, CHAT_URL]);

  // logic to add new message

  return (
    <div className='chat-layout'>
      <div className='chat-container'>
        {/* Chat Header */}
        <div className='chat-header'>
          {/* <h2>{chat?.name || 'Chat'}</h2> */}
          <h2>
            {chat?.chatUsers
              ? chat.chatUsers
                  .map((chatUser) => chatUser?.user) // Ensure chatUser has a user property
                  .filter((user) => user && user.id !== auth?.id) // Check user exists before accessing id
                  .map((user) => user.username) // Extract username
                  .join(', ') || 'Chat'
              : 'Chat'}
          </h2>
        </div>

        {/* Fetched Messages are mapped here */}
        <div className='chat-messages'>
          {messages.length ? (
            messages.map((message) => (
              <div key={message.id} className={message.authorId === auth?.id ? 'message sent' : 'message received'}>
                <p>{message.content}</p>
                <span className='timestamp'>{new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
              </div>
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </div>

        {/* Message Input */}
        <div className='chat-input'>
          <input 
            type='text' 
            placeholder='Type a message...' 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
