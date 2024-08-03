import { lazy } from 'react';
import type { RouteProps } from 'react-router-dom';

const Register = lazy(() => import('./index'));

/** 路由配置 */
export const routeConfig: RouteProps[] = [
  {
    path: '/register',
    element: <Register />,
  },
];