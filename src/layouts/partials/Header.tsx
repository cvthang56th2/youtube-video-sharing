import { useState } from "react"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCurrentUser } from '@/store/authSlice'

import PopupLogin from "@/components/PopupLogin"
import Confirm from "@/components/Confirm"

import AuthServices from '@/firebase/auth/auth'

const Header = () => {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const logout = () => {
    AuthServices.logout()
    dispatch(setCurrentUser(null))
  }

  const [isShowPopupLogin, setIsShowPopupLogin] = useState(false)

  return (
    <header className="flex-0 p-4 border-b-2 flex flex-wrap justify-between items-center">
      <Link to="/" className="w-full text-center md:text-left md:w-auto text-3xl font-bold">
        Funny Movies
      </Link>
      <div className="w-full text-center md:text-left md:w-auto mt-4 lg:mt-0">
        {currentUser ? (
          <div className="flex items-center flex-wrap justify-center">
            <span>Welcome: { currentUser.email }</span>
            <div className="flex items-center">
              <button className="btn btn-purple ml-2">Notification <span className="ml-2 bg-white px-[6px] rounded-full text-purple-500 font-semibold inline-block">0</span></button>
              <Link to="/share-video" className="btn btn-blue ml-2">
                Share a movie
              </Link>
              <Link to="/user-shared-video" className="btn btn-pink ml-2">
                My Video
              </Link>
              <Confirm onYes={() => logout()}>
                <button className="btn btn-red ml-2">
                  Logout
                </button>
              </Confirm>
            </div>
          </div>
        ) : (
          <>
            <button id="login-btn" className="btn btn-green" onClick={() => setIsShowPopupLogin(true)}>
              Login / Register
            </button>
            <PopupLogin isShow={isShowPopupLogin} close={() => setIsShowPopupLogin(false)} />
          </>
        )}
      </div>
    </header>
  )
}

export default Header