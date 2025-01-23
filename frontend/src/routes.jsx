import App from './App';
import Signup from './components/Signup/Signup';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/signup', element: <Signup /> }
    ]
  }
];

export default routes;