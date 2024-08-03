import { useState } from 'react'
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Home from './views/Home/home'
import NotFound from './views/NotFound/notFound';
import Layouts from './layout/layout';
import { routeConfig as UserInfo } from './views/userInfo/router';
import { routeConfig as ToDoListPage } from './views/ToDoListPage/router';
import { routeConfig as UnReadBooks } from './views/unRead-books/router';
import { routeConfig as AddNewBooks } from './views/addNewBooks/router';
import { routeConfig as BooksInProgress } from './views/booksInProgress/router';
import { routeConfig as BookDetail } from './views/book-detail/router';
import { routeConfig as BookFinished } from './views/book-finish/router';
import type { IRouterConfig } from './types';
import Register from './views/register/index';
import LoginIn from './views/loginIn';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const routeConfigs: IRouterConfig[] = [
    ...UserInfo,
    ...ToDoListPage,
    ...UnReadBooks,
    ...AddNewBooks,
    ...BooksInProgress,
    ...BookDetail,
    ...BookFinished,
  ];

  return (
    <>
       <BrowserRouter>
        <Suspense >
          <Routes>
            <Route key="index" path="/" element={<Home />} />

            <Route path='/register' element={<Register />} />

            <Route path='/loginIn' element={<LoginIn />} />

            <Route path="/personal-center" element={<Layouts />}>
              {routeConfigs.map(({ path, element: Component, subChildren, ...rest }) => {
                return (
                  <Route key={path} path={path} element={Component} {...(rest as any)}>
                    {subChildren &&
                      subChildren.map(subChild => <Route key={subChild.path} {...subChild} />)}
                  </Route>
                );
              })}
            </Route>

            <Route key="notfound" path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
