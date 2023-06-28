export type NotificationType = {
  id?: string,
  videoId: string,
  ytVideoId: string,
  videoTitle: string,
  videoThumbnailUrl: string,
  authorId: string,
  authorEmail: string,
  createdAt?: Date,
  notSeenUsers: string[],
  seenBy: string[]
}