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

  const getListVideo = async () => {
    try {
      if (currentUser) {
        const data = await VideoServices.getAllVideos({ authorId: currentUser.uid })
        setVideos(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => (() => {
    getListVideo()
  }), [])

  return (
    <div>
      <h2 className='text-center !mt-0'>User Shared Video</h2>
      {currentUser && (
        <ListVideo videos={videos} isShowReaction={false}></ListVideo>
      )}
      {!currentUser && (
        <RecommendLogin />
      )}
    </div>
  )
}

export default UserSharedVideo