import React, { useEffect, useState } from 'react'
import { checkLoginService, loginService } from '../backservice/backservice'
import { useDispatch } from 'react-redux'
import { login } from '../store/authslice'
import { useNavigate } from 'react-router-dom'

function Login() {


  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  function handleLogin(formdata) {
    setLoading(true)
    const username = formdata.get("username")
    const pass = formdata.get("password")
    loginService(username, pass).then((data) => {
      if (data) {
        dispatch(login(data))
        navigate("/")
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    const { username, password } = checkLoginService()
    if (username) {
      loginService(username, password).then((data) => {
        if (data) {
          dispatch(login(data))
          navigate("/")
        }
      }).finally(() => {
        setLoading(false)
      })
    }
  }, [])

  return (
    <div   className='w-screen h-screen p-1 justify-center items-center bg-blue-400 overflow-hidden'>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https:flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          PACMAC CLOUD
        </a>
        <div  className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div  className="p-6 space-y-4 md:space-y-6 sm:p-8" >
            <h1 style={{marginLeft:"5vh"}}  className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your Dashboard
            </h1>
            <form className="space-y-4 md:space-y-6" action={handleLogin}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
                <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              {loading ? (
                <span className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:cursor-pointer'>PLEASE WAIT</span>
              ) : (
                <button type="submit" style={{backgroundColor:"lightblue",fontSize:"2vh"}}  className="w-full text-black bg-primary-100 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:cursor-pointer">Sign in</button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login