import Task from './db'

export default async function handler(req, res) {
  res.status(200).json({ code: 0, data: await Task.getList() })
}