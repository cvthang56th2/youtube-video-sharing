
import { expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'
import { act } from 'react-dom/test-utils'

it('Click the about router link', async () => {
  await act( async () => render(<App />));
  expect(screen.getByText('Login / Register')).toBeInTheDocument()
})
