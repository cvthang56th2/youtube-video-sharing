export type YoutubeVideo = {
  videoId: string,
  title: string,
  description: string,
  thumbnails: {
    default: {
      url: string,
      width: number,
      height: number
    }
    high?: {
      url: string,
      width: number,
      height: number
    }
    maxres?: {
      url: string,
      width: number,
      height: number
    }
    medium?: {
      url: string,
      width: number,
      height: number
    }
    standard: {
      url: string,
      width: number,
      height: number
    }
  },
}
export type VideoType = YoutubeVideo & {
  id?: string,
  authorId: string,
  authorEmail: string,
  like?: number,
  dislike?: number,
}