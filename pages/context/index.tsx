import React, { useState } from 'react'
import { Button, Table, Popconfirm, message } from 'antd'
import { useModalParams } from '../hooks'
import Store from './store'
import OperateModal from './sections/operateModal'
import { useTask, useRemoveTask } from './services'

function Context() {
  const [params, { onCreate, onEdit, onCancel }] = useModalParams<ITask>()
  const [removeId, setRemoveId] = useState<string>()
  const { tasks, operate } = Store.useContainer()

  // http request
  const [query, querying] = useTask()
  const [remove, removing] = useRemoveTask()

  // query tasks
  React.useEffect(() => {
    query().then(operate.saveByList)
  }, [query, operate])

  return (
    <div>
      <OperateModal {...params} key={params.current?.id} onCancel={onCancel} />
      <Button className="mb-4" type="primary" onClick={onCreate} >
        Create
      </Button>
      <Table
        rowKey="id"
        loading={querying}
        dataSource={tasks.list}
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
                  if(!result) return message.warning('删除失败')
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