import Popup from "@/components/Popup"
import { useEffect, useState } from "react"

interface PropsType {
  isShow: boolean,
  onLoginSuccess: () => void,
  close: () => void,
}

const PopupLogin = (props: PropsType) => {
  const [isShow, setIsShow] = useState(false)
  const login = () => {
    props.onLoginSuccess()
    props.close()
  }
  useEffect(() => {
    setIsShow(props.isShow)
  }, [props.isShow])
  return (
    <Popup title="Login" isShow={isShow} onSave={login} onCancel={() => props.close()}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt debitis illum cum, esse maiores ipsum sit tenetur eaque quisquam officiis expedita nemo doloribus perspiciatis, tempora repellendus nostrum sequi neque. Delectus?
    </Popup>
  )
}

export default PopupLogin