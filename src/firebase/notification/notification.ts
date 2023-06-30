import {
  setDoc,
  getDocs,
  doc,
  query,
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
import { NotificationType } from '@/types/Notification';

const NOTIFICATION = 'notifications';

class NotificationServices {
  private unsubscribeNotifications: (() => void) | undefined;

  createNotification(data: NotificationType) {
    return new Promise<void>((resolve, reject) => {
      try {
        const id = uid(8);
        const today = new Date();
        const ref = doc(db, NOTIFICATION, id);
        resolve(setDoc(ref, {
          id,
          updatedAt: Timestamp.fromDate(today),
          createdAt: Timestamp.fromDate(today),
          ...data
        }));
      } catch (err) {
        console.error('error create notification', err);
        reject(err);
      }
    });
  }

  updateNotification(notificationId: string, data: {[key: string]: unknown}) {
    return new Promise<void>((resolve, reject) => {
      try {
        const today = new Date();
        const ref = doc(db, NOTIFICATION, notificationId);
        resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }));
      } catch (err) {
        console.error('error update notification', err);
        reject(err);
      }
    });
  }

  async updateVideoNotification(videoId: string, data: {[key: string]: unknown}) {
    const q = query(collection(db, NOTIFICATION),where('videoId', '==', videoId))
    const querySnapshot = await getDocs(q);
    const notification = snapshotToArray(querySnapshot)[0];
    if (!notification) {
      return
    }
    return new Promise<void>((resolve, reject) => {
      try {
        const today = new Date();
        const ref = doc(db, NOTIFICATION, notification.id);
        resolve(updateDoc(ref, {
          updatedAt: Timestamp.fromDate(today),
          ...data
        }));
      } catch (err) {
        console.error('error update notification', err);
        reject(err);
      }
    });
  }

  deleteNotification(notificationId: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        const ref = doc(db, NOTIFICATION, notificationId);
        resolve(deleteDoc(ref));
      } catch (err) {
        console.error('error delete notification', err);
        reject(err);
      }
    });
  }

  getUserNotificationsSnapshot(userId: string, callback: (notifications: NotificationType[]) => void) {
    const q = query(collection(db, NOTIFICATION), where('authorId', '!=', userId), where('notSeenUsers', 'array-contains', userId));
    this.unsubscribeUserNotificationSnapshot()
    this.unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
      if (typeof callback === 'function') {
        const notifications = (snapshotToArray(querySnapshot) as NotificationType[]).filter((notification: NotificationType) => !notification.isArchived)
        callback(notifications);
      }
    });
  }

  unsubscribeUserNotificationSnapshot () {
    if (typeof this.unsubscribeNotifications === 'function') {
      this.unsubscribeNotifications();
    }
  }
}

export default new NotificationServices();
