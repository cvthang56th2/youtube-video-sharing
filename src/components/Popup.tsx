interface PropsType {
  title?: string,
  width?: string | number,
  children: React.ReactNode,
  isShow: boolean,
  onSave: (params?: unknown) => unknown,
  onCancel: (params?: unknown) => unknown,
  saveText?: string,
  cancelText?: string,
  wrapperClasses?: string
}

const Popup = ({ width, isShow, title = 'Popup', saveText = 'Save', cancelText = 'Cancel', wrapperClasses = '', ...props }: PropsType) => {
  return (
    <div className={["popup w-[100svw] h-[100svh] fixed inset-0 z-10 overflow-y-auto flex items-center justify-center", isShow ? 'bg-[rgba(0,0,0,0.2)]' : 'pointer-events-none', wrapperClasses].join(' ')}>
      <div className={["bg-white max-w-[95%] max-h-[95%] p-5 rounded-xl shadow-2xl overflow-y-auto flex flex-col transition-all duration-300 ease-in-out", isShow ? 'transform-none' : 'scale-0'].join(' ')} style={{ width }}>
        {isShow && (
          <>
            <div className="border-b-2">
              <div className="text-2xl font-bold mb-2">{ title }</div>
            </div>
            <div className="flex-1 py-2">
              { props.children }
            </div>
            <div className="border-t-2 flex justify-end items-center pt-5">
              <button className="btn btn-red cancel-btn" onClick={() => props.onCancel()}>{ cancelText }</button>
              <button className="btn btn-green ml-2 yes-btn" onClick={() => props.onSave()}>{ saveText }</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Popup