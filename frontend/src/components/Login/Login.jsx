import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import './Login.css';

const LOGIN_URL = '/auth/login';

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

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

    try {
      const { data } = await axios.post(LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(data)); // backend sends succes, message, and data which includes id, username, and accessToken
      const { accessToken } = data;
      setAuth({ username, accessToken })
      setUsername('');
      setPassword('');
      navigate(from, { replace: true }); // sent back to where the user came from
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username or password')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login failed')
      }
      errRef.current.focus()
    }
  }
  
  return (
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
  )
}

export default Login;