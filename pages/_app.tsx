import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import 'antd/dist/antd.css';
import 'tailwindcss/tailwind.css'

const route = [
  { to: "zustand", text: "zustand" },
  { to: "jotai", text: "jotai" },
  { to: "xstate", text: "xstate" },
  { to: "context", text: "context" },
  { to: "mobox", text: "mobox" },
  { to: "useRequest", text: "useRequest" },
]

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname, push } = useRouter()

  return (
    <div className="flex">
      <div className="px-6 py-3">
        <div className="p-3 cursor-pointer font-black">
          <div onClick={() => push("/")}>React 状态管理</div>
        </div>
        {route.map(i => (
          <div
            key={i.to}
            onClick={() => push(i.to)}
            className={[
              pathname.includes(i.to)
                ? "bg-cyan-100 shadow-inner"
                : "hover:bg-cyan-100 hover:shadow-md",
              "px-3 py-1 mb-3 rounded-lg cursor-pointer text-gray-700",
              "transition duration-150 ease-in-out"
            ].join(' ')}
          >
            {i.text}
          </div>
        ))}
      </div>
      <div className="flex-1 p-5">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
