import './App.css'
import LayoutDefault from '@/layouts/Default'
import Home from '@/pages/Home';
import ShareVideo from '@/pages/user/ShareVideo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <LayoutDefault>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/share-video" element={<ShareVideo />} />
        </Routes>
      </LayoutDefault>
    </BrowserRouter>
  )
}

export default App
