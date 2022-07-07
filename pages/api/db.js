class Task {
  constructor() {
    this._taskList = [
      { id: "1", name: "task1", description: "第一个任务描述" },
      { id: "2", name: "task2", description: "第二个任务描述" },
      { id: "3", name: "task3", description: "第三个任务描述" },
      { id: "4", name: "task4", description: "第一个任务描述" },
      { id: "5", name: "task5", description: "第二个任务描述" },
      { id: "6", name: "task6", description: "第三个任务描述" },
      { id: "7", name: "task7", description: "第一个任务描述" },
      { id: "8", name: "task8", description: "第二个任务描述" },
      { id: "9", name: "task9", description: "第三个任务描述" },
      { id: "10", name: "task10", description: "第一个任务描述" },
      { id: "11", name: "task11", description: "第二个任务描述" },
      { id: "12", name: "task12", description: "第三个任务描述" },
    ]
    this._fields = ['id', 'name', 'description']
  }
  _sleep(time = 800) {
    return new Promise(res => {
      setTimeout(() => {
        res('')
      }, time)
    })
  }
  _group(array, subGroupLength) {
    var index = 0
    var newArray = []
    while (index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength))
    }
    return newArray
  }
  verify(data = {}, ignore = []) {
    try {
      let key
      const keys = [...this._fields]
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
  async getPagingList(page_num = 1, page_size = 5, keyword = '') {
    await this._sleep()
    const filtered_list = this._taskList.filter((i) => i.name.includes(keyword))
    const grouped_list = this._group(filtered_list, Number(page_size))
    return {
      total: this._taskList.length,
      list: grouped_list[Number(page_num) - 1] ?? [],
    }
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