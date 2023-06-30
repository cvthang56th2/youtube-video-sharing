import Popup from "@/components/Popup"
import React, { useState } from "react"

interface PropsType {
  children: React.ReactNode,
  wrapClasses?: string,
  onYes: () => void,
}

const Confirm = ({ wrapClasses = '', ...props }: PropsType) => {
  const [isShow, setIsShow] = useState(false)
  const onSave = () => {
    props.onYes()
    setIsShow(false)
  }
  return (
    <>
      <div onClick={() => setIsShow(true)} className={["inline-flex", wrapClasses].join(' ')}>
        {props.children}
      </div>
      <Popup title="Confirm" isShow={isShow} onSave={() => onSave()} onCancel={() => setIsShow(false)} saveText="Yes" cancelText="No">
        Are you sure to do this action?
      </Popup>
    </>
  )
}

export default Confirm