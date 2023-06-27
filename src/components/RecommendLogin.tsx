const RecommendLogin = () => {
  const openLogin = () => {
    const loginBtn = document.querySelector('#login-btn') as HTMLElement
    if (loginBtn) {
      loginBtn.click()
    }
  }

  return (
    <div className='text-center'>
      <p>You are not logged in.</p>
      <button className='btn btn-green text-base px-5 py-2' onClick={() => openLogin()}>Login / Register</button>
    </div>
  )
}

export default RecommendLogin