import moment from 'moment'
import { QuerySnapshot, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';

export const snapshotToArray = (snapshot: QuerySnapshot<DocumentData>): DocumentData[] => {
  const data: DocumentData[] = [];
  if (snapshot) {
    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      data.push(doc.data());
    });
  }
  return data;
};


export const formatDate = (date: Date | Timestamp | number | string | undefined, format = 'DD/MM/YYYY hh:mm'): string => {
  if (!date) {
    return '';
  }

  if (date instanceof Timestamp) {
    date = date.toDate();
  }

  if (typeof date === 'number') {
    date = new Date(date);
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    return moment(date).format(format);
  }

  return String(date);
};

export const preventEvents = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
  event.preventDefault()
  event.stopPropagation()
}