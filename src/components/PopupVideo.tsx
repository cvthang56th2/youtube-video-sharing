import { useEffect, useState } from "react";

import { VideoType } from "@/types/Video";
import VideoServices from '@/firebase/video/video'
import { preventEvents } from "@/utils/utils";

interface PropsType {
  isShow: boolean,
  videoId: string,
  close: () => unknown,
}

const PopupVideo = ({ isShow, close, videoId }: PropsType) => {
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
      <div className={["w-screen h-screen fixed inset-0 z-50 overflow-y-auto flex items-center justify-center", isShow ? 'bg-[rgba(0,0,0,0.2)]' : 'pointer-events-none'].join(' ')} onClick={() => close()}>
        <div className={["bg-white w-[95%] h-[95%] lg:w-[80%] lg:h-[80%] p-5 rounded-xl shadow-2xl overflow-y-auto flex flex-col transition-all duration-300 ease-in-out relative", isShow ? 'transform-none' : 'scale-0'].join(' ')} onClick={preventEvents}>
          {isShow && (
            <>
              {videoData ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoData.ytVideoId}?autoplay=1`}
                  className="w-full h-full absolute inset-0 video-iframe"
                  title={videoData.title}
                  allowFullScreen
                  allow="autoplay"
                >
                </iframe>
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