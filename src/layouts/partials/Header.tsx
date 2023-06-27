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
      <div className="w-full text-center md:text-left md:w-auto mt-4 md:mt-0">
        {currentUser ? (
          <div className="flex items-center flex-wrap justify-center">
            <span>Welcome: someone@gmail.com</span>
            <div className="flex items-center">
              <Link to="/share-video" className="btn btn-blue ml-2">
                Share a movie
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
            <button className="btn btn-green" onClick={() => setIsShowPopupLogin(true)}>
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