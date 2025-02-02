import App from './App';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Chat from './components/Chat/Chat';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/chat-example', element: <Chat /> },  
      { 
        path: '/dashboard',
        element: <RequireAuth />,
        children: [
          { path: '', element: <Dashboard /> },
          { path: '/dashboard/:userId', element: <Profile /> }
        ],
      },
    ],
  },
];

export default routes;