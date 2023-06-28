import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'

import { setCurrentUser } from '@/store/authSlice';

import Header from '@/layouts/partials/Header'
import Footer from '@/layouts/partials/Footer'

import AuthServices from '@/firebase/auth/auth'
import UserServices from '@/firebase/user/user'

type PropsType = {
  children: React.ReactNode
}

const LayoutDefault = (props: PropsType) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    AuthServices.onAuthStateChanged(async (res: { uid: string }) => {
      const { uid } = res
      if (uid) {
        const userInfo = await UserServices.getUserById(uid)
        if (userInfo) {
          dispatch(setCurrentUser(userInfo))
        }
      }
      setIsLoaded(true)
    })
    return
  }, [])

  return (
    <div className="prose prose-sm lg:prose-lg xl:prose-xl">
      <div className="h-screen w-screen flex justify-center items-center">
        {isLoaded ? (
          <div className="container mx-auto h-full overflow-y-auto flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4">
              {props.children}
            </main>
            <Footer />
          </div>
        ) : (
          <div className='text-3xl font-bold animate-pulse'>
            <span className='text-blue-500'>L</span>
            <span className='text-red-500'>O</span>
            <span className='text-green-500'>A</span>
            <span className='text-yellow-500'>D</span>
            <span className='text-pink-500'>I</span>
            <span className='text-purple-500'>N</span>
            <span className='text-cyan-500'>G</span>
            <span>...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default LayoutDefault