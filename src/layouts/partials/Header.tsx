import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCurrentUser } from '@/store/authSlice'

import PopupLogin from "@/components/PopupLogin"
import Confirm from "@/components/Confirm"
import NotificationServices from '@/firebase/notification/notification'

import AuthServices from '@/firebase/auth/auth'
import { NotificationType } from "@/types/Notification";

const Header = () => {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [isShowDialogNotification, setIsShowDialogNotification] = useState(false)
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [isShowPopupLogin, setIsShowPopupLogin] = useState(false)

  const logout = () => {
    AuthServices.logout()
    dispatch(setCurrentUser(null))
  }

  const countNotSeenNotifications = useMemo(() => notifications.filter(e => !e.seenBy.includes(currentUser?.uid || '')).length, [notifications])

  useEffect(() => (() => {
    if (currentUser) {
      NotificationServices.getNotificationsSnapshot(currentUser.uid, data => {
        setNotifications(data)
      })
    }
  }), [currentUser])

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
                <button className="btn btn-purple" onClick={() => setIsShowDialogNotification(!isShowDialogNotification)}>
                  Notification <span className={["ml-2 bg-white w-6 h-6 rounded-full text-purple-500 font-semibold inline-flex items-center justify-center", countNotSeenNotifications ? 'animate-bounce' : ''].join(' ')}>{countNotSeenNotifications}</span>
                </button>
                {isShowDialogNotification && (
                  <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 w-[500px] max-w-[80vw] max-h-[400px] overflow-y-auto bg-white text-gray-900 shadow-md z-20">
                    {notifications.length ? notifications.map((notify, nIndex) => (
                      <div className={["cursor-pointer px-3 py-1 border-b-[1px] flex items-center relative hover:bg-gray-200", notify.seenBy.includes(currentUser.uid) ? '' : 'bg-gray-100'].join(' ')} key={`notify-${nIndex}`}>
                        {notify.seenBy.includes(currentUser.uid) ? '' : <span className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full"></span>}
                        <div className="w-2/3">
                          <div className="text-md font-semibold truncate" title="abc">{notify.videoTitle}</div>
                          <div className="text-base truncate" title="abcd">{notify.authorEmail}</div>
                        </div>
                        <div className="w-1/3">
                          <div className="text-sm">12:00</div>
                          <div className="text-sm">28/06/2023</div>
                        </div>
                      </div>
                    )) : (
                      <div className="px-3 py-1 text-center">
                        No notifications.
                      </div>
                    )}
                    
                  </div>
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