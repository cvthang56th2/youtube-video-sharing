interface PropsType {
  title?: string,
  width?: string | number,
  height?: string | number,
  children: React.ReactNode,
  isShow: boolean,
  onSave: (params?: unknown) => unknown,
  onCancel: (params?: unknown) => unknown,
  saveText?: string,
  cancelText?: string
}

const Popup = ({ isShow, title = 'Popup', width = '50%', height = '50%', saveText = 'Save', cancelText = 'Cancel', ...props }: PropsType) => {
  return (
    <>
      <div className={["w-screen h-screen fixed inset-0 z-10 overflow-y-auto flex items-center justify-center", isShow ? 'bg-[rgba(0,0,0,0.2)]' : 'pointer-events-none'].join(' ')}>
        <div className={["bg-white w-1/2 h-1/2 p-5 rounded-xl shadow-2xl overflow-y-auto flex flex-col transition-all duration-300 ease-in-out", isShow ? 'transform-none' : 'scale-0'].join(' ')} style={{ width, height }}>
          {isShow && (
            <>
              <div className="border-b-2">
                <h3 className="mt-0">{ title }</h3>
              </div>
              <div className="flex-1 py-2">
                { props.children }
              </div>
              <div className="border-t-2 flex justify-end items-center pt-5">
                <button className="btn btn-green" onClick={() => props.onSave()}>{ saveText }</button>
                <button className="btn btn-red ml-2" onClick={() => props.onCancel()}>{ cancelText }</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Popup