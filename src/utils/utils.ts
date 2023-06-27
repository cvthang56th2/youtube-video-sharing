import { QuerySnapshot } from 'firebase/firestore';

export const snapshotToArray = (snapshot: QuerySnapshot): any => {
  const data: unknown[] = [];
  if (snapshot) {
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
  }
  return data;
};
