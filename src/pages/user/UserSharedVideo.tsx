import { useState, useEffect } from 'react'

import VideoServices from '@/firebase/video/video'

import ListVideo from "@/components/ListVideo"

const UserSharedVideo = () => {
  const [videos, setVideos] = useState([])

  const getListVideo = async () => {
    try {
      const data = await VideoServices.getAllVideos()
      console.log(data)
      setVideos(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => (() => {
    getListVideo()
  }), [])

  return (
    <div>
      <ListVideo videos={videos}></ListVideo>
    </div>
  )
}

export default UserSharedVideo