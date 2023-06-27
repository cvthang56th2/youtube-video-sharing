import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from '@/store/store'

import LayoutDefault from '@/layouts/Default'
import Home from '@/pages/Home';
import ShareVideo from '@/pages/user/ShareVideo';
import UserSharedVideo from '@/pages/user/UserSharedVideo';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <LayoutDefault>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/share-video" element={<ShareVideo />} />
            <Route path="/user-shared-video" element={<UserSharedVideo />} />
          </Routes>
        </LayoutDefault>
      </BrowserRouter>
    </Provider>
  )
}

export default App
