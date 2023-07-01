
import moment from 'moment'
import { QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

import { expect, describe, it, vi } from 'vitest'

import { formatDate, snapshotToArray, preventEvents, toLowerCaseNonAccentVietnamese, getYoutubeInfoUrl } from '@/utils/utils'

describe('formatDate', () => {
  it('should return an empty string if date is falsy', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
    expect(formatDate(0)).toBe('');
    expect(formatDate(false)).toBe('');
  });

  it('should format the date correctly with default format', () => {
    const date = new Date('2023-06-30T12:34:56');
    expect(formatDate(date)).toBe('30/06/2023 12:34');
  });

  it('should format the date correctly with a number', () => {
    expect(formatDate(1688103296000, 'YYYY-MM-DD')).toBe('2023-06-30');
  });
  it('should format the date correctly with custom format', () => {
    const date = new Date('2023-06-30T12:34:56');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-06-30');
    expect(formatDate(date, 'MMM D, YYYY')).toBe('Jun 30, 2023');
    expect(formatDate(date, 'hh:mm A')).toBe('12:34 PM');
  });

  it('should format the date from now if format is "fromNow"', () => {
    const currentDate = moment();
    const futureDate = currentDate.add(1, 'hour').toDate();
    expect(formatDate(futureDate, 'fromNow')).toBe('in an hour');
  });

  it('should convert Firestore Timestamp to Date before formatting', () => {
    expect(formatDate({ seconds: 1625055600, nanoseconds: 1 })).toBe('30/06/2021 07:20');
  });

  it('should return the string representation if date is not a valid Date object', () => {
    expect(formatDate('2023-06-30')).toBe('2023-06-30');
    expect(formatDate({})).toBe('[object Object]');
    expect(formatDate([1, 2, 3])).toBe('1,2,3');
  });
});


describe('snapshotToArray', () => {
  it('should convert a QuerySnapshot to an array of DocumentData', () => {
    const mockData = [
      {
        id: 'doc1',
        data: () => ({ key: 'value1' }),
      },
      {
        id: 'doc2',
        data: () => ({ key: 'value2' }),
      },
    ];
    const mockSnapshot: QuerySnapshot = {
      forEach: (callback: (doc: QueryDocumentSnapshot) => void) => {
        mockData.forEach((doc) => {
          callback({
            ...doc,
            data: () => doc.data(),
          } as unknown as QueryDocumentSnapshot);
        });
      },
    } as QuerySnapshot;
    const result = snapshotToArray(mockSnapshot);
    const expected = [
      { key: 'value1' },
      { key: 'value2' },
    ];
    expect(result).toEqual(expected);
  });

  it('should return an empty array if the input snapshot is empty', () => {
    const result = snapshotToArray(null);
    expect(result).toEqual([]);
  });
});

describe('preventEvents', () => {
  test('preventEvents should prevent default and stop propagation', () => {
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };
  
    preventEvents(event);
  
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });
})

describe('toLowerCaseNonAccentVietnamese', () => {
  it('converts Vietnamese accents to lowercase without accents', () => {
    expect(toLowerCaseNonAccentVietnamese('Tôi Là Người Việt Nam')).toBe('toi la nguoi viet nam');
    expect(toLowerCaseNonAccentVietnamese('Xin Chào Các Bạn')).toBe('xin chao cac ban');
  });
  
  it('handles empty strings', () => {
    expect(toLowerCaseNonAccentVietnamese('')).toBe('');
  });
  
  it('handles strings without Vietnamese accents', () => {
    expect(toLowerCaseNonAccentVietnamese('Hello World')).toBe('hello world');
  });
})

describe('toLowerCaseNonAccentVietnamese', () => {
  it('converts Vietnamese accents to lowercase without accents', () => {
    const ytVideoId = 'your-video-id';
    const apiKey = 'your-api-key';
    const expectedUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ytVideoId}&key=${apiKey}`;

    const actualUrl = getYoutubeInfoUrl(ytVideoId, apiKey);

    expect(actualUrl).toBe(expectedUrl);
  });
})
