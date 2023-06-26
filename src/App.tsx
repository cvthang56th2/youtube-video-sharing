import './App.css'
import LayoutDefault from '@/layouts/Default'
import Home from '@/pages/Home';
import ShareVideo from '@/pages/user/ShareVideo';
import ErrorPage from '@/pages/ErrorPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user/share-video",
    element: <ShareVideo />,
  },
]);

function App() {

  return (
    <>
      <LayoutDefault>
        <RouterProvider router={router} />
      </LayoutDefault>
    </>
  )
}

export default App
