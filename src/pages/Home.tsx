import { useEffect, useMemo } from 'react'

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

  const publicVideos = useMemo(() => listVideos.filter((video: VideoType) => !video.isPrivate), [listVideos])

  return (
    <>
      <h1 className='text-center'>List Video</h1>
      <ListVideo videos={publicVideos} isShowReaction />
    </>
  )
}

export default Home