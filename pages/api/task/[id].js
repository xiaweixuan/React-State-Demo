import Task from '../db'

export default async function taskHandler(req, res) {
  const {
    body: stringBody, // 请求体
    query: { id }, // 路径参数
    method,
  } = req

  const body = stringBody ? JSON.parse(stringBody) : {}

  if (method === 'POST') {
    const check = Task.verify(body, ["id"])
    if (check) {
      res.status(200).json({ code: 100, msg: check })
    } else {
      const data = await Task.create(body)
      res.status(200).json({ code: 0, data })
    }
  } else if (method === 'PUT') {
    const check = Task.verify(body)
    if (check) {
      res.status(200).json({ code: 100, msg: check })
    } else {
      const data = await Task.update(id, body)
      res.status(200).json({ code: 0, data })
    }
  } else if (method === 'DELETE') {
    const data = await Task.delete(id)
    res.status(200).json({ code: 0, data })
  } else {
    res.status(405).end(`Method  Not Allowed`)
  }
}