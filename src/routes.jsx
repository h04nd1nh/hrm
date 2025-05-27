import { Navigate } from 'react-router-dom';
import { Login, Dashboard, NotFound, Calendar, Employee, Vacation, Messenger, Config, Profile, Request } from './pages';

// Routes configuration
const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    protected: true,
  },
  {
    path: '/calendar',
    element: <Calendar />,
    protected: true,
  },
  {
    path: '/employee',
    element: <Employee />,
    protected: true,
  },
  {
    path: '/vacation',
    element: <Vacation />,
    protected: true,
  },
  {
    path: '/messenger',
    element: <Messenger />,
    protected: true,
  },
  {
    path: '/config',
    element: <Config />,
    protected: true,
  },
  {
    path: '/profile',
    element: <Profile />,
    protected: true,
  },
  {
    path: '/request',
    element: <Request />,
    protected: true,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default routes; 