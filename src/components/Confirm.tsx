import Popup from "@/components/Popup"
import React, { useEffect, useState } from "react"

interface PropsType {
  children: React.ReactNode,
  onYes: () => void,
}

const Confirm = (props: PropsType) => {
  const [isShow, setIsShow] = useState(false)
  return (
    <>
      <div onClick={() => setIsShow(true)} className="inline-flex">
        {props.children}
      </div>
      <Popup title="Confirm" isShow={isShow} onSave={() => props.onYes()} onCancel={() => setIsShow(false)} saveText="Yes" cancelText="No">
        Are you sure to do this action?
      </Popup>
    </>
  )
}

export default Confirm