import ListVideo from '@/components/ListVideo'

const Home = () => {
  const videos = [...new Array(50).fill(0)].map((_e, i) => ({
    id: i,
    title: `Video ${i}`,
    author: 'author@abc.de',
    like: 99,
    dislike: 9,
    description: `Description ${i}`,
  }))
  return (
    <>
      <ListVideo videos={videos} isShowReaction />
    </>
  )
}

export default Home