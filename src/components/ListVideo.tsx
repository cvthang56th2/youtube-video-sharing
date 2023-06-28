import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ReactSVG } from 'react-svg'

import VideoServices from '@/firebase/video/video'

import { VideoType } from "@/types/Video"
import { selectCurrentUser } from '@/store/authSlice'
import PlayBtnIcon from '@/icons/play-btn.svg'
import PopupVideo from '@/components/PopupVideo'

type PropsType = {
  videos: VideoType[],
  isShowReaction?: boolean
}

const ListVideo = ({ videos, isShowReaction }: PropsType) => {
  const currentUser = useSelector(selectCurrentUser)
  const [isShowPopupVideo, setIsShowPopupVideo] = useState(false)
  const [watchingVideoId, setWatchingVideoId] = useState('')

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

  return (
    <>
      {videos.map((videoObj, vIndex) => (
        <div className='flex flex-wrap -mx-4 mb-7 last:mb-0 py-2' key={`video-${vIndex}`}>
          <div className='w-full lg:w-5/12 px-4'>
            <div className="w-full h-[200px] md:h-[400px] lg:h-[350px] bg-gray-200 relative group cursor-pointer" onClick={() => watchVideo(videoObj.id)}>
              <img src={videoObj.thumbnailUrl} alt={videoObj.title} className="absolute inset-0 w-full h-full object-cover !m-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gray-800 opacity-60 group-hover:opacity-20 transition-all duration-200 pointer-events-none"></div>
              <ReactSVG src={PlayBtnIcon} className="center-middle !m-0 fill-white pointer-events-none" />
            </div>
          </div>
          <div className='w-full pt-2 lg:pt-0 lg:w-7/12 px-4'>
            <h5 className="font-bold cursor-pointer underline" onClick={() => watchVideo(videoObj.id)}>{ videoObj.title }</h5>
            <div><span className="font-semibold">Shared by:</span> { videoObj.authorEmail }</div>
            {isShowReaction && (
              <div className="flex items-center">
                <button onClick={() => reaction(videoObj, 'like')} className={["btn font-bold border-2 rounded-sm hover:scale-125", checkIsLiked(videoObj) ? 'text-white bg-blue-600 scale-125' : 'text-blue-600 hover:text-white hover:bg-blue-600'].join(' ')}>Like</button>
                <button onClick={() => reaction(videoObj, 'dislike')} className={["btn font-bold border-2 rounded-sm hover:scale-125 ml-4", checkIsDisLiked(videoObj) ? 'text-white bg-gray-600 scale-125' : 'text-gray-600 hover:text-white hover:bg-gray-600'].join(' ')}>DisLike</button>
              </div>
            )}
            <div className="flex">
              <span><span className="font-semibold">Like:</span> { videoObj.likedBy?.length || 0 }</span>
              <span className="mx-4">-</span>
              <span><span className="font-semibold">Dislike:</span> { videoObj.dislikedBy?.length || 0 }</span>
            </div>
            <div className="font-semibold">Description:</div>
            <div>{ videoObj.description }</div>
          </div>
        </div>
      ))}
      <PopupVideo isShow={isShowPopupVideo} videoId={watchingVideoId} close={() => setIsShowPopupVideo(false)} />
    </>
  )
}

export default ListVideo