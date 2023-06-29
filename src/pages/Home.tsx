import { useEffect } from 'react'

import VideoServices from '@/firebase/video/video'
import ListVideo from '@/components/ListVideo'
import { VideoType } from '@/types/Video'
import { useDispatch, useSelector } from 'react-redux'
import { selectVideos, setVideos } from '@/store/videoSlice'

const Home = () => {
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
    <>
      <h1 className='text-center'>List Video</h1>
      <ListVideo videos={listVideos} isShowReaction />
    </>
  )
}

export default Home