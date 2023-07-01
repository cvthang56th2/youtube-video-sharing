import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import VideoServices from '@/firebase/video/video'

import UserServices from '@/firebase/user/user'

import { VideoType } from '@/types/Video'
import { UserType } from '@/types/User'
import { selectVideos, setVideos } from '@/store/videoSlice'
import { selectCurrentUser } from '@/store/authSlice'

import ListVideo from "@/components/ListVideo"

const UserSharedVideo = () => {
  const currentUser = useSelector(selectCurrentUser)
  const { userId } = useParams()
  const [userData, setUserData] = useState<UserType | null>(null)
  const listVideos = useSelector(selectVideos)
  const dispatch = useDispatch()
  const snapshotVideos = () => {
    if (VideoServices.isWatchingChanges()) {
      return
    }
    VideoServices.getVideosSnapshot((videos: VideoType[]) => {
      dispatch(setVideos(videos))
    })
  }
  const getUserData = async () => {
    try {
      const data = await UserServices.getUserById(userId || '')
      setUserData(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUserData()
  }, [userId])
  useEffect(() => {
    snapshotVideos()
  }, [])
  const userVideos = useMemo(() => listVideos.filter((video: VideoType) => {
    if (video.isPrivate && currentUser?.uid !== video.authorId) {
      return false
    }
    return video.authorId === userId
  }), [userId, listVideos, currentUser])

  return (
    <div>
      <div className='text-center'>
        <h2 className='!m-0'>User Shared Video</h2>
        {userData && (
          <h3 className='!mt-0 !mb-4'>{userData.email}</h3>
        )}
      </div>
      <div className='relative'>
        {userData ? (
          <ListVideo videos={userVideos} isShowReaction={currentUser?.uid !== userId} showActions={currentUser?.uid === userId}></ListVideo>
        ) : (
          <div className='text-center'>User not found.</div>
        )}
      </div>
    </div>
  )
}

export default UserSharedVideo