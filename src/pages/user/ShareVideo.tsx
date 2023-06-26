import { FormEvent, useState } from 'react'
import axios from 'axios'

type YoutubeVideoData = {
  valid: boolean,
  data?: {
    videoId: string
  }
}

const ShareVideo = () => {
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

    // TODO: get youtube title, description, thumbnail,.... and save to db
    return {
      valid,
      data: {
        videoId
      }
    }
  }

  const submitVideo = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitted(true)
    try {
      const data = await getYoutubeData(youtubeUrl)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
    setIsSubmitted(false)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <form className="rounded-md border-2 p-5" onSubmit={submitVideo}>
        <h1>Share a Youtube movie</h1>
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
    </div>
  )
}

export default ShareVideo