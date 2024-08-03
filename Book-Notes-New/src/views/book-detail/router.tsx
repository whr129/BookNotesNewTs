import { lazy } from 'react';
import type { RouteProps } from 'react-router-dom';

const BookDetail = lazy(() => import('./index'));

/** 路由配置 */
export const routeConfig: RouteProps[] = [
  {
    path: '/personal-center/book-detail/:id',
    element: <BookDetail/>,
  },
];