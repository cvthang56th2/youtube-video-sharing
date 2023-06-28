import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCurrentUser } from '@/store/authSlice'

import NotificationServices from '@/firebase/notification/notification'

import PopupLogin from "@/components/PopupLogin"
import Confirm from "@/components/Confirm"
import DialogNotifications from "@/components/DialogNotifications"

import AuthServices from '@/firebase/auth/auth'
import { selectNotifications, setNotifications } from "@/store/notificationSlice";
import { preventEvents } from "@/utils/utils";

const Header = () => {
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectNotifications)
  const dispatch = useDispatch()
  
  const [isShowPopupLogin, setIsShowPopupLogin] = useState(false)
  const [isShowDialogNotification, setIsShowDialogNotification] = useState(false)

  const logout = () => {
    AuthServices.logout()
    NotificationServices.unsubscribeUserNotificationSnapshot()
    dispatch(setCurrentUser(null))
  }
  
  useEffect(() => (() => {
    if (currentUser) {
      NotificationServices.getUserNotificationsSnapshot(currentUser.uid, data => {
        dispatch(setNotifications(data))
      })
    }
  }), [currentUser])

  const openDialogNotification = (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
    preventEvents(event)
    setIsShowDialogNotification(true)
  }

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
              
              <div className="ml-2 relative">
                <button className="btn btn-purple" onClick={openDialogNotification}>
                  Notification <span className={["ml-2 bg-white w-6 h-6 rounded-full text-purple-500 font-semibold inline-flex items-center justify-center", notifications.length ? 'animate-bounce' : ''].join(' ')}>{notifications.length}</span>
                </button>
                {isShowDialogNotification && (
                  <DialogNotifications close={() => setIsShowDialogNotification(false)} />
                )}
              </div>
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