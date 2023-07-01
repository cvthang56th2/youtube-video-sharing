import moment from 'moment'
import { QuerySnapshot, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';

export const snapshotToArray = (snapshot: QuerySnapshot<DocumentData> | null): DocumentData[] => {
  const data: DocumentData[] = [];
  if (snapshot) {
    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      data.push(doc.data());
    });
  }
  return data;
};


export const formatDate = (date: any, format = 'DD/MM/YYYY hh:mm'): string => {
  if (!date) {
    return '';
  }

  if (date.seconds && date.nanoseconds) {
    date = new Timestamp(date.seconds , date.nanoseconds).toDate();
  }

  if (typeof date === 'number') {
    date = new Date(date);
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    const momentDate = moment(date)
    if (format === 'fromNow') {
      return momentDate.fromNow();
    }
    return momentDate.format(format);
  }

  return String(date);
};

export const preventEvents = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
  event.preventDefault()
  event.stopPropagation()
}

export const toLowerCaseNonAccentVietnamese = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const getYoutubeInfoUrl = (ytVideoId: string, apiKey: string) => `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ytVideoId}&key=${apiKey}`