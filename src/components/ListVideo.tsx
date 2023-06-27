type PropsType = {
  videos: {
    title: string,
    author: string,
    like: number,
    dislike: number,
    description?: string
  }[],
  isShowReaction?: boolean
}

const ListVideo = ({ videos, isShowReaction }: PropsType) => {
  return (
    <>
      {videos.map((videoObj, vIndex) => (
        <div className='flex flex-wrap -mx-4 mb-7 last:mb-0 py-2' key={`video-${vIndex}`}>
          <div className='w-full md:w-5/12 px-4'>
            <div className="w-full h-[200px] md:h-[250px] bg-gray-50 relative group cursor-pointer">
              <img src={videoObj.thumbnails.standard.url} alt="" className="absolute inset-0 object-cover w-full h-full !my-0" />
              <div className="bg-gray-500 opacity-50 absolute inset-0"></div>
              <span className="center-middle rounded-full bg-white text-black px-[6px] py-[8px] font-bold group-hover:bg-blue-500 group-hover:text-white">
                Play
              </span>
            </div>
          </div>
          <div className='w-full pt-2 md:pt-0 md:w-7/12 px-4'>
            <h5 className="font-bold">{ videoObj.title }</h5>
            <div>Shared by: { videoObj.author }</div>
            {isShowReaction && (
              <div className="flex items-center">
                <button className="btn font-bold border-2 rounded-sm text-blue-600 hover:text-white hover:bg-blue-600">Like</button>
                <button className="btn font-bold border-2 rounded-sm text-gray-600 hover:text-white hover:bg-gray-600 ml-4">DisLike</button>
              </div>
            )}
            <div className="flex">
              <span>Like: { videoObj.like || 0 }</span>
              <span className="mx-4">-</span>
              <span>Dislike: { videoObj.dislike || 0 }</span>
            </div>
            <div>Description:</div>
            <div>{ videoObj.description }</div>
          </div>
        </div>
      ))}
    </>
  )
}

export default ListVideo