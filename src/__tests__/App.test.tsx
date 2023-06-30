
import { expect } from 'vitest'
import { fireEvent, getByText, render, screen } from '@testing-library/react'
import App from '@/App'
import { act } from 'react-dom/test-utils'

const inputValue = (selector: string, text: string) => {
  const input = document.querySelector(selector) as HTMLInputElement | null;
  expect(input).toBeTruthy()
  expect(input?.textContent).toBe('')

  if (input) {
    input.textContent = text
    expect(input.textContent).toBe(text)
    fireEvent.change(input, {
      target: {
        value: text
      }
    })
    expect(input.value).toBe(text)
  }
}
it('Click the about router link', async () => {
  const wrapper = await act( async () => render(<App />));
  expect(screen.getByText('Login / Register')).toBeInTheDocument()
  // expect(screen.getByText('List Video')).toBeInTheDocument()
})
