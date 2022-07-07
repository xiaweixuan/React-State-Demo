import React from 'react'
import { Button, Table, Popconfirm, message, Input } from 'antd'
import { useModalParams, usePagingParams } from '../hooks'
import Store from './store'
import OperateModal from './sections/operateModal'
import { usePagingTask, useRemoveTask } from './services'

const INITIAL_NUM = 1
const INITIAL_PAGE = 5
const INITIAL_KEYWORD = ''

function Context() {
  // ui state
  const { pageNum, pageSize, keyword, setKeyword, pagination } = usePagingParams(INITIAL_NUM, INITIAL_PAGE, INITIAL_KEYWORD)
  const [params, { onCreate, onEdit, onCancel }] = useModalParams<ITask>()
  const [removeId, setRemoveId] = React.useState<string>()

  // Business data
  const { tasks, operate } = Store.useContainer()
  const [total, setTotal] = React.useState(0)

  // http request
  const [query, querying] = usePagingTask()
  const [remove, removing] = useRemoveTask()

  // query tasks
  React.useEffect(() => {
    query(pageNum, pageSize, keyword)
      .then(data => {
        setTotal(data.total)
        operate.saveByList(data.list)
      })
  }, [query, operate, pageNum, pageSize, keyword])

  return (
    <div>
      <OperateModal {...params} key={params.current?.id} onCancel={onCancel} />
      <div className="mb-4 flex justify-between">
        <Button type="primary" onClick={onCreate}>Create</Button>
        <Input.Search style={{ width: '180px' }} value={keyword} onChange={e => setKeyword(e.target.value)} />
      </div>
      <Table
        rowKey="id"
        loading={querying}
        dataSource={tasks.list}
        pagination={{ ...pagination, total, pageSizeOptions: [5, 10, 15] }}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description' },
          {
            title: 'Operate',
            render: (item) => [
              <Button type="link" key="edit" style={{ padding: 0 }} onClick={onEdit.bind(null, item)}>Edit</Button>,
              <Popconfirm
                key="delete"
                title="是否删除"
                visible={removeId === item.id}
                okButtonProps={{ loading: removing }}
                onCancel={setRemoveId.bind(null, undefined)}
                onConfirm={async () => {
                  const result = await remove(item.id)
                  if (!result) return message.warning('删除失败')
                  message.success('删除成功')
                  operate.remove(result)
                  setRemoveId(undefined)
                }}
              >
                <Button type="link" danger onClick={setRemoveId.bind(null, item.id)}>Delete</Button>
              </Popconfirm>,
            ],
          },
        ]}
      />
    </div>
  )
}

function Wrapper(props: any) {
  return (
    <Store.Provider>
      <Context {...props} />
    </Store.Provider>
  )
}

export default Wrapper