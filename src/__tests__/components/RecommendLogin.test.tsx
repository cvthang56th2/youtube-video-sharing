
import { expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import RecommendLogin from '@/components/RecommendLogin'
import { act } from 'react-dom/test-utils'

vi.mock('@/firebase/auth/auth', () => ({
  default: {
    loginWithEmail: vi.fn(),
    register: vi.fn(),
  }
}))

describe('RecommendLogin', () => {
  it('Should render correctly', async () => {
    const wrapper = await act( async () => render(<RecommendLogin />));
    expect(screen.getByText('You are not currently logged in. Please log in to perform this action.')).toBeInTheDocument()
    expect(screen.getByText('Login / Register')).toBeInTheDocument()
  })
})
