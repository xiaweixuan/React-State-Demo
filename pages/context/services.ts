import { useCallback, useState } from "react"

export function useTask() {
  const [loading, setLoading] = useState(false)

  const operate = useCallback(() => {
    setLoading(true)
    return fetch('/api/tasks')
      .then(res => {
        setLoading(false)
        return res.json()
      })
      .then(({ code, data }) => !code ? data : [])
  }, [setLoading])

  return [operate, loading] as const
}

export function useCreateTask() {
  const [loading, setLoading] = useState(false)

  const operate = useCallback((dto: FilterPick<ITask, 'id'>) => {
    setLoading(true)
    return fetch('/api/task', { method: "POST", body: JSON.stringify(dto) })
      .then(res => {
        setLoading(false)
        return res.json()
      })
      .then(({ code, data }) => !code ? data : undefined)
  }, [setLoading])

  return [operate, loading] as const
}

export function useUpdateTask() {
  const [loading, setLoading] = useState(false)

  const operate = useCallback((id: ITask['id'], dto: ITask) => {
    setLoading(true)
    return fetch(`/api/task/${id}`, { method: "PUT", body: JSON.stringify(dto) })
      .then(res => {
        setLoading(false)
        return res.json()
      })
      .then(({ code, data }) => !code ? data : undefined)
  }, [setLoading])

  return [operate, loading] as const
}

export function useRemoveTask() {
  const [loading, setLoading] = useState(false)

  const operate = useCallback((id: ITask['id']) => {
    setLoading(true)
    return fetch(`/api/task/${id}`, { method: "DELETE" })
      .then(res => {
        setLoading(false)
        return res.json()
      })
      .then(({ code }) => !code ? { id } : undefined)
  }, [setLoading])

  return [operate, loading] as const
}