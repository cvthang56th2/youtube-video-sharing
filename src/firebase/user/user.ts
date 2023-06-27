import {
  setDoc,
  doc,
  Timestamp,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
  query,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../config';
import { snapshotToArray } from '@/utils/utils';
import { UserType } from '@/types/User';

const USERS = 'users';

class UserServices {
  private unsubscribeUsers: (() => void) | undefined;

  get(id: string) {
    try {
      return getDoc(doc(db, USERS, id));
    } catch (error) {
      console.log('error', error);
    }
  }

  create(id: string, data: UserType) {
    try {
      const today = new Date();
      return setDoc(doc(db, USERS, id), {
        updatedAt: Timestamp.fromDate(today),
        createdAt: Timestamp.fromDate(today),
        ...data,
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  snapshotUsers(callback: (users: unknown[]) => void) {
    const q = query(collection(db, 'users'));
    if (typeof this.unsubscribeUsers === 'function') {
      this.unsubscribeUsers();
    }
    this.unsubscribeUsers = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      if (typeof callback === 'function') {
        callback(snapshotToArray(querySnapshot));
      }
    });
  }

  async getAllUsers() {
    try {
      const loadConfig = query(collection(db, 'users'));
      const querySnapshot = await getDocs(loadConfig);
      return snapshotToArray(querySnapshot);
    } catch (error) {
      console.log('getAllUsers ==> error: ', error);
    }
  }

  async getUserById(id: string) {
    try {
      const userRef = doc(db, USERS, id);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.log('error', error);
    }
  }

  async getUsersInfo(datas: string[]) {
    try {
      const infos = await Promise.all(datas.map((uid) => {
        return this.getUserById(uid);
      }));
      return infos;
    } catch (error) {
      console.log('getUsersInfo', error);
    }
  }

  update(id: string, data: {[key: string]: unknown} = {}) {
    try {
      return setDoc(
        doc(db, USERS, id),
        {
          ...data,
          updatedAt: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default new UserServices();
