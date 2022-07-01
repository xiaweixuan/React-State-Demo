import React from "react"
import { useById, FnReturnType } from '../hooks'

type StateType = { tasks:  FnReturnType<ITask>[0], operate: FnReturnType<ITask>[1] }
const Context = React.createContext<StateType| Symbol>(Symbol())

function Store({ children }: { children: React.ReactNode }) {
  const [tasks, operate] = useById<ITask>()

  return (
    <Context.Provider value={{ tasks, operate }} >
      {children}
    </Context.Provider>
  )
}

const StoreCantain = {
  useContainer: () => React.useContext(Context) as StateType,
  Provider: Store,
}

export default StoreCantain