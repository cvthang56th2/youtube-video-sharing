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
      <div className='flex flex-wrap -mx-3 items-stretch'>
        {videos.map((video, vIndex) => (
          <div className='w-full md:w-1/2 xl:w-1/3 px-3 mb-8'>
            <div className='last:mb-0 border-2 rounded-xl h-full flex flex-col' key={`video-${vIndex}`}>
              <div className="flex-0 w-full h-[200px] md:h-[400px] lg:h-[250px] relative group cursor-pointer" onClick={() => watchVideo(video.id)}>
                <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover !m-0 pointer-events-none rounded-tr-xl rounded-tl-xl" />
                <div className="absolute inset-0 bg-gray-800 opacity-60 group-hover:opacity-20 transition-all duration-200 pointer-events-none rounded-tr-xl rounded-tl-xl"></div>
                <ReactSVG src={PlayBtnIcon} className="center-middle !m-0 fill-white pointer-events-none" />
              </div>
              <div className='px-4 py-3 flex-1'>
                <VideoInfo isShowReaction={isShowReaction} video={video} currentUser={currentUser} watchVideo={watchVideo} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <PopupVideo isShow={isShowPopupVideo} videoId={watchingVideoId} close={() => setIsShowPopupVideo(false)} />
    </>
  )
}

export default ListVideo