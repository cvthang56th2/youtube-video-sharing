import { VideoType } from "@/types/Video"
import { isElementScrolledIntoView } from "@/utils/utils"
import { useEffect } from "react"

type PropsType = {
  videos: VideoType[],
  isShowReaction?: boolean
}

const ListVideo = ({ videos, isShowReaction }: PropsType) => {
  const lazyLoadIframe = () => {
    const mainEl = document.querySelector('main') as HTMLElement
    for (const iframe of document.querySelectorAll('iframe.video-iframe')) {
      const dataSrc = iframe.getAttribute('data-src')
      if (dataSrc && !iframe.getAttribute('src') && isElementScrolledIntoView(mainEl, iframe as HTMLElement)) {
        iframe.setAttribute('src', dataSrc)
      }
    }
  }
  useEffect(() => {
    lazyLoadIframe()
    const mainEl = document.querySelector('main') as HTMLElement
    mainEl.addEventListener('scroll', lazyLoadIframe)
    return () => {
      mainEl.removeEventListener('scroll', lazyLoadIframe)
    }
  })
  return (
    <>
      {videos.map((videoObj, vIndex) => (
        <div className='flex flex-wrap -mx-4 mb-7 last:mb-0 py-2' key={`video-${vIndex}`}>
          <div className='w-full lg:w-5/12 px-4'>
            <div className="w-full h-[200px] md:h-[400px] lg:h-[350px] bg-gray-200 relative group cursor-pointer">
              <iframe
                data-src={`https://www.youtube.com/embed/${videoObj.videoId}`}
                className="w-full h-full absolute inset-0 z-1 video-iframe"
                allowFullScreen
              >
              </iframe>
            </div>
          </div>
          <div className='w-full pt-2 lg:pt-0 lg:w-7/12 px-4'>
            <h5 className="font-bold">{ videoObj.title }</h5>
            <div>Shared by: { videoObj.authorEmail }</div>
            {isShowReaction && (
              <div className="flex items-center">
                <button className="btn font-bold border-2 rounded-sm text-blue-600 hover:text-white hover:bg-blue-600">Like</button>
                <button className="btn font-bold border-2 rounded-sm text-gray-600 hover:text-white hover:bg-gray-600 ml-4">DisLike</button>
              </div>
            )}
            <div className="flex">
              <span>Like: { videoObj.likedBy?.length || 0 }</span>
              <span className="mx-4">-</span>
              <span>Dislike: { videoObj.dislikedBy?.length || 0 }</span>
            </div>
            <div>Description:</div>
            <div>{ videoObj.description }</div>
          </div>
        </div>
      ))}
    </>
  )
}

export default ListVideo