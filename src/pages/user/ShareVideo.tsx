import { FormEvent, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSelector } from 'react-redux'

import VideoServices from '@/firebase/video/video'

import { selectCurrentUser } from '@/store/authSlice'
import { getYoutubeInfoUrl } from '@/constants/constants'
import { YoutubeVideo } from '@/types/Video'
import RecommendLogin from '@/components/RecommendLogin';

type YoutubeVideoData = {
  valid: boolean,
  data?: YoutubeVideo
}

const ShareVideo = () => {
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(event.currentTarget.value)
  }

  const getYoutubeData = async (url: string) : Promise<YoutubeVideoData> => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const valid = !!(match && match[7].length === 11)
    if (!valid) {
      return { valid }
    }
    const videoId = match[7]

    const { data } = await axios(getYoutubeInfoUrl(videoId, import.meta.env.VITE_YOUTUBE_API_KEY))
    const video = data?.items[0];
    if (!video?.snippet) {
      return { valid: false }
    }
    const { title, description } = video.snippet;
    return {
      valid: true,
      data: {
        videoId,
        title,
        description,
      }
    }
  }

  const submitVideo = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitted(true)
    try {
      const { valid, data } = await getYoutubeData(youtubeUrl)
      if (!valid || !data) {
        alert('Link video not valid.')
        return
      }
      if (currentUser) {
        await VideoServices.createVideo({
          ...data,
          authorId: currentUser.uid,
          authorEmail: currentUser.email,
          likedBy: [],
          dislikedBy: []
        })
        alert('Success!')
        navigate("/user-shared-video");
      }
    } catch (error) {
      console.log(error)
    }
    setIsSubmitted(false)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-md border-2 p-10">
        <h1>Share a Youtube movie</h1>
        {currentUser ? (
          <form onSubmit={submitVideo}>
            <div className="flex items-center">
              <div className="w-1/3 pr-2">Youtube URL</div>
              <div className="w-2/3">
                <input type="text" value={youtubeUrl} onChange={handleChangeUrl} />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3"></div>
              <div className="w-2/3">
                <button disabled={isSubmitted} className={["btn w-full mt-2 btn-green font-bold", isSubmitted ? 'opacity-50' : ''].join(' ')}>Share</button>
              </div>
            </div>
          </form>
        ) : (
          <RecommendLogin />
        )}
      </div>
    </div>
  )
}

export default ShareVideo