import { Form, Input, message, Modal } from "antd"
import React from "react"
import { useCreateTask, useUpdateTask } from "../services"
import Store from "../store"

interface OperateModalProps {
  visible: boolean
  current?: ITask
  onCancel: () => void
}

const OperateModal: React.FC<OperateModalProps> = (props) => {
  const { visible, current, onCancel } = props
  const { operate } = Store.useContainer()
  const [form] = Form.useForm()

  const [create, creating] = useCreateTask()
  const [update, updating] = useUpdateTask()

  const onFinish = async (formState: FilterPick<ITask, 'id'>) => {
    if (current) {
      const result = await update(current.id, { id: current.id, ...formState })
      if (!result) return message.warning('更新失败')
      message.success('更新成功')
      operate.update(result)
    } else {
      const result = await create(formState)
      if (!result) return message.warning('创建失败')
      message.success('创建成功')
      operate.create(result, true)
    }
    onCancel()
  }

  return (
    <Modal
      title={current ? "Edit" : "Create"}
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{ loading: creating || updating }}
      onOk={form.submit}
    >
      <Form form={form} labelCol={{ span: 5 }} initialValues={current} onFinish={onFinish}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default OperateModal