import App from './App';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/signup', element: <Signup /> },
      { path: '/login', element:  <Login /> }
    ]
  }
];

export default routes;