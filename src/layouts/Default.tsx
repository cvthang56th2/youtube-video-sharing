import Header from '@/layouts/partials/Header'
import Footer from '@/layouts/partials/Footer'

type PropsType = {
  children: React.ReactNode
}

const LayoutDefault = (props: PropsType) => {
  return (
    <div className="prose">
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