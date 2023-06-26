const ShareVideo = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-md border-2 p-5">
        <h1>Share a Youtube movie</h1>
        <div className="flex items-center">
          <div className="w-1/3 pr-2">Youtube URL</div>
          <div className="w-2/3">
            <input type="text" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-1/3"></div>
          <div className="w-2/3">
            <button className="btn w-full mt-2 btn-green font-bold">Share</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareVideo