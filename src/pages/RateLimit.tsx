import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Select, InputNumber } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'

const SERVICE_LEVELS = ['L0', 'L1', 'L2', 'L3']
const MOCK_SERVICES = ['deepseek-chat', 'qwen-plus', 'gpt-4']

export interface RateLimitPolicy {
  id: string
  serviceName: string
  level: string
  rpm: number
  tpm: number
}

const mockPolicies: RateLimitPolicy[] = [
  { id: '1', serviceName: 'deepseek-chat', level: 'L0', rpm: 1000, tpm: 200000 },
  { id: '2', serviceName: 'deepseek-chat', level: 'L1', rpm: 500, tpm: 100000 },
  { id: '3', serviceName: 'deepseek-chat', level: 'L2', rpm: 200, tpm: 40000 },
  { id: '4', serviceName: 'qwen-plus', level: 'L0', rpm: 800, tpm: 160000 },
  { id: '5', serviceName: 'qwen-plus', level: 'L1', rpm: 400, tpm: 80000 },
]

export default function RateLimit() {
  const [data, setData] = useState<RateLimitPolicy[]>(mockPolicies)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setEditingId(null)
    setModalOpen(true)
  }

  const handleEdit = (record: RateLimitPolicy) => {
    form.setFieldsValue({
      serviceName: record.serviceName,
      level: record.level,
      rpm: record.rpm,
      tpm: record.tpm,
    })
    setEditingId(record.id)
    setModalOpen(true)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingId) {
        setData((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...p, ...values }
              : p
          )
        )
      } else {
        setData((prev) => [
          ...prev,
          { id: String(Date.now()), ...values },
        ])
      }
      setModalOpen(false)
    })
  }

  const columns = [
    { title: '模型服务', dataIndex: 'serviceName', key: 'serviceName', width: 140 },
    { title: '服务等级', dataIndex: 'level', key: 'level', width: 100 },
    { title: 'RPM（每分钟请求数）', dataIndex: 'rpm', key: 'rpm', width: 160 },
    { title: 'TPM（每分钟 Token 数）', dataIndex: 'tpm', key: 'tpm', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: RateLimitPolicy) => (
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ]

  return (
    <>
      <Card
        title="限流策略"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加限流策略
          </Button>
        }
      >
        <p style={{ color: '#666', marginBottom: 16 }}>
          按服务等级（L0、L1、L2 等）为模型服务设定限流策略，可配置 RPM（每分钟请求数）和 TPM（每分钟 Token 数）。
        </p>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑限流策略' : '添加限流策略'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={480}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="serviceName" label="模型服务" rules={[{ required: true }]}>
            <Select
              options={MOCK_SERVICES.map((s) => ({ label: s, value: s }))}
              placeholder="请选择模型服务"
            />
          </Form.Item>
          <Form.Item name="level" label="服务等级" rules={[{ required: true }]}>
            <Select
              options={SERVICE_LEVELS.map((l) => ({ label: l, value: l }))}
              placeholder="如 L0、L1、L2"
            />
          </Form.Item>
          <Form.Item name="rpm" label="RPM（每分钟请求数）" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="如 1000" />
          </Form.Item>
          <Form.Item name="tpm" label="TPM（每分钟 Token 数）" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="如 200000" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
