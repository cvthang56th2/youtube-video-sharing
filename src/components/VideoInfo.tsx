import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ReactSVG } from 'react-svg'

import { VideoType } from "@/types/Video"
import { selectCurrentUser } from '@/store/authSlice'

import VideoServices from '@/firebase/video/video'
import { formatDate, preventEvents } from '@/utils/utils'
import { Link } from 'react-router-dom'
import LikeBtnIcon from '@/icons/like-button-icon.svg'
import DislikeBtnIcon from '@/icons/dislike-button-icon.svg'

type PropsType = {
  isShowReaction: boolean,
  video: VideoType,
  showDescription?: boolean,
}

const VideoInfo = ({ isShowReaction, video, showDescription = true  }: PropsType) => {
  const currentUser = useSelector(selectCurrentUser)

  const [shownMore, setShownMore] = useState(false)
  const checkIsLiked = (video: VideoType): boolean => video.likedBy.includes(currentUser?.uid || '')
  const checkIsDisLiked = (video: VideoType): boolean => video.dislikedBy.includes(currentUser?.uid || '')

  const reaction = (event: { preventDefault: () => void; stopPropagation: () => void }, video: VideoType, type: 'like' | 'dislike') => {
    preventEvents(event)
    if (!currentUser) {
      alert('You are not currently logged in. Please log in to perform this action.')
      const loginBtn = document.querySelector('#login-btn') as HTMLElement
      if (loginBtn) {
        loginBtn.click()
      }
      return
    }
    if (!video.id) {
      return
    }
    const field = type === 'like' ? 'likedBy' : 'dislikedBy'
    const oppositeField = field === 'likedBy' ? 'dislikedBy' : 'likedBy'
    const { uid } = currentUser
    const index = video[field].findIndex((id: string) => id === uid)
    if (index === -1) {
      video[field].push(uid)
    } else {
      video[field].splice(index, 1)
    }
    video[oppositeField] = video[oppositeField].filter((id: string) => id !== uid)
    VideoServices.updateVideo(video.id, {
      [field]: video[field],
      [oppositeField]: video[oppositeField]
    })
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1'>
        <h5 className="font-bold underline">{ video.title }</h5>
        <div><span className="font-semibold">Shared by:</span> <Link to={`/user-shared-video/${video.authorId}`}>{ video.authorEmail }</Link></div>
        <div className="flex justify-between items-center">
          <div>
            <span><span className="font-semibold">Like:</span> { video.likedBy?.length || 0 }</span>
            <span className="mx-4">-</span>
            <span><span className="font-semibold">Dislike:</span> { video.dislikedBy?.length || 0 }</span>
          </div>
          <div className='italic text-base my-0'>
            { formatDate(video.createdAt, 'fromNow') }
          </div>
        </div>
        {isShowReaction && (
          <div className="flex items-center">
            <button onClick={(event) => reaction(event, video, 'like')} className={["rounded-full hover:scale-125 transition-all duration-100 ease-in-out border-4", checkIsLiked(video) ? 'border-blue-500' : 'border-transparent'].join(' ')}>
              <ReactSVG src={LikeBtnIcon} width={30} height={30} wrapper='svg' />
            </button>
            <button onClick={(event) => reaction(event, video, 'dislike')} className={["rounded-full hover:scale-125 transition-all duration-100 ease-in-out border-4 ml-4", checkIsDisLiked(video) ? 'border-blue-500' : 'border-transparent'].join(' ')}>
              <ReactSVG src={DislikeBtnIcon} width={30} height={30} wrapper='svg' />
            </button>
          </div>
        )}
        {showDescription && (
          <>
            <div className="font-semibold">Description:</div>
            <div onClick={() => setShownMore(!shownMore)}>
              {video.description.length <= 200 ? video.description : (
                <div>
                  { shownMore ? video.description : video.description.substring(0, 200) + '...' }
                  <span className='underline text-blue-500 hover:text-blue-500 ml-2 cursor-pointer'>{shownMore ? 'Close' : 'View All'}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VideoInfo