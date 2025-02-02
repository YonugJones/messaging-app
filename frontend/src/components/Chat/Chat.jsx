import './Chat.css';

const Chat = () => {
  return (
    <div className='chat-layout'>
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <h2>Chat Name</h2>
        </div>



        {/* Example Messages Area */}
        <div className="chat-messages">
          <div className="message received">
            <p>Hello! How are you?</p>
            <span className="timestamp">10:30 AM</span>
          </div>
          <div className="message sent">
            <p>I&apos;m good, thanks! You?</p>
            <span className="timestamp">10:31 AM</span>
          </div>
          <div className="message received">
            <p>Hello! How are you?</p>
            <span className="timestamp">10:30 AM</span>
          </div>
          <div className="message sent">
            <p>I&apos;m good, thanks! You?</p>
            <span className="timestamp">10:31 AM</span>
          </div>
          <div className="message received">
            <p>Hello! How are you?</p>
            <span className="timestamp">10:30 AM</span>
          </div>
          <div className="message sent">
            <p>I&apos;m good, thanks! You?</p>
            <span className="timestamp">10:31 AM</span>
          </div>
        </div>



        {/* Message Input */}
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
