import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Slider } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'

export interface ChannelModel {
  id: string
  serviceName: string
  channelName: string
  modelId: string
  weight: number
}

const mockChannels: ChannelModel[] = [
  { id: '1', serviceName: 'DeepSeek 统一服务', channelName: '官方渠道', modelId: 'deepseek-chat-official', weight: 60 },
  { id: '2', serviceName: 'DeepSeek 统一服务', channelName: '备用渠道A', modelId: 'deepseek-chat-backup-a', weight: 25 },
  { id: '3', serviceName: 'DeepSeek 统一服务', channelName: '备用渠道B', modelId: 'deepseek-chat-backup-b', weight: 15 },
  { id: '4', serviceName: 'Qwen 统一服务', channelName: '阿里云', modelId: 'qwen-dashscope', weight: 70 },
  { id: '5', serviceName: 'Qwen 统一服务', channelName: '自建', modelId: 'qwen-self', weight: 30 },
]

export default function ChannelModels() {
  const [data, setData] = useState<ChannelModel[]>(mockChannels)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    form.setFieldsValue({ weight: 50 })
    setEditingId(null)
    setModalOpen(true)
  }

  const handleEdit = (record: ChannelModel) => {
    form.setFieldsValue(record)
    setEditingId(record.id)
    setModalOpen(true)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingId) {
        setData((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...values } : p))
        )
      } else {
        setData((prev) => [...prev, { id: String(Date.now()), ...values }])
      }
      setModalOpen(false)
    })
  }

  const columns = [
    { title: '模型服务', dataIndex: 'serviceName', key: 'serviceName', width: 160 },
    { title: '渠道名称', dataIndex: 'channelName', key: 'channelName', width: 120 },
    { title: '渠道模型 ID', dataIndex: 'modelId', key: 'modelId', width: 200 },
    {
      title: '流量权重 (%)',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (v: number) => `${v}%`,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: ChannelModel) => (
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ]

  return (
    <>
      <Card
        title="渠道模型与流量权重"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加渠道模型
          </Button>
        }
      >
        <p style={{ color: '#666', marginBottom: 16 }}>
          支持可视化添加不同渠道的模型（如不同渠道的 DeepSeek 服务），并为各渠道设置流量权重，实现负载分配。
        </p>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑渠道模型' : '添加渠道模型'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="serviceName" label="模型服务名称" rules={[{ required: true }]}>
            <Input placeholder="如 DeepSeek 统一服务" />
          </Form.Item>
          <Form.Item name="channelName" label="渠道名称" rules={[{ required: true }]}>
            <Input placeholder="如 官方渠道、备用渠道A" />
          </Form.Item>
          <Form.Item name="modelId" label="渠道模型 ID" rules={[{ required: true }]}>
            <Input placeholder="如 deepseek-chat-official" />
          </Form.Item>
          <Form.Item
            name="weight"
            label="流量权重 (%)"
            rules={[{ required: true }]}
            extra="该渠道在总流量中的占比，同一服务下各渠道权重之和建议为 100%"
          >
            <Slider min={0} max={100} marks={{ 0: '0%', 50: '50%', 100: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
