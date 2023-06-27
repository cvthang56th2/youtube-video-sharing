import { VideoType } from "@/types/Video"
import { isElementScrolledIntoView } from "@/utils/utils"
import { useEffect } from "react"
import { selectCurrentUser } from '@/store/authSlice'
import { useSelector } from 'react-redux'
import VideoServices from '@/firebase/video/video'

type PropsType = {
  videos: VideoType[],
  isShowReaction?: boolean
}

const ListVideo = ({ videos, isShowReaction }: PropsType) => {
  const currentUser = useSelector(selectCurrentUser)

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
  }, [videos])

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
                <button onClick={() => reaction(videoObj, 'like')} className={["btn font-bold border-2 rounded-sm hover:scale-125", checkIsLiked(videoObj) ? 'text-white bg-blue-600 scale-125' : 'text-blue-600 hover:text-white hover:bg-blue-600'].join(' ')}>Like</button>
                <button onClick={() => reaction(videoObj, 'dislike')} className={["btn font-bold border-2 rounded-sm hover:scale-125 ml-4", checkIsDisLiked(videoObj) ? 'text-white bg-gray-600 scale-125' : 'text-gray-600 hover:text-white hover:bg-gray-600'].join(' ')}>DisLike</button>
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