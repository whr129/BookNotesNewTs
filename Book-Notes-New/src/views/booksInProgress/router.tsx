import { lazy } from 'react';
import type { RouteProps } from 'react-router-dom';

const BooksInProgress = lazy(() => import('./index'));

/** 路由配置 */
export const routeConfig: RouteProps[] = [
  {
    path: '/personal-center/book-in-read',
    element: <BooksInProgress />,
  },
];