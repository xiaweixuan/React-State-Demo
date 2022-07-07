import { useReducer, Key, useMemo, useState, useEffect, useCallback } from 'react'

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

function useById<T extends StateItemProps>(): FnReturnType<T> {
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
function useModalParams<T>() {
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

/**
 * useQueryParams
*/
function useQueryParams(
  key: string,
  defaultValue?: number | string
): [string, (newValue: number | string) => void]

function useQueryParams<T>(
  key: string,
  defaultValue: number | string,
  transfinferorm: (v: string) => T
): [T, (newValue: number | string) => void]

function useQueryParams(
  key: string,
  defaultValue?: number | string,
  transfinferorm?: any,
): any {
  const [value, setValue] = useState<any>(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has(key)) {
      const value = params.get(key) ?? ''
      return transfinferorm?.(value) ?? value
    } else {
      params.set(key, String(defaultValue))
      history.replaceState(null, '', `?${params.toString()}`)
      return transfinferorm?.(String(defaultValue)) ?? String(defaultValue)
    }
  })

  const handle = useCallback((newValue: number | string) =>
    setValue(() => {
      const params = new URLSearchParams(window.location.search)
      params.set(key, String(newValue))
      history.replaceState(null, '', `?${params.toString()}`)
      return transfinferorm?.(String(newValue)) ?? String(newValue)
    }),
    [setValue, key, transfinferorm]
  )

  return [value, handle]
}

/**
 * usePagingParams
*/
function usePagingParams(num: number, size: number, key: string) {
  const [pageNum, setNum] = useQueryParams('page_num', num, Number)
  const [pageSize, setSize] = useQueryParams('page_size', size, Number)
  const [keyword, setKeyword] = useQueryParams('keyword', key)

  const pagination = useMemo(() => ({
    current: pageNum,
    pageSize: pageSize,
    showSizeChanger: true,
    onChange: (num: number, size: number) => {
      setNum(size !== pageSize ? 1 : num)
      setSize(size)
    }
  }), [pageNum, setNum, pageSize, setSize])

  return {
    pageNum,
    setNum,
    pageSize,
    setSize,
    keyword,
    setKeyword,
    pagination,
  }
}

export { useQueryParams, useModalParams, useById, usePagingParams }
