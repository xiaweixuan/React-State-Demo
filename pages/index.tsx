import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {

  const [animate, setAnimate] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(setAnimate.bind(null, true), 50)
    return () => setAnimate(false)
  }, [])

  return (
    <div style={{ width: '600px' }} className="text-cyan-500 p-12 text-center">
      <div style={{ lineHeight: '90px' }} className="grid grid-flow-col grid-rows-2 grid-cols-3 gap-8">
        <div
          style={{ width: '100px', height: '100px' }}
          onClick={() => router.push('/zustand')}
          className={[
            "transform duration-300",
            animate ? "scale-110 -rotate-6" : "",
            "rounded-lg border-4 border-light-blue-500 cursor-pointer",
          ].join(' ')}
        >
          zustand
        </div>
        <div
          style={{ width: '100px', height: '100px' }}
          onClick={() => router.push('/jotai')}
          className={[
            "transform duration-300",
            animate ? "scale-75 rotate-6 translate-x-2 translate-y-15" : "",
            "col-start-3 rounded-lg border-4 border-light-blue-500 cursor-pointer"
          ].join(' ')}
        >
          jotai
        </div>
        <div
          style={{ width: '100px', height: '100px' }}
          onClick={() => router.push('/xstate')}
          className={[
            "transform duration-300",
            animate ? "scale-150 translate-y-11" : "",
            "rounded-lg border-4 border-light-blue-500 cursor-pointer",
          ].join(' ')}
        >
          xstate
        </div>
        <div
          style={{ width: '100px', height: '100px' }}
          onClick={() => router.push('/context')}
          className={[
            "transform duration-300",
            animate ? "translate-y-24" : "",
            "rounded-lg border-4 border-light-blue-500 cursor-pointer",
          ].join(' ')}
        >
          context
        </div>
        <div
          style={{ width: '250px', height: '100px' }}
          onClick={() => router.push('/mobox')}
          className={[
            "transform duration-300",
            animate ? "translate-x-20 translate-y-4" : "",
            "row-start-1 col-start-2 col-span-2 rounded-lg border-4 border-light-blue-500 cursor-pointer",
          ].join(' ')}
        >
          mobox
        </div>
        <div
          style={{ width: '100px', height: '100px' }}
          onClick={() => router.push('/useRequest')}
          className={[
            "transform duration-300",
            animate ? "translate-y-36" : "",
            "rounded-lg border-4 border-light-blue-500 cursor-pointer",
          ].join(' ')}
        >
          useRequest
        </div>
      </div>
    </div>
  )
}

export default Home
