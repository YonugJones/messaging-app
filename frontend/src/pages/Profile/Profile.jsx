import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useParams, useNavigate } from 'react-router-dom';

const USERNAME_REGEX = /^\S{3,24}$/;

const Profile = () => {
  const { setAuth } = useAuth();
  const { userId } = useParams();
  const USER_URL = `/users/${userId}`

  const axiosPrivate = useAxiosPrivate();

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const usernameRef = useRef();
  const profilePicRef = useRef();
  const profileBioRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  // set focus to usernameRef on mount
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  // empty the errMsg if the user changes the input
  useEffect(() => {
    setErrMsg('');
  }, [username]);

  // Validates the username property
  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  // retrieve user information on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axiosPrivate.get(USER_URL);
        const userData = data.data;
        setUsername(userData.username || '');
        setProfilePic(userData.profilePic || '');
        setProfileBio(userData.profileBio || '');
        console.log('getting user info')
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    };

    fetchUserData();
  }, [USER_URL, axiosPrivate, setUsername, setProfilePic, setProfileBio]);

  // handle submit and change profile info
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosPrivate.put(USER_URL, 
        JSON.stringify({ username, profilePic, profileBio })
      );
      setAuth(prev => ({
        ...prev, 
        username: data.data.username, 
        accessToken: data.data.accessToken, 
      }));

      navigate('/dashboard', { state: { refreshChats: true } });
    } catch (err) {
      console.log('Failed to update user info:', err);
    }
  }


  return (
    <section className='profile-container'>
      {/* errMsg display at top of form */}
      <p
        ref={errRef}
        className={ errMsg ? 'errmsg' : 'offscreen' }
        aria-live='assertive'
      >
        {errMsg}
      </p>
      <h1>Profile Details of {username}</h1>
      <form onSubmit={handleSubmit}>
        {/* USERNAME FIELD */}
        <span className={ validUsername ? 'valid' : 'hide' }>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={ validUsername || !username ? 'hide' : 'invalid' }>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <label htmlFor='username'>
          Username:
        </label>
        <input 
          type='text'
          id='username' 
          ref={usernameRef}
          autoComplete='off'
          onChange={(e) => setUsername(e.target.value)}
          value={username}  
          required
        />
        <p
          id='uidnote'
          className={ username && !validUsername ? 'instructions' : 'offscreen' }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must have 3 to 24 characters <br />
          Username cannot contain spaces <br />
          Cannot start with a space <br />
        </p>
        {/* PROFILE PIC FIELD */}
        <label htmlFor='profilePic'>
          Profile Pic:
        </label>
        <input 
          placeholder='Must be a valid image address'
          type='text'
          id='profilePic' 
          ref={profilePicRef}
          autoComplete='off'
          onChange={(e) => setProfilePic(e.target.value)}
          value={profilePic}
        />
        <img src={profilePic} alt='Profile' />
        {/* PROFILE BIO FIELD */}
        <label htmlFor='profileBio'>
          Profile Bio:
        </label>
        <textarea 
          id='profileBio' 
          ref={profileBioRef}
          autoComplete='off'
          onChange={(e) => setProfileBio(e.target.value)}
          value={profileBio}
        />
        <button>Update Profile and head back to dashboard</button>
      </form>
    </section>
  )
}

export default Profile;