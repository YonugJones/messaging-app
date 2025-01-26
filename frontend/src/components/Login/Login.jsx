import { useRef, useState, useEffect } from 'react';
// import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // set focus to usernameRef on mount
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  // empty the errMsg if the user changes the input
  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    setUsername('');
    setPassword('');
    setSuccess(true);
    
  }
  
  return (
    <>
      { success ? (
        <section>
          <h1>Login successful</h1>
          <br />
          <p>
            <Link to='/'>Go home</Link>
          </p>
        </section>
      ) : (
        <section>
          {/* errMsg display at top of form */}
          <p
            ref={errRef}
            className={ errMsg ? 'errmsg' : 'offscreen' }
            aria-live='assertive'
          >
            {errMsg}
          </p>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            {/* USERNAME FIELD */}
            <label htmlFor='username'>
              Username:
            </label>
            <input 
              type='text'
              id='username' 
              ref={usernameRef}
              autoComplete='on'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
            {/* PASSWORD FIELD */}
            <label htmlFor='password'>
              Password:
            </label>
            <input 
              type='password'
              id='password' 
              autoComplete='off'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button>Login</button>
            <p>
              Need an account?<br />
              <span className='line'>
                <Link to='/signup'>
                  Signup
                </Link>
              </span>
            </p>
            <p>
              <span>
                Feel free to use the Guest account <br />
                Username: Guest <br />
                Password: GuestPassword1?
              </span>
            </p>
          </form>
        </section>
      )}
    </>
  )
}

export default Login;