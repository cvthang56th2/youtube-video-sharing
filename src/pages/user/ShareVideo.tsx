import { FormEvent, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSelector } from 'react-redux'

import VideoServices from '@/firebase/video/video'
import UserServices from '@/firebase/user/user'
import NotificationServices from '@/firebase/notification/notification'

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
    let ytVideoId
    const shortsRegExp = /^.*((youtu.be\/shorts\/)|(youtube.com\/shorts\/)|(youtube.com\/[^/]+\/video\/)|(youtu.be\/[^/]+\/video\/))\??v?=?([^#&?]*).*/;
    const shortsMatch = url.match(shortsRegExp);
    if (shortsMatch && shortsMatch[6].length == 11) {
      ytVideoId = shortsMatch[6]
    } else {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      ytVideoId = match && match[7].length === 11 && match[7]
    }
    if (!ytVideoId) {
      return { valid: false }
    }

    const { data } = await axios(getYoutubeInfoUrl(ytVideoId, import.meta.env.VITE_YOUTUBE_API_KEY))
    const video = data?.items[0];
    if (!video?.snippet) {
      return { valid: false }
    }
    const { title, description, thumbnails } = video.snippet;
    return {
      valid: true,
      data: {
        ytVideoId,
        title,
        description,
        thumbnailUrl: thumbnails?.standard?.url || ''
      }
    }
  }

  const submitVideo = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitted(true)
    try {
      const { valid, data } = await getYoutubeData(youtubeUrl)
      if (valid && data && currentUser) {
        const newVideoId = await VideoServices.createVideo({
          ...data,
          authorId: currentUser.uid,
          authorEmail: currentUser.email,
          likedBy: [],
          dislikedBy: [],
          id: ''
        })
        const allUsers = await UserServices.getAllUsers({ excludeUid: currentUser.uid })
        await NotificationServices.createNotification({
          videoId: newVideoId || '',
          ytVideoId: data.ytVideoId,
          videoThumbnailUrl: data.thumbnailUrl,
          videoTitle: data.title,
          authorId: currentUser.uid,
          authorEmail: currentUser.email,
          notSeenUsers: allUsers.map(({ uid }) => String(uid || '')),
          seenBy: []
        })
        alert('Success!')
        navigate(`/user-shared-video/${currentUser.uid}`);
      } else {
        alert('Link video not valid.')
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