import { useEffect, useState } from "react"

import Popup from "@/components/Popup"

import AuthServices from '@/firebase/auth/auth'

interface PropsType {
  isShow: boolean,
  close: () => void,
}

const PopupLogin = (props: PropsType) => {
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: ''
  })
  const [formRegister, setFormRegister] = useState({
    userName: '',
    email: '',
    password: '',
    rePassword: '',
  })
  const [isShow, setIsShow] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  
  const handleChangeFormLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormLogin({ ...formLogin, [event.target.name]: event.target.value });
  };

  const handleChangeFormRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormRegister({ ...formRegister, [event.target.name]: event.target.value });
  };

  const onSave = () => {
    if (isRegister) {
      register()
    } else {
      login()
    }
  }
  
  const login = async () => {
    try {
      const { email, password } = formLogin
      if (!email || !password) {
        alert('Empty input')
        return
      }
      await AuthServices.loginWithEmail(email, password)
      props.close()
    } catch (error) {
      alert(error)
    }
  }
  const register = async () => {
    try {
      const { userName, email, password, rePassword } = formRegister
      if (!userName || !email || !password || !rePassword) {
        alert('Empty input')
        return
      }
      if (password !== rePassword) {
        alert('Password and Re-password is not matching.')
        return
      }
      await AuthServices.register(email, password, { userName })
      setFormLogin({
        ...formLogin,
        email,
        password,
      });
      props.close()
    } catch (error) {
      alert(error)
    }
  }
  useEffect(() => {
    setIsShow(props.isShow)
  }, [props.isShow])
  return (
    <Popup title={isRegister ? 'Register' : 'Login'} isShow={isShow} onSave={onSave} onCancel={() => props.close()} saveText={isRegister ? 'Register' : 'Login'} wrapperClasses="z-[99]">
      <form>
        {isRegister ? (
          <>
            <input value={formRegister.userName} onChange={handleChangeFormRegister} type="text" name="userName" placeholder="Username" />
            <input value={formRegister.email} onChange={handleChangeFormRegister} type="email" name="email" placeholder="Email" className="mt-2" />
            <input value={formRegister.password} onChange={handleChangeFormRegister} type="password" name="password" placeholder="Password" className="mt-2" />
            <input value={formRegister.password} onChange={handleChangeFormRegister} type="password" name="password" placeholder="Password" className="mt-2" />
            <input value={formRegister.rePassword} onChange={handleChangeFormRegister} type="password" name="rePassword" placeholder="Re-Password" className="mt-2" />
          </>
        ) : (
          <>
            <input value={formLogin.email} onChange={handleChangeFormLogin} type="email" name="email" placeholder="Email" />
            <input value={formLogin.password} onChange={handleChangeFormLogin} type="password" name="password" placeholder="Password" className="mt-2" />
          </>
        )}
        <div className="text-right">
          <button type="button" className="underline mt-2 italic" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Back to Login' : "Don't have an account? Register now."}
          </button>
        </div>
      </form>
    </Popup>
  )
}

export default PopupLogin