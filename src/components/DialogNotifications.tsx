import { useSelector } from 'react-redux'

import NotificationServices from '@/firebase/notification/notification'

import { NotificationType } from "@/types/Notification";
import { selectCurrentUser } from '@/store/authSlice'
import { formatDate } from "@/utils/utils";
import { selectNotifications } from "@/store/notificationSlice";

const Notifications = () => {
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectNotifications)

  const seenNotification = (notify: NotificationType) => {
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
    <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 w-[500px] max-w-[80vw] max-h-[400px] overflow-y-auto bg-white text-gray-900 shadow-md z-20">
      {notifications.length ? notifications.map((notify, nIndex) => (
        <div className={["cursor-pointer px-3 py-1 border-b-[1px] flex items-center relative hover:bg-gray-200", notify.seenBy.includes(currentUser?.uid || '') ? '' : 'bg-gray-100'].join(' ')} key={`notify-${nIndex}`} onClick={() => seenNotification(notify)}>
          <div className="flex-[0_0_70px] h-[40px] relative rounded-md">
            <img src={notify.videoThumbnailUrl} className="absolute inset-0 w-full h-full object-cover !m-0" />
          </div>
          <div className="w-2/3 ml-2">
            <div className="text-md font-semibold truncate" title="abc">{notify.videoTitle}</div>
            <div className="text-base truncate" title="abcd">{notify.authorEmail}</div>
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
      )) : (
        <div className="px-3 py-1 text-center">
          No notifications.
        </div>
      )}
    </div>
  )
}

export default Notifications