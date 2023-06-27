import { useEffect, useState } from 'react'

import VideoServices from '@/firebase/video/video'
import ListVideo from '@/components/ListVideo'
import { VideoType } from '@/types/Video'

const Home = () => {
  const [listVideos, setListVideos] = useState<VideoType[]>([])
  const snapshotVideos = () => {
    VideoServices.getVideosSnapshot((videos: VideoType[]) => {
      setListVideos(videos)
    })
  }
  useEffect(() => (() => {
    snapshotVideos()
  }), [])
  return (
    <>
      <h1 className='text-center'>List Video</h1>
      <ListVideo videos={listVideos} isShowReaction />
    </>
  )
}

export default Home