import { QuerySnapshot } from 'firebase/firestore';

export const snapshotToArray = (snapshot: QuerySnapshot) => {
  const data: unknown[] = [];
  if (snapshot) {
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
  }
  return data;
};
