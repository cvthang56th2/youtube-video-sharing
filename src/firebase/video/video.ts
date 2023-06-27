import {
  setDoc,
  getDocs,
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

const VIDEO = 'videos';

class VideoServices {
  private unsubscribeVideos: (() => void) | undefined;

  createVideo(data: any) {
    return new Promise<void>((resolve, reject) => {
      try {
        const id = data.id || uid(8);
        const today = new Date();
        const ref = doc(db, VIDEO, id);
        data.id = id;
        resolve(setDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        }));
      } catch (err) {
        console.error('error create video', err);
        reject(err);
      }
    });
  }

  updateVideo(videoId: string, data: any) {
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

  async getAllVideos(options: any = {}) {
    try {
      const q = query(collection(db, VIDEO), orderBy("pid"));
      const querySnapshot = await getDocs(q);
      return snapshotToArray(querySnapshot);
    } catch (error) {
      console.log('error', error);
    }
  }

  getVideosSnapshot(callback: (videos: any[]) => void, { status }: { status?: string }) {
    let q;
    if (status) {
      q = query(collection(db, VIDEO), orderBy("createdAt", 'desc'), where("status", "==", status));
    } else {
      q = query(collection(db, VIDEO), orderBy("createdAt", 'desc'));
    }
    if (typeof this.unsubscribeVideos === 'function') {
      this.unsubscribeVideos();
    }
    this.unsubscribeVideos = onSnapshot(q, (querySnapshot) => {
      if (typeof callback === 'function') {
        callback(snapshotToArray(querySnapshot));
      }
    });
  }
}

export default new VideoServices();
