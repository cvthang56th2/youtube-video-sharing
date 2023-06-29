export type YoutubeVideo = {
  ytVideoId: string,
  title: string,
  description: string,
  thumbnailUrl: string,
}
export type VideoType = YoutubeVideo & {
  id: string,
  authorId: string,
  authorEmail: string,
  likedBy: string[],
  createdAt?: Date,
  dislikedBy: string[]
}