
import { expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import DialogNotifications from '@/components/DialogNotifications'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Store, AnyAction } from '@reduxjs/toolkit'
import { NotificationType } from '@/types/Notification'

const notifications: NotificationType[] = [
  {
    id: 'notiId1',
    videoId: 'videoId1',
    ytVideoId: 'qPBlzC1QkvY',
    videoTitle: 'title1',
    videoThumbnailUrl: 'thumbnailUrl',
    authorId: 'userId1',
    authorEmail: 'hello@abc.com',
    createdAt: new Date(),
    notSeenUsers: ['userId1'],
    seenBy: [],
    isArchived: true
  }
]
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

vi.mock('@/firebase/notification/notification', () => ({
  default: {
    updateNotification: vi.fn()
  }
}))
vi.mock('react-router-dom', () => ({
  Link: ({children}: { children: React.ReactNode }) => (<div className='link'>{children}</div>)
}))
vi.mock('react-svg', () => ({
  ReactSVG: () => (<div>icon</div>)
}))
vi.mock('@/firebase/video/video', () => ({
  default: {
    getVideoById: () => (videoData)
  }
}))
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('DialogNotifications', () => {
  let store: Store<unknown, AnyAction>
  const mockClose = vi.fn()

  beforeAll(() => {
    const initialState = {
      auth: {
        currentUser: {
          uid: 'userId1',
          email: 'hello@abc.com'
        },
      },
      notification: {
        notifications
      }
    }
    const mockStore = configureStore()
    store = mockStore(initialState)
  })

  it('Should render empty notifications', async () => {
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
    const storeEmptyNotifications = mockStore(initialState)
    const wrapper = await act( async () => render(<Provider store={storeEmptyNotifications}><DialogNotifications close={mockClose} /></Provider>));

    const notificationEls = wrapper.container.querySelectorAll('.notification-item')
    expect(notificationEls.length).toBe(0)
    expect(screen.getByText('No notifications.')).toBeInTheDocument()
  })

  it('Should render list notification have items', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><DialogNotifications close={mockClose} /></Provider>));

    const notificationEls = wrapper.container.querySelectorAll('.notification-item')
    expect(notificationEls.length).toBe(notifications.length)
    for (const index in notificationEls) {
      const el = notificationEls[index]
      const notificationData = notifications[index]
      expect((el.querySelector('.video-title') as HTMLElement)?.innerText).toBe(notificationData.videoTitle)
      expect((el.querySelector('.author-email') as HTMLElement)?.innerText).toBe(notificationData.authorEmail)
    }
  })

  it('Should open popup video when click Watch now button', async () => {
    const wrapper = await act( async () => render(<Provider store={store}><DialogNotifications close={mockClose} /></Provider>));

    const notificationEls = wrapper.container.querySelectorAll('.notification-item')
    const el = notificationEls[0]
    const watchNowButton = el.querySelector('.watch-now-btn')
    expect(watchNowButton).toBeTruthy()
    fireEvent.click(watchNowButton as HTMLElement)
    await sleep(50)
    const videoIframe = wrapper.container.querySelector('.video-iframe')
    expect(videoIframe).toBeTruthy()
    expect(videoIframe?.getAttribute('src')).toBe(`https://www.youtube.com/embed/${videoData.ytVideoId}?autoplay=1`)
    const closeBtn = wrapper.container.querySelector('.close-btn')
    expect(closeBtn).toBeTruthy()
    fireEvent.click(closeBtn as HTMLElement)
  })
  it('Should call update notification function when click Checked button', async () => {
    // we are firestore snapshot for notifications => just need to call update data (add uid to seenBy of notification), when data is updated => notification will disappear.
    const wrapper = await act( async () => render(<Provider store={store}><DialogNotifications close={mockClose} /></Provider>));

    const notificationEls = wrapper.container.querySelectorAll('.notification-item')
    const el = notificationEls[0]
    const checkButton = el.querySelector('.check-btn')
    expect(checkButton).toBeTruthy()
    fireEvent.click(checkButton as HTMLElement)
    const mockNotificationServices = await import('@/firebase/notification/notification')
    expect(mockNotificationServices.default.updateNotification).toBeCalled()
  })
  it('Should not call update notification function when click Checked button and notification not have field id or current user null', async () => {
    const initialState = {
      auth: {
        currentUser: null,
      },
      notification: {
        notifications: [{
          ...notifications[0],
          id: null
        }]
      }
    }
    const mockStore = configureStore()
    const newStore = mockStore(initialState)
    const wrapper = await act( async () => render(<Provider store={newStore}><DialogNotifications close={mockClose} /></Provider>));

    const notificationEls = wrapper.container.querySelectorAll('.notification-item')
    const el = notificationEls[0]
    const checkButton = el.querySelector('.check-btn')
    expect(checkButton).toBeTruthy()
    fireEvent.click(checkButton as HTMLElement)
    const mockNotificationServices = await import('@/firebase/notification/notification')
    expect(mockNotificationServices.default.updateNotification).toBeCalled()
  })
})
