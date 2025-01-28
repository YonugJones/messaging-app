import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { signup } from '../../api/authService';
import './Signup.css';

const USERNAME_REGEX = /^\S{3,24}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

const Signup = () => {
  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Sets focus to usernameRef
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  // Validates the username property
  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  // Validates the password property
  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const confirm = password === confirmPassword;
    setValidConfirmPassword(confirm);
  }, [password, confirmPassword]);

  // Removes error message if input changes
  useEffect(() => {
    setErrMsg('');
  }, [username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call with inputed credentials
      await signup({ username, password, confirmPassword });
      setSuccess(true);
      // clear the input fields 
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username taken');
      } else {
        setErrMsg('Registration failed');
      }
      errRef.current.focus();
    }
  }

  return (
    <>
      { success ? (
        <section>
          <h1>Success!</h1>
          <Link to='#'>Login</Link>
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
          <h1>Signup</h1>
          {/* USERNAME FIELD */}
          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>
              Username: 
              <span className={ validUsername ? 'valid' : 'hide' }>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={ validUsername || !username ? 'hide' : 'invalid' }>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input 
              type='text'
              id='username'
              ref={usernameRef}
              autoComplete='off'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required 
              aria-invalid={ validUsername ? 'false' : 'true' }
              aria-describedby='uidnote'
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
            />
            <p
              id='uidnote'
              className={ usernameFocus && username && !validUsername ? 'instructions' : 'offscreen' }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must have 3 to 24 characters <br />
              Username cannot contain spaces <br />
              Cannot start with a space <br />
            </p>
            {/* PASSWORD FIELD */}
            <label htmlFor="password">
              Password:
              <span className={ validPassword ? 'valid' : 'hide' }>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={ validPassword || !password ? 'hide' : 'invalid' }>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input 
              type='password' 
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete='off'
              required
              aria-invalid={ validPassword ? 'false' : 'true' }
              aria-describedby='pwdnote'
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id='pwdnote'
              className={ passwordFocus && !validPassword ? 'instructions' : 'offscreen' }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be at least 10 characters <br />
              Password must contain upper and lower case letters, a number, and a special character <br />
              Allowed special characters: <span aria-label='exlamations mark'>!</span>
              <span aria-label='at symbol'>@</span><span aria-label='hashtag'>#</span>
              <span aria-label='dollar sign'>$</span><span aria-label='percent'>%</span>
              <span aria-label='carrot sign'>^</span><span aria-label='ampersand'>&</span>
              <span aria-label='asterisk'>*</span><span aria-label='open parentheses'>(</span>
              <span aria-label='closed parentheses'>)</span>
            </p>
            {/* CONFIRM PASSWORD FIELD */}
            <label htmlFor='confirmPassword'>
              Confirm Password:
              <span className={ validConfirmPassword && confirmPassword ? 'valid' : 'hide' }>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={ validConfirmPassword || !confirmPassword ? 'hide' : 'invalid' }>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input 
              type='password' 
              id='confirmPassword'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              autoComplete='off'
              required
              aria-invalid={ validConfirmPassword ? 'false' : 'true' }
              aria-describedby='confirmnote'
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
            />
            <p
              id='confirmnote'
              className={ confirmPasswordFocus && !validConfirmPassword ? 'instructions' : 'offscreen' }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Passwords must match <br />
            </p>

            <button disabled={ !validUsername || !validPassword || !validConfirmPassword ? true : false }>
              Signup
            </button>
          </form>
          <p>
            Already registered?<br />
            <span className='line'>
              <Link to='/login'>
                Login
              </Link>
            </span>
          </p>
        </section>
      )}
    </>  
  )
}

export default Signup