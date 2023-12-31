import {
  setDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  collection,
  onSnapshot,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config';
import { uid } from 'uid';
import { snapshotToArray } from '@/utils/utils';
import { VideoType } from '@/types/Video';

const VIDEO = 'videos';

class VideoServices {
  private unsubscribeVideos: (() => void) | undefined;

  createVideo(data: VideoType) {
    return new Promise<string>((resolve, reject) => {
      try {
        const id = data.id || uid(8);
        const today = new Date();
        const ref = doc(db, VIDEO, id);
        data.id = id;
        setDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        });
        resolve(id)
      } catch (err) {
        console.error('error create video', err);
        reject(err);
      }
    });
  }

  updateVideo(videoId: string, data: {[key: string]: unknown}) {
    return new Promise<void>((resolve, reject) => {
      try {
        const today = new Date();
        const ref = doc(db, VIDEO, videoId);
        resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }));
      } catch (err) {
        console.error('error update video', err);
        reject(err);
      }
    });
  }

  deleteVideo(videoId: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        const ref = doc(db, VIDEO, videoId);
        resolve(deleteDoc(ref));
      } catch (err) {
        console.error('error delete video', err);
        reject(err);
      }
    });
  }

  async getVideoById(id: string) {
    try {
      const videoRef = doc(db, VIDEO, id);
      const docSnap = await getDoc(videoRef);
      if (docSnap.exists()) {
        return docSnap.data() as VideoType;
      }
      return null;
    } catch (error) {
      console.log('error', error);
    }
    return null
  }

  async getAllVideos(queryOptions?: { authorId?: string }): Promise<VideoType[]> {
    try {
      let q = query(collection(db, VIDEO), orderBy("createdAt", 'desc'))
      if (queryOptions?.authorId) {
        q = query(q, where("authorId", "==", queryOptions.authorId))
      }
      const querySnapshot = await getDocs(q);
      return snapshotToArray(querySnapshot) as VideoType[];
    } catch (error) {
      console.log('error', error);
    }
    return []
  }

  getVideosSnapshot(callback: (videos: VideoType[]) => void) {
    const q = query(collection(db, VIDEO), orderBy("createdAt", 'desc'));
    this.unsubscribeVideosSnapshot()
    this.unsubscribeVideos = onSnapshot(q, (querySnapshot) => {
      if (typeof callback === 'function') {
        callback(snapshotToArray(querySnapshot) as VideoType[]);
      }
    });
  }

  isWatchingChanges () {
    return !!(this.unsubscribeVideos)
  }

  unsubscribeVideosSnapshot () {
    if (this.isWatchingChanges() && this.unsubscribeVideos) {
      this.unsubscribeVideos();
    }
  }
}

export default new VideoServices();
