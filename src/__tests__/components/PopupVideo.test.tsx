
import { expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PopupVideo from '@/components/PopupVideo'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import { Store, AnyAction } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const videoData = {
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
}
vi.mock('@/firebase/video/video', () => ({
  default: {
    getVideoById: () => videoData,
    updateVideo: vi.fn()
  }
}))

vi.mock('react-router-dom', () => ({
  Link: ({children}: { children: React.ReactNode }) => (<div className='link'>{children}</div>)
}))
vi.mock('react-svg', () => ({
  ReactSVG: () => (<div>icon</div>)
}))

describe('PopupVideo', () => {
  let store: Store<unknown, AnyAction>

  beforeAll(() => {
    const initialState = {
      auth: {
        currentUser: {
          uid: 'userId2',
          email: 'user02@abc.com'
        },
      },
      notification: {
        notifications: []
      }
    }
    const mockStore = configureStore()
    store = mockStore(initialState)
  })

  beforeEach(() => {
    window.alert = vi.fn()
  })
  it('Should render invisible popup', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<Provider store={store}><PopupVideo isShow={false} videoId={'videoId'} isShowReaction={true} close={mockClose} /></Provider>));

    const contentPopup = wrapper.container.querySelector('.content-popup')?.innerHTML
    expect(contentPopup).toBeFalsy()
  })
  it('Should show message can not access cus video is private and user is not author', async () => {
    const mockClose = vi.fn()
    await act( async () => render(<Provider store={store}><PopupVideo isShow={true} videoId={'videoId'} isShowReaction={true} close={mockClose} /></Provider>));
    expect(screen.getByText(`Can't watch this video. This video is Private.`)).toBeInTheDocument()
  })
  it('Should show alert if api getVideoById throw error', async () => {
    const mockClose = vi.fn()
    const mockVideoServices = await import('@/firebase/video/video')
    const mError = new Error('Unable to retrieve rows')
    mockVideoServices.default.getVideoById = vi.fn().mockRejectedValueOnce(mError)
    await act( async () => render(<Provider store={store}><PopupVideo isShow={true} videoId={'videoId'} isShowReaction={true} close={mockClose} /></Provider>));
  })
  it('Should call to close function when user press Escape button', async () => {
    const mockClose = vi.fn()
    await act( async () => render(<Provider store={store}><PopupVideo isShow={true} videoId={'videoId'} isShowReaction={true} close={mockClose} /></Provider>));
    fireEvent.keyDown(document, { key: 'Escape' })
    await sleep(50)
    expect(mockClose).toBeCalled()
  })
})
