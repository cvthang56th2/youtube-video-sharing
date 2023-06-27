import Header from '@/layouts/partials/Header'
import Footer from '@/layouts/partials/Footer'
import UserServices from '@/firebase/user/user'
import { useEffect } from 'react'

type PropsType = {
  children: React.ReactNode
}

const LayoutDefault = (props: PropsType) => {
  const  checkLogin = async () => {
    const data = await UserServices.getUserById('1')
    console.log(data)
  }
  useEffect(() => {
    checkLogin()
  }, [])
  return (
    <div className="prose prose-sm lg:prose-lg xl:prose-xl">
      <div className="h-screen w-screen">
        <div className="container mx-auto h-full overflow-y-auto flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            {props.children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default LayoutDefault