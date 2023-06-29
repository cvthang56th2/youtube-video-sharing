import { useEffect } from 'react'

import VideoServices from '@/firebase/video/video'

import ListVideo from "@/components/ListVideo"
import { VideoType } from '@/types/Video'
import { selectCurrentUser } from '@/store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import RecommendLogin from '@/components/RecommendLogin'
import { selectVideos, setVideos } from '@/store/videoSlice'

const UserSharedVideo = () => {
  const currentUser = useSelector(selectCurrentUser)
  const listVideos = useSelector(selectVideos)
  const dispatch = useDispatch()
  const snapshotVideos = () => {
    if (VideoServices.isWatchingChanges()) return
    VideoServices.getVideosSnapshot((videos: VideoType[]) => {
      dispatch(setVideos(videos))
    })
  }
  useEffect(() => {
    snapshotVideos()
  }, [])

  return (
    <div>
      <div className='text-center'>
        <h2 className='!mt-0'>User Shared Video</h2>
      </div>
      <div className='relative'>
        {currentUser ? (
          <ListVideo videos={listVideos.filter((video: VideoType) => video.authorId === currentUser.uid)} isShowReaction={false}></ListVideo>
        ) :  (
          <RecommendLogin />
        )}
      </div>
    </div>
  )
}

export default UserSharedVideo