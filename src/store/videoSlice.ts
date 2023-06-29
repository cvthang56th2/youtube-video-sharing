import { VideoType } from '@/types/Video';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoState {
  videos: VideoType[];
}

const initialState: VideoState = {
  videos: [],
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<VideoType[]>) => {
      state.videos = action.payload;
    },
  },
});

export const { setVideos } = videoSlice.actions;

export const selectVideos = (state: { video: VideoState }) =>
  state.video.videos;

export default videoSlice.reducer;