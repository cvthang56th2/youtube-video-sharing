import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ReactSVG } from 'react-svg'

import { VideoType } from "@/types/Video"
import { selectCurrentUser } from '@/store/authSlice'
import PlayBtnIcon from '@/icons/play-btn.svg'
import PopupVideo from '@/components/PopupVideo'
import VideoInfo from '@/components/VideoInfo'

type PropsType = {
  videos: VideoType[],
  isShowReaction?: boolean
}

const ListVideo = ({ videos, isShowReaction = true }: PropsType) => {
  const currentUser = useSelector(selectCurrentUser)
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

  return (
    <>
      {videos.map((video, vIndex) => (
        <div className='flex flex-wrap -mx-4 last:mb-0 py-4 border-b-2' key={`video-${vIndex}`}>
          <div className='w-full lg:w-5/12 px-4'>
            <div className="w-full h-[200px] md:h-[400px] lg:h-[350px] bg-gray-200 relative group cursor-pointer" onClick={() => watchVideo(video.id)}>
              <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover !m-0 pointer-events-none" />
              <div className="absolute inset-0 bg-gray-800 opacity-60 group-hover:opacity-20 transition-all duration-200 pointer-events-none"></div>
              <ReactSVG src={PlayBtnIcon} className="center-middle !m-0 fill-white pointer-events-none" />
            </div>
          </div>
          <div className='w-full pt-2 lg:pt-0 lg:w-7/12 px-4'>
            <VideoInfo isShowReaction={isShowReaction} video={video} currentUser={currentUser} watchVideo={watchVideo} />
          </div>
        </div>
      ))}
      <PopupVideo isShow={isShowPopupVideo} videoId={watchingVideoId} close={() => setIsShowPopupVideo(false)} />
    </>
  )
}

export default ListVideo