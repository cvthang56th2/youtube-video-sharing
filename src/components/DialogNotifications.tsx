import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import NotificationServices from '@/firebase/notification/notification'

import { NotificationType } from "@/types/Notification";
import { selectCurrentUser } from '@/store/authSlice'
import { formatDate, preventEvents } from "@/utils/utils";
import { selectNotifications } from "@/store/notificationSlice";
import PopupVideo from './PopupVideo';

const DialogNotifications = (props: { close: () => void }) => {
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectNotifications)
  const [isShowPopupVideo, setIsShowPopupVideo] = useState(false)
  const [watchingVideoId, setWatchingVideoId] = useState('')

  const watchVideo = (videoId: string) => {
    setWatchingVideoId(videoId)
    setIsShowPopupVideo(true)
  }

  useEffect(() => {
    if (!isShowPopupVideo) {
      setWatchingVideoId('')
    }
    return
  }, [isShowPopupVideo])

  const closeOnClickOutside = () => {
    props.close()
  }

  useEffect(() => {
    document.addEventListener('click', closeOnClickOutside)
    return () => {
      document.removeEventListener('click', closeOnClickOutside)
    }
  }, [])


  const seenNotification = (event: { preventDefault: () => void; stopPropagation: () => void }, notify: NotificationType) => {
    preventEvents(event)
    if (!notify.id || !currentUser) {
      return
    }
    NotificationServices.updateNotification(notify.id, {
      seenBy: [
        ...notify.seenBy,
        currentUser.uid
      ],
      notSeenUsers: notify.notSeenUsers.filter(id => id !== currentUser.uid)
    })
  }

  return (
    <>
      <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 w-[500px] max-w-[80vw] max-h-[400px] overflow-y-auto bg-white text-gray-900 shadow-md z-20" onClick={preventEvents}>
        {notifications.length ? notifications.map((notify, nIndex) => (
          <div className="notification-item hover:bg-gray-100 px-3 py-1 border-b-[1px] cursor-pointer" key={`notify-${nIndex}`} onClick={() => watchVideo(notify.videoId)}>
            <div className='flex items-center'>
              <div className="flex-[0_0_70px] h-[40px] relative rounded-md">
                <img src={notify.videoThumbnailUrl} className="absolute inset-0 w-full h-full object-cover !m-0" />
              </div>
              <div className="w-2/3 ml-2">
                <div className="text-md font-semibold truncate video-title" title={notify.videoTitle}>{notify.videoTitle}</div>
                <div className="text-base truncate author-email" title={notify.authorEmail}>{notify.authorEmail}</div>
              </div>
              <div className="w-1/3 text-right">
                <div className="text-sm">
                  {formatDate(notify.createdAt, 'HH:mm')}
                </div>
                <div className="text-sm">
                  {formatDate(notify.createdAt, 'MM/DD/YYYY')}
                </div>
              </div>
            </div>
            <div className='text-right mb-1'>
              <button onClick={() => watchVideo(notify.videoId)} className='btn btn-blue watch-now-btn'>Watch Now</button>
              <button onClick={(event) => seenNotification(event, notify)} className='btn btn-green check-btn ml-4'>Checked</button>
            </div>
          </div>
        )) : (
          <div className="px-3 py-1 text-center">
            No notifications.
          </div>
        )}
      </div>
      <PopupVideo isShow={isShowPopupVideo} videoId={watchingVideoId} close={() => setIsShowPopupVideo(false)} />
    </>
  )
}

export default DialogNotifications