import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useModelServices, type ModelService } from '../context/ModelServicesContext'

const MODEL_TYPES = ['Chat', 'Embedding', 'Rerank', 'Image']
const VENDORS = ['DeepSeek', 'Qwen', 'OpenAI', 'Anthropic', '智谱', '百川']
const CAPABILITIES = ['多轮对话', '长文本', '代码生成', '函数调用', '流式输出', '视觉']

export default function ModelServices() {
  const { list: data, setList: setData } = useModelServices()
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newRow: ModelService = {
        id: String(Date.now()),
        name: values.name,
        type: values.type,
        vendor: values.vendor,
        contextLength: values.contextLength,
        spec: values.spec,
        capabilities: values.capabilities || [],
      }
      setData((prev) => [...prev, newRow])
      setModalOpen(false)
    })
  }

  const columns = [
    { title: '模型名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: '模型类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '模型厂商', dataIndex: 'vendor', key: 'vendor', width: 100 },
    {
      title: '上下文长度',
      dataIndex: 'contextLength',
      key: 'contextLength',
      width: 120,
      render: (v: number) => v?.toLocaleString(),
    },
    { title: '模型规格', dataIndex: 'spec', key: 'spec', width: 140 },
    {
      title: '特性能力',
      dataIndex: 'capabilities',
      key: 'capabilities',
      render: (list: string[]) =>
        (list || []).map((c) => <Tag key={c}>{c}</Tag>),
    },
  ]

  return (
    <>
      <Card
        title="模型服务管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加模型服务
          </Button>
        }
      >
        <p style={{ color: '#666', marginBottom: 16 }}>
          支持可视化添加模型服务，可配置：模型名称、模型类型、模型厂商、上下文长度、模型规格、特性能力。此处配置的模型名称即为对外的模型名称。
        </p>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="添加模型服务"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="name" label="模型名称（对外）" rules={[{ required: true }]}>
            <Input placeholder="如 deepseek-chat" />
          </Form.Item>
          <Form.Item name="type" label="模型类型" rules={[{ required: true }]}>
            <Select options={MODEL_TYPES.map((t) => ({ label: t, value: t }))} placeholder="请选择" />
          </Form.Item>
          <Form.Item name="vendor" label="模型厂商" rules={[{ required: true }]}>
            <Select options={VENDORS.map((v) => ({ label: v, value: v }))} placeholder="请选择" />
          </Form.Item>
          <Form.Item name="contextLength" label="上下文长度" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="如 128000" />
          </Form.Item>
          <Form.Item name="spec" label="模型规格" rules={[{ required: true }]}>
            <Input placeholder="如 DeepSeek-V3" />
          </Form.Item>
          <Form.Item name="capabilities" label="特性能力">
            <Select
              mode="multiple"
              options={CAPABILITIES.map((c) => ({ label: c, value: c }))}
              placeholder="请选择"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
