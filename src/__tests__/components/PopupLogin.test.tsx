
import { expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PopupLogin from '@/components/PopupLogin'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Store, AnyAction } from '@reduxjs/toolkit'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
vi.mock('@/firebase/auth/auth', () => ({
  default: {
    loginWithEmail: vi.fn(),
    register: vi.fn(),
  }
}))

const formLogin = {
  email: 'hello@abc.com',
  password: 'Passw0rd!'
}
const formRegister = {
  ...formLogin,
  userName: 'Test user',
  rePassword: formLogin.password,
}

describe('PopupLogin', () => {
  beforeEach(() => {
    window.alert = vi.fn()
  })
  it('Should render invisible popup', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={false} close={mockClose} />));

    const contentPopup = wrapper.container.querySelector('.content-popup')?.innerHTML
    expect(contentPopup).toBeFalsy()
  })
  it('Should render visible popup login and login form', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={true} close={mockClose} />));
    const contentPopup = wrapper.container.querySelector('.content-popup') as HTMLElement
    expect(contentPopup.innerHTML).toBeTruthy()
    const inputEmail = contentPopup.querySelector('input[name="email"]')
    expect(inputEmail).toBeTruthy()
    const inputPassword = contentPopup.querySelector('input[name="password"]')
    expect(inputPassword).toBeTruthy()
    expect(contentPopup.querySelector('input[name="rePassword"]')).toBeFalsy()
    expect(contentPopup.querySelector('input[name="userName"]')).toBeFalsy()

    const mockAuthServices = await import('@/firebase/auth/auth')
    const yesBtn = wrapper.container.querySelector('.popup .yes-btn')
    expect(yesBtn).toBeTruthy()
    fireEvent.click(yesBtn as HTMLElement)
    expect(window.alert).toBeCalledWith('Empty input')
    expect(mockAuthServices.default.loginWithEmail).toBeCalledTimes(0)
    fireEvent.change(inputEmail as HTMLElement, { target: { value: formLogin.email } })
    fireEvent.change(inputPassword as HTMLElement, { target: { value: formLogin.password } })
    fireEvent.click(yesBtn as HTMLElement)
    expect(mockAuthServices.default.loginWithEmail).toBeCalled()
    await sleep(50)
    expect(mockClose).toBeCalled()
  })
  it('Should render visible popup login and login form, but api throw error', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={true} close={mockClose} />));
    const contentPopup = wrapper.container.querySelector('.content-popup') as HTMLElement
    expect(contentPopup.innerHTML).toBeTruthy()
    const inputEmail = contentPopup.querySelector('input[name="email"]')
    expect(inputEmail).toBeTruthy()
    const inputPassword = contentPopup.querySelector('input[name="password"]')
    expect(inputPassword).toBeTruthy()
    expect(contentPopup.querySelector('input[name="rePassword"]')).toBeFalsy()
    expect(contentPopup.querySelector('input[name="userName"]')).toBeFalsy()

    const mockAuthServices = await import('@/firebase/auth/auth')
    const mError = new Error('Unable to retrieve rows')
    mockAuthServices.default.loginWithEmail.mockRejectedValueOnce(mError)
    const yesBtn = wrapper.container.querySelector('.popup .yes-btn')
    expect(yesBtn).toBeTruthy()
    fireEvent.change(inputEmail as HTMLElement, { target: { value: formLogin.email } })
    fireEvent.change(inputPassword as HTMLElement, { target: { value: formLogin.password } })
    fireEvent.click(yesBtn as HTMLElement)
    expect(mockAuthServices.default.loginWithEmail).toBeCalled()
    await sleep(50)
    expect(mockClose).toBeCalledTimes(0)
    expect(window.alert).toBeCalledWith(mError)
  })
  it('Should worked with register form correctly', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={true} close={mockClose} />));
    const contentPopup = wrapper.container.querySelector('.content-popup') as HTMLElement
    expect(contentPopup.innerHTML).toBeTruthy()
    const switchBtn = wrapper.container.querySelector('.popup .switch-form-btn') as HTMLElement
    expect(switchBtn.innerText).toBe(`Don't have an account? Register now.`)
    fireEvent.click(switchBtn)
    const inputUserName = contentPopup.querySelector('input[name="userName"]')
    expect(inputUserName).toBeTruthy()
    const inputEmail = contentPopup.querySelector('input[name="email"]')
    expect(inputEmail).toBeTruthy()
    const inputPassword = contentPopup.querySelector('input[name="password"]')
    expect(inputPassword).toBeTruthy()
    const inputRePassword = contentPopup.querySelector('input[name="rePassword"]')
    expect(inputRePassword).toBeTruthy()

    const mockAuthServices = await import('@/firebase/auth/auth')
    const yesBtn = wrapper.container.querySelector('.popup .yes-btn')
    expect(yesBtn).toBeTruthy()
    fireEvent.click(yesBtn as HTMLElement)
    expect(window.alert).toBeCalledWith('Empty input')
    expect(mockAuthServices.default.register).toBeCalledTimes(0)
    fireEvent.change(inputUserName as HTMLElement, { target: { value: formRegister.userName } })
    fireEvent.change(inputEmail as HTMLElement, { target: { value: formRegister.email } })
    fireEvent.change(inputPassword as HTMLElement, { target: { value: formRegister.password } })
    fireEvent.change(inputRePassword as HTMLElement, { target: { value: 'notmatch' } })
    fireEvent.click(yesBtn as HTMLElement)
    expect(window.alert).toBeCalledWith('Password and Re-password is not matching.')
    expect(mockAuthServices.default.register).toBeCalledTimes(0)
    fireEvent.change(inputRePassword as HTMLElement, { target: { value: formRegister.rePassword } })
    fireEvent.click(yesBtn as HTMLElement)
    expect(mockAuthServices.default.register).toBeCalled()
    await sleep(50)
    expect(mockClose).toBeCalled()
  })
  it('Should worked with register form, but api throw error', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={true} close={mockClose} />));
    const contentPopup = wrapper.container.querySelector('.content-popup') as HTMLElement
    expect(contentPopup.innerHTML).toBeTruthy()
    const switchBtn = wrapper.container.querySelector('.popup .switch-form-btn') as HTMLElement
    expect(switchBtn.innerText).toBe(`Don't have an account? Register now.`)
    fireEvent.click(switchBtn)
    const inputUserName = contentPopup.querySelector('input[name="userName"]')
    expect(inputUserName).toBeTruthy()
    const inputEmail = contentPopup.querySelector('input[name="email"]')
    expect(inputEmail).toBeTruthy()
    const inputPassword = contentPopup.querySelector('input[name="password"]')
    expect(inputPassword).toBeTruthy()
    const inputRePassword = contentPopup.querySelector('input[name="rePassword"]')
    expect(inputRePassword).toBeTruthy()

    const mockAuthServices = await import('@/firebase/auth/auth')
    const mError = new Error('Unable to retrieve rows')
    mockAuthServices.default.register.mockRejectedValueOnce(mError)
    const yesBtn = wrapper.container.querySelector('.popup .yes-btn')
    expect(yesBtn).toBeTruthy()
    fireEvent.change(inputUserName as HTMLElement, { target: { value: formRegister.userName } })
    fireEvent.change(inputEmail as HTMLElement, { target: { value: formRegister.email } })
    fireEvent.change(inputPassword as HTMLElement, { target: { value: formRegister.password } })
    fireEvent.change(inputRePassword as HTMLElement, { target: { value: formRegister.rePassword } })
    fireEvent.click(yesBtn as HTMLElement)
    expect(mockAuthServices.default.register).toBeCalled()
    await sleep(50)
    expect(mockClose).toBeCalledTimes(0)
    expect(window.alert).toBeCalledWith(mError)
  })
  it('Should show true form when click switch form button', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={true} close={mockClose} />));
    const contentPopup = wrapper.container.querySelector('.content-popup') as HTMLElement
    expect(contentPopup.innerHTML).toBeTruthy()
    expect(contentPopup.querySelector('input[name="email"]')).toBeTruthy()
    expect(contentPopup.querySelector('input[name="password"]')).toBeTruthy()
    expect(contentPopup.querySelector('input[name="rePassword"]')).toBeFalsy()
    expect(contentPopup.querySelector('input[name="userName"]')).toBeFalsy()
    const switchBtn = wrapper.container.querySelector('.popup .switch-form-btn') as HTMLElement
    expect(switchBtn.innerText).toBe(`Don't have an account? Register now.`)
    fireEvent.click(switchBtn)
    expect(switchBtn.innerText).toBe(`Back to Login`)
    expect(contentPopup.querySelector('input[name="rePassword"]')).toBeTruthy()
    expect(contentPopup.querySelector('input[name="userName"]')).toBeTruthy()
    fireEvent.click(switchBtn)
    expect(contentPopup.querySelector('input[name="rePassword"]')).toBeFalsy()
    expect(contentPopup.querySelector('input[name="userName"]')).toBeFalsy()
  })
  it('should close on click cancel button', async () => {
    const mockClose = vi.fn()
    const wrapper = await act( async () => render(<PopupLogin isShow={true} close={mockClose} />));
    const cancelButton = wrapper.container.querySelector('.popup .cancel-btn')
    expect(cancelButton).toBeTruthy()
    fireEvent.click(cancelButton as HTMLElement)
    expect(mockClose).toBeCalled()
  })
})
