import { useReducer, Key, useMemo, useState } from 'react'

/**
 * useById
*/
interface StateItemProps {
  id: Key
}

type StatesProps<T extends StateItemProps = StateItemProps> = {
  byId: Record<Key, T>
  allIds: Key[]
}

type Action<T extends StateItemProps = StateItemProps> =
  | { type: 'saveState'; payload: StatesProps<T> }
  | { type: 'addItem'; payload: T }
  | { type: 'pushItem'; payload: T }
  | { type: 'updateItem'; payload: T }
  | { type: 'removeItem'; payload: Pick<T, 'id'> }

type ReducerProps<S, A> = (state: S, action: A) => S

export type FnReturnType<T extends StateItemProps> =
  readonly [{
    readonly list: T[];
    readonly byId: Record<Key, T>;
    readonly allIds: Key[];
  }, {
    readonly create: (value: T, isUnshift?: boolean | undefined) => void;
    readonly remove: (value: Pick<T, 'id'>) => void;
    readonly update: (value: T) => void;
    readonly save: (value: StatesProps<T>) => void;
    readonly saveByList: (value: T[]) => void;
  }]

const initialState = { byId: {}, allIds: [] }

function reducer<T extends StateItemProps>(
  state: StatesProps<T>,
  action: Action<T>,
) {
  const { byId, allIds } = state
  switch (action.type) {
    case 'saveState':
      return { ...action.payload }
    case 'addItem':
      byId[action.payload.id] = action.payload
      return { byId, allIds: [action.payload.id, ...allIds] }
    case 'pushItem':
      byId[action.payload.id] = action.payload
      return { byId, allIds: [...allIds, action.payload.id] }
    case 'updateItem':
      byId[action.payload.id] = action.payload
      return { byId, allIds }
    case 'removeItem':
      return {
        byId,
        allIds: allIds.filter((i) => i !== action.payload.id),
      }
    default:
      return { ...state }
  }
}

export function useById<T extends StateItemProps>(): FnReturnType<T> {
  const [state, dispatch] = useReducer<ReducerProps<StatesProps<T>, Action<T>>>(
    reducer,
    initialState,
  )

  const action = useMemo(() => ({
    create: (value: T, isUnshift?: boolean) => {
      isUnshift
        ? dispatch({ type: 'addItem', payload: value })
        : dispatch({ type: 'pushItem', payload: value })
    },
    update: (value: T) => {
      dispatch({ type: 'updateItem', payload: value })
    },
    remove: (value: Pick<T, 'id'>) => {
      dispatch({ type: 'removeItem', payload: value })
    },
    save: (value: StatesProps<T>) => {
      dispatch({ type: 'saveState', payload: value })
    },
    saveByList: (value: T[]) => {
      const { byId, allIds }: StatesProps<T> = { byId: {}, allIds: [] }
      value.forEach(i => {
        byId[i.id] = i
        allIds.push(i.id)

      })
      dispatch({ type: 'saveState', payload: { byId, allIds } })
    }

  }), [dispatch])

  const list = useMemo(() => state.allIds.map((i) => state.byId[i]), [state])

  return [{ ...state, list }, action] as const
}


/**
 * useModalParams
*/
export function useModalParams<T>() {
  const [current, setCurrent] = useState<T>()
  const [visible, setVisible] = useState<boolean>(false)

  const params = useMemo(() => ({
    current,
    visible,
  }), [current, visible])

  const action = useMemo(() => ({
    onCreate: () => {
      setCurrent(undefined)
      setVisible(true)
    },
    onEdit: (v: T) => {
      setCurrent(v)
      setVisible(true)
    },
    onCancel: () => {
      setVisible(false)
    }
  }), [setCurrent, setVisible])

  return [params, action] as const
}
