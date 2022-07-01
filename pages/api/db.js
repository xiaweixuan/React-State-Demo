class Task {
  constructor() {
    this._taskList = [
      { id: "1", name: "task1", description: "第一个任务描述" },
      { id: "2", name: "task2", description: "第二个任务描述" },
      { id: "3", name: "task3", description: "第三个任务描述" },
    ]
  }
  _sleep(time = 800) {
    return new Promise(res => {
      setTimeout(() => {
        res('')
      }, time)
    })
  }
  verify(data = {}, ignore = []) {
    try {
      let key
      const keys = Object.keys(this._taskList[0] ?? {})
      while (key = keys.pop()) {
        if (!(key in data || ignore.includes(key))) {
          return `缺少 ${key} 字段`
        }
      }
    } catch (e) {
      console.log(e)
      return `参数格式有误`
    }
  }
  async getList() {
    await this._sleep()
    return this._taskList
  }
  async create(dto) {
    await this._sleep()
    const item = { id: String(+new Date()), ...dto }
    this._taskList.unshift(item)
    return item
  }
  async update(id, dto) {
    await this._sleep()
    this._taskList = this._taskList.map(i => i.id === id ? dto : i)
    return dto
  }
  async delete(id) {
    await this._sleep()
    this._taskList = this._taskList.filter(i => i.id !== id)
    return id
  }
}

export default new Task()