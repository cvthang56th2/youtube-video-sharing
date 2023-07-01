
import { expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Header from '@/layouts/partials/Header'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

vi.mock('react-router-dom', () => ({
  Link: ({children}: { children: React.ReactNode }) => (<div>{children}</div>)
}))
vi.mock('@/components/Confirm', () => ({
  default: () => (<div>Confirm</div>)
}))
vi.mock('@/components/DialogNotifications', () => ({
  default: () => (<div>DialogNotifications</div>)
}))
vi.mock('@/firebase/notification/notification', () => ({
  default: {
    unsubscribeUserNotificationSnapshot: vi.fn(),
    getUserNotificationsSnapshot: vi.fn(),
  }
}))
vi.mock('@/firebase/auth/auth', () => ({
  default: {
    logout: vi.fn(),
  }
}))

describe('Header', () => {
  it('Should show login/register button when user not logged', async () => {
    const initialState = {
      auth: {
        currentUser: null,
      },
      notification: {
        notifications: []
      }
    }
    const mockStore = configureStore()
    const store = mockStore(initialState)
    const wrapper = await act( async () => render(<Provider store={store}><Header /></Provider>));

    expect(screen.getByText(`Login / Register`)).toBeInTheDocument()
    fireEvent.click(screen.getByText(`Login / Register`))
    expect(wrapper.container.querySelector('.text-2xl')?.innerText).toBe('Login')
  })
  it('Should show welcome user when user logged', async () => {
    const initialState = {
      auth: {
        currentUser: {
          email: 'hello@abc.com'
        },
      },
      notification: {
        notifications: []
      }
    }
    const mockStore = configureStore()
    const store = mockStore(initialState)
    await act( async () => render(<Provider store={store}><Header /></Provider>));

    expect(screen.getByText(`Welcome: ${initialState.auth.currentUser.email}`)).toBeInTheDocument()
    
  })
})
