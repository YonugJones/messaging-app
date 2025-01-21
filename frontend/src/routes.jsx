import App from './App';
import ErrorPage from './pages/ErrorPage/ErrorPage';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  }
];

export default routes;