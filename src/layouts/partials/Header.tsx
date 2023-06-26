import PopupLogin from "@/components/PopupLogin"
import Confirm from "@/components/Confirm"
import { useState } from "react"

const Header = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [isShowPopupLogin, setIsShowPopupLogin] = useState(false)

  return (
    <header className="flex-0 p-4 border-b-2 flex justify-between items-center">
      <div className="flex items-center text-3xl font-bold">
        Funny Movies
      </div>
      <div>
        {isLogin ? (
          <div className="flex items-center">
            <span>Welcome: someone@gmail.com</span>
            <Confirm onYes={() => setIsLogin(false)}>
              <button className="btn btn-red ml-2">
                Logout
              </button>
            </Confirm>
          </div>
        ) : (
          <>
            <button className="btn btn-green" onClick={() => setIsShowPopupLogin(true)}>
              Login/Register
            </button>
            <PopupLogin isShow={isShowPopupLogin} onLoginSuccess={() => setIsLogin(true)} close={() => setIsShowPopupLogin(false)} />
          </>
        )}
      </div>
    </header>
  )
}

export default Header