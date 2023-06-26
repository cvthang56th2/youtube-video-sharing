type PropsType = {
  children: React.ReactNode
}

const LayoutDefault = (props: PropsType) => {
  return (
    <div className="prose">
      <div className="h-screen w-screen overflow-y-auto flex flex-col">
        <header className="flex-0 p-4 border-b-2">
          Header
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {props.children}
        </main>
        <footer className="flex-0 p-4 border-t-2">
          footer
        </footer>
      </div>
    </div>
  )
}

export default LayoutDefault