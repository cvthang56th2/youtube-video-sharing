export const getYoutubeInfoUrl = (videoId: string, apiKey: string) => `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`