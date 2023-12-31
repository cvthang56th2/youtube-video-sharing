import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'

import VideoServices from '@/firebase/video/video'

import { VideoType } from "@/types/Video";
import { preventEvents } from "@/utils/utils";
import { selectCurrentUser } from '@/store/authSlice'

import VideoInfo from "@/components/VideoInfo";

interface PropsType {
  isShow: boolean,
  videoId: string,
  isShowReaction?: boolean,
  close: () => unknown,
}

const PopupVideo = ({ isShow, close, videoId, isShowReaction = true }: PropsType) => {
  const currentUser = useSelector(selectCurrentUser)
  const [videoData, setVideoData] = useState<VideoType | null>(null)
  const getVideoData = async () => {
    try {
      const data = await VideoServices.getVideoById(videoId)
      setVideoData(data)
    } catch (error) {
      console.log(error)
    }
  }
  const closeOnEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close()
    }
  }
  useEffect(() => {
    if (isShow) {
      getVideoData()
      document.addEventListener('keydown', closeOnEsc)
    } else {
      document.removeEventListener('keydown', closeOnEsc)
    }
    return
  }, [isShow, videoId])
  return (
    <>
      <div className={["w-[100svw] h-[100svh] fixed inset-0 z-50 overflow-y-auto flex items-center justify-center", isShow ? 'bg-[rgba(0,0,0,0.2)]' : 'pointer-events-none'].join(' ')} onClick={() => close()}>
        {isShow && (
          <button className="close-btn absolute top-2 right-2 z-10 border-2 border-black bg-white rounded-full text-3xl px-[6px] hover:text-red-500" onClick={() => close()}>&#10005;</button>
        )}
        <div className={["bg-white w-[1024px] max-w-[90%] max-h-[90%] p-5 rounded-xl shadow-2xl overflow-y-auto flex flex-col transition-all duration-300 ease-in-out relative", isShow ? 'transform-none' : 'scale-0'].join(' ')} onClick={preventEvents}>
          {isShow && (
            <>
              {videoData ? 
              (
                <>
                  {videoData.isPrivate && videoData.authorId !== currentUser?.uid ? (
                    <div className="text-center">Can't watch this video. This video is Private.</div>
                  ) : (
                    <>
                      <div className="flex-0">
                        <div className="w-full h-[300px] xl:h-[400px] relative">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoData.ytVideoId}?autoplay=1`}
                            className="w-full h-full absolute inset-0 video-iframe"
                            title={videoData.title}
                            allowFullScreen
                            allow="autoplay"
                          >
                          </iframe>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto mt-4">
                        <VideoInfo isShowReaction={isShowReaction} video={videoData} onSubmitComment={getVideoData} />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="animate-bounce m-auto text-xl font-semibold">Fetching video data...</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default PopupVideo