import { useState } from 'react'

import { UserType } from "@/types/User"
import { VideoType } from "@/types/Video"

import VideoServices from '@/firebase/video/video'

type PropsType = {
  isShowReaction: boolean,
  video: VideoType,
  currentUser: UserType | null,
  showWatchVideo?: boolean,
  watchVideo?: (id: string) => void
}

const VideoInfo = ({ isShowReaction, video, currentUser, showWatchVideo = true, watchVideo }: PropsType) => {
  const [shownMore, setShownMore] = useState(false)
  const checkIsLiked = (video: VideoType): boolean => video.likedBy.includes(currentUser?.uid || '')
  const checkIsDisLiked = (video: VideoType): boolean => video.dislikedBy.includes(currentUser?.uid || '')

  const reaction = (video: VideoType, type: 'like' | 'dislike') => {
    if (!currentUser || !video.id) {
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
    <>
      <h5 className={["font-bold underline", showWatchVideo ? 'cursor-pointer' : ''].join(' ')} onClick={() => showWatchVideo && watchVideo && watchVideo(video.id)}>{ video.title }</h5>
      <div><span className="font-semibold">Shared by:</span> { video.authorEmail }</div>
      {isShowReaction && (
        <div className="flex items-center">
          <button onClick={() => reaction(video, 'like')} className={["btn font-bold border-2 rounded-sm hover:scale-125", checkIsLiked(video) ? 'text-white bg-blue-600 scale-125' : 'text-blue-600 hover:text-white hover:bg-blue-600'].join(' ')}>Like</button>
          <button onClick={() => reaction(video, 'dislike')} className={["btn font-bold border-2 rounded-sm hover:scale-125 ml-4", checkIsDisLiked(video) ? 'text-white bg-gray-600 scale-125' : 'text-gray-600 hover:text-white hover:bg-gray-600'].join(' ')}>DisLike</button>
        </div>
      )}
      <div className="flex">
        <span><span className="font-semibold">Like:</span> { video.likedBy?.length || 0 }</span>
        <span className="mx-4">-</span>
        <span><span className="font-semibold">Dislike:</span> { video.dislikedBy?.length || 0 }</span>
      </div>
      <div className="font-semibold">Description:</div>
      <div>
        {!showWatchVideo || video.description.length <= 200 ? video.description : (
          <div>
            { shownMore ? video.description : video.description.substring(0, 200) + '...' }
            <span className='underline text-blue-500 hover:text-blue-500 ml-2 cursor-pointer' onClick={() => setShownMore(!shownMore)}>{shownMore ? 'Close' : 'View All'}</span>
          </div>
        )}
      </div>
      {showWatchVideo && (
        <div className='mt-5'>
          <button className='btn btn-blue text-lg' onClick={() => watchVideo &&watchVideo(video.id)}>Watch Now</button>
        </div>
      )}
    </>
  )
}

export default VideoInfo