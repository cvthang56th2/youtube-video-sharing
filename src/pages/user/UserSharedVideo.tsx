import { useState, useEffect } from 'react'

import VideoServices from '@/firebase/video/video'

import ListVideo from "@/components/ListVideo"
import { VideoType } from '@/types/Video'
import { selectCurrentUser } from '@/store/authSlice'
import { useSelector } from 'react-redux'
import RecommendLogin from '@/components/RecommendLogin'

const UserSharedVideo = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [videos, setVideos] = useState<VideoType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getListVideo = async () => {
    setIsLoading(true)
    try {
      if (currentUser) {
        const data = await VideoServices.getAllVideos({ authorId: currentUser.uid })
        setVideos(data)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => (() => {
    getListVideo()
  }), [])

  return (
    <div>
      <div className='text-center'>
        <h2 className='!mt-0'>User Shared Video</h2>
        <button className='btn btn-blue' onClick={() => getListVideo()}>Refresh</button>
        {isLoading && (
          <div className="text-center text-base font-semibold mt-4 animate-bounce">Fetching user shared video ...</div>
        )}
      </div>
      <div className='relative'>
        {currentUser ? (
          <ListVideo videos={videos} isShowReaction={false}></ListVideo>
        ) :  (
          <RecommendLogin />
        )}
      </div>
    </div>
  )
}

export default UserSharedVideo