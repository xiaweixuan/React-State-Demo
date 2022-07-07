import Task from './db'

export default async function handler(req, res) {
  const { query: { page_num, page_size, keyword } } = req
  if (page_num && page_size) {
    res.status(200).json({ code: 0, data: await Task.getPagingList(page_num, page_size, keyword) })
  } else {
    res.status(200).json({ code: 0, data: await Task.getList() })
  }
}