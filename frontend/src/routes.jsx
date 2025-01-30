import App from './App';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard/Dashboard';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { 
        path: '/dashboard',
        element: <RequireAuth />,
        children: [
          { path: '', element: <Dashboard /> },
          { path: '/dashboard/1', element: <PageOne /> },
          { path: '/dashboard/2', element: <PageTwo /> }
        ],
      },
    ],
  },
];

export default routes;