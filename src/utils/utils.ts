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

export function isElementScrolledIntoView(container: HTMLElement, element: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom
  );
}