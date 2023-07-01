
import { expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import ListVideo from '@/components/ListVideo'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { VideoType } from '@/types/Video'
import { Store, AnyAction } from '@reduxjs/toolkit'

const videos: VideoType[] = [{
  ytVideoId: 'qPBlzC1QkvY',
  title: 'title1',
  description: 'description1',
  thumbnailUrl: 'thumbnailUrl',
  id: 'videoId1',
  authorId: 'userId1',
  authorEmail: 'hello@abc.com',
  likedBy: ['userId1'],
  createdAt: new Date(),
  dislikedBy: ['userId2'],
  isPrivate: true
}, {
  ytVideoId: 'GH6WIgW6A',
  title: 'title2',
  description: 'description2',
  thumbnailUrl: 'thumbnailUrl',
  id: 'videoId2',
  authorId: 'userId1',
  authorEmail: 'hello@abc.com',
  likedBy: ['userId1'],
  createdAt: new Date(),
  dislikedBy: ['userId2'],
  isPrivate: true
}, {
  ytVideoId: '04pDvv3rN0g',
  title: 'title3',
  description: 'description3',
  thumbnailUrl: 'thumbnailUrl',
  id: 'videoId3',
  authorId: 'authorId',
  authorEmail: 'authorEmail',
  likedBy: [],
  createdAt: new Date(),
  dislikedBy: [],
  isPrivate: true
}]
vi.mock('react-router-dom', () => ({
  Link: ({children}: { children: React.ReactNode }) => (<div className='link'>{children}</div>)
}))
vi.mock('react-svg', () => ({
  ReactSVG: () => (<div>icon</div>)
}))
vi.mock('@/firebase/video/video', () => ({
  default: {
    getVideoById: () => (videos[0])
  }
}))
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('ListVideo', () => {
  let store: Store<unknown, AnyAction>

  beforeAll(() => {
    const initialState = {
      auth: {
        currentUser: {
          uid: 'userId1',
          email: 'hello@abc.com'
        },
      },
      notification: {
        notifications: []
      }
    }
    const mockStore = configureStore()
    store = mockStore(initialState)
  })

  it('Should render empty list video', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><ListVideo videos={[]} /></Provider>));

    const videoEls = wrapper.container.querySelectorAll('.video-item')
    expect(videoEls.length).toBe(0)
  })

  it('Should render list video have items, show reaction, hide actions', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><ListVideo videos={videos} /></Provider>));

    const videoEls = wrapper.container.querySelectorAll('.video-item')
    expect(videoEls.length).toBe(videos.length)
    for (const index in videoEls) {
      const el = videoEls[index]
      const videoData = videos[index]
      expect(el.querySelector('h5')?.innerText).toBe(videoData.title)
      expect((el.querySelector('.link') as HTMLElement)?.innerText).toBe(videoData.authorEmail)
      expect(Number((el.querySelector('.count-like') as HTMLElement)?.innerText)).toBe(videoData.likedBy.length)
      expect(Number((el.querySelector('.count-dislike') as HTMLElement)?.innerText)).toBe(videoData.dislikedBy.length)
      expect(el.querySelector('.like-btn')).toBeTruthy()
      expect(el.querySelector('.dislike-btn')).toBeTruthy()
      expect(el.querySelector('.status-badge')).toBeFalsy()
      expect(el.querySelector('.btn-change-status')).toBeFalsy()
    }
  })

  it('Should render list video have items, hide reaction, show actions', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><ListVideo videos={videos} isShowReaction={false} showActions /></Provider>));
    const videoEls = wrapper.container.querySelectorAll('.video-item')
    expect(videoEls.length).toBe(videos.length)
    for (const index in videoEls) {
      const el = videoEls[index]
      const videoData = videos[index]
      expect(el.querySelector('h5')?.innerText).toBe(videoData.title)
      expect((el.querySelector('.link') as HTMLElement)?.innerText).toBe(videoData.authorEmail)
      expect(Number((el.querySelector('.count-like') as HTMLElement)?.innerText)).toBe(videoData.likedBy.length)
      expect(Number((el.querySelector('.count-dislike') as HTMLElement)?.innerText)).toBe(videoData.dislikedBy.length)
      expect(el.querySelector('.like-btn')).toBeFalsy()
      expect(el.querySelector('.dislike-btn')).toBeFalsy()
      expect(el.querySelector('.status-badge')).toBeTruthy()
      expect((el.querySelector('.status-badge') as HTMLElement)?.innerText).toBe(videoData.isPrivate ? 'Private' : 'Public')
      expect(el.querySelector('.btn-change-status')).toBeTruthy()
      expect((el.querySelector('.btn-change-status') as HTMLElement)?.innerText).toBe(videoData.isPrivate ? 'Change To Public' : 'Change To Private')
    }
  })

  it('Should render list of video matched with keyword', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><ListVideo videos={videos} /></Provider>));
    const inputKeyword = wrapper.container.querySelector('.input-search')
    expect(inputKeyword).toBeTruthy()

    fireEvent.change(inputKeyword as HTMLElement, { target: { value: 'title1' } })

    const videoEls = wrapper.container.querySelectorAll('.video-item')
    expect(videoEls.length).toBe(1)
    const el = videoEls[0]
    const videoData = videos[0]
    expect(el.querySelector('h5')?.innerText).toBe(videoData.title)
    expect((el.querySelector('.link') as HTMLElement)?.innerText).toBe(videoData.authorEmail)
    expect(Number((el.querySelector('.count-like') as HTMLElement)?.innerText)).toBe(videoData.likedBy.length)
    expect(Number((el.querySelector('.count-dislike') as HTMLElement)?.innerText)).toBe(videoData.dislikedBy.length)
  })

  it('Should open popup video when click video box', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><ListVideo videos={videos} /></Provider>));

    const videoEls = wrapper.container.querySelectorAll('.video-item')
    const el = videoEls[0]
    const videoData = videos[0]
    const videoBox = el.querySelector('.video-box')
    expect(videoBox).toBeTruthy()
    fireEvent.click(videoBox as HTMLElement)
    await sleep(50)
    const videoIframe = wrapper.container.querySelector('.video-iframe')
    expect(videoIframe).toBeTruthy()
    expect(videoIframe?.getAttribute('src')).toBe(`https://www.youtube.com/embed/${videoData.ytVideoId}?autoplay=1`)
    const closeBtn = wrapper.container.querySelector('.close-btn')
    expect(closeBtn).toBeTruthy()
    fireEvent.click(closeBtn as HTMLElement)
  })
})
