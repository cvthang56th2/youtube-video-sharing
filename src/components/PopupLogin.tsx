import Popup from "@/components/Popup"
import { useEffect, useState } from "react"

interface PropsType {
  isShow: boolean,
  onLoginSuccess: () => void,
  close: () => void,
}

const PopupLogin = (props: PropsType) => {
  const [isShow, setIsShow] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const onSave = () => {
    if (isRegister) {
      setIsRegister(false)
    } else {
      props.onLoginSuccess()
      props.close()
    }
  }
  useEffect(() => {
    setIsShow(props.isShow)
  }, [props.isShow])
  return (
    <Popup title={isRegister ? 'Register' : 'Login'} isShow={isShow} onSave={onSave} onCancel={() => props.close()} saveText={isRegister ? 'Register' : 'Login'}>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" className="mt-2" />
        {isRegister && (
          <input type="password" placeholder="Re-Password" className="mt-2" />
        )}
        <div className="text-right">
          <a href="javascript:void(0)" className="underline mt-2 italic" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Back to Login' : 'Not have account? Registry now.'}
          </a>
        </div>
      </form>
    </Popup>
  )
}

export default PopupLogin