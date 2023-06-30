
import { expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LayoutDefault from '@/layouts/Default'
import { act } from 'react-dom/test-utils'

vi.mock('@/firebase/auth/auth', () => ({
  default: {
    onAuthStateChanged: (cb: unknown) => {
      if (typeof cb === 'function') {
        cb()
      }
    }
  }
}))
vi.mock('react-redux', () => ({
  useDispatch: vi.fn()
}))
vi.mock('@/layouts/partials/Header', () => ({
  default: () => (<div>Mocked Header</div>)
}))
vi.mock('@/layouts/partials/Footer', () => ({
  default: () => (<div>Mocked Footer</div>)
}))

describe('LayoutDefault', () => {
  it('Should render layout perfectly', async () => {
    const mockReactRedux = await import('react-redux')
    await act( async () => render(<LayoutDefault>Main content</LayoutDefault>));
    expect(screen.getByText('Mocked Header')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument()
    expect(mockReactRedux.useDispatch).toHaveBeenCalled()
  })
})
