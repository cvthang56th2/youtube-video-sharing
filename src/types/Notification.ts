export type NotificationType = {
  videoId: string,
  ytVideoId: string,
  videoTitle: string,
  authorId: string,
  authorEmail: string,
  createdAt?: Date,
  seenBy: string[]
}