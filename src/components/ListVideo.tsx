import { useState, useEffect, useMemo } from 'react'
import { ReactSVG } from 'react-svg'

import { toLowerCaseNonAccentVietnamese } from '@/utils/utils'
import VideoServices from '@/firebase/video/video'
import NotificationServices from '@/firebase/notification/notification'

import { VideoType } from "@/types/Video"
import PlayBtnIcon from '@/icons/play-btn.svg'
import PopupVideo from '@/components/PopupVideo'
import VideoInfo from '@/components/VideoInfo'
import Confirm from '@/components/Confirm'


type PropsType = {
  videos: VideoType[],
  isShowReaction?: boolean
  showActions?: boolean
}

const ListVideo = ({ videos, isShowReaction = true, showActions }: PropsType) => {
  const [keyword, setKeyword] = useState('')
  const [isShowPopupVideo, setIsShowPopupVideo] = useState(false)
  const [watchingVideoId, setWatchingVideoId] = useState('')

  const watchVideo = (videoId: string) => {
    setWatchingVideoId(videoId)
    setIsShowPopupVideo(true)
  }
  
  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.currentTarget.value)
  }

  useEffect(() => {
    if (!isShowPopupVideo) {
      setWatchingVideoId('')
    }
    return
  }, [isShowPopupVideo])

  const videosMemo = useMemo(() => {
    let result = JSON.parse(JSON.stringify(videos))
    if (keyword) {
      const regex = new RegExp(keyword, 'gi')
      result = result.filter((video: VideoType) => (
        (video.title && toLowerCaseNonAccentVietnamese(video.title).match(regex)) ||
        (video.authorEmail && video.authorEmail.match(regex))
      ))
    }
    return result
  }, [videos, keyword]);

  const changeVideoStatus = (video: VideoType) => {
    VideoServices.updateVideo(video.id, {
      isPrivate: !video.isPrivate
    })
    NotificationServices.updateVideoNotification(video.id, {
      isArchived: !video.isPrivate
    })
  }

  return (
    <>
      <div className='flex justify-center items-center'>
        <div className='w-full xl:w-1/2'>
          <input className='input-search' value={keyword} onChange={handleChangeKeyword} type="text" placeholder='Search by video name, author name,...' />
        </div>
        <button type='button' className='font-semibold hover:bg-slate-500 hover:text-white px-3 py-1 ml-2 border-2 rounded-md transition-all duration-250 ease-linear' onClick={() => setKeyword('')}>Clear</button>
      </div>
      <div className='list-video flex flex-wrap -mx-3 mt-4'>
        {videosMemo.map((video: VideoType, vIndex: number) => (
          <div className='video-item w-full md:w-1/2 xl:w-1/3 px-3 mb-8' key={`video-${vIndex}`}>
            
            <div className='last:mb-0 border-2 rounded-xl h-full group hover:shadow-xl cursor-pointer transition-all duration-250 ease-linear relative' key={`video-${vIndex}`}>
              {showActions && (
                <>
                  <span className={['status-badge absolute top-1 left-1 text-white z-10 p-1 text-sm rounded-full pointer-events-none', video.isPrivate ? 'bg-gray-400' : 'bg-green-400'].join(' ')}>{video.isPrivate ? 'Private' : 'Public'}</span>
                  <Confirm wrapClasses='absolute top-1 right-1 z-10' onYes={() => changeVideoStatus(video)}>
                    <button className='btn-change-status btn btn-blue text-sm'>Change To {video.isPrivate ? 'Public' : 'Private'}</button>
                  </Confirm>
                </>
              )}
              <div className='video-box h-full flex flex-col' onClick={() => watchVideo(video.id)}>
                <div className="flex-0 w-full h-[200px] md:h-[400px] lg:h-[250px] relative">
                  <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover !m-0 pointer-events-none rounded-tr-xl rounded-tl-xl" />
                  <div className="absolute inset-0 bg-gray-800 opacity-60 group-hover:opacity-20 transition-all duration-200 pointer-events-none rounded-tr-xl rounded-tl-xl"></div>
                  <ReactSVG src={PlayBtnIcon} className="center-middle !m-0 fill-white pointer-events-none" />
                </div>
                <div className='px-4 py-3 flex-1'>
                  <VideoInfo isShowReaction={isShowReaction} showDescription={false} video={video} />
                </div>
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