export type YoutubeVideo = {
  videoId: string,
  title: string,
  description: string,
}
export type VideoType = YoutubeVideo & {
  id?: string,
  authorId: string,
  authorEmail: string,
  likedBy: string[],
  dislikedBy: string[],
}