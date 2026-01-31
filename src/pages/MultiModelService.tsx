import { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Select, Flex } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useModelServices } from '../context/ModelServicesContext'

export interface UnifiedService {
  id: string
  serviceName: string
  models: { modelId: string; displayName: string }[]
}

type FormInitialValues = { serviceName: string; models: { modelId: string; displayName: string }[] }

const initialUnifiedServices: UnifiedService[] = [
  {
    id: '1',
    serviceName: 'deepseek-chat',
    models: [
      { modelId: 'deepseek-chat', displayName: 'DeepSeek-V3' },
      { modelId: 'qwen-plus', displayName: 'Qwen2.5-72B' },
    ],
  },
  {
    id: '2',
    serviceName: 'qwen-plus',
    models: [
      { modelId: 'deepseek-chat', displayName: 'DeepSeek-V3' },
      { modelId: 'qwen-plus', displayName: 'Qwen2.5-72B' },
    ],
  },
]

export default function MultiModelService() {
  const { list: modelServicesList } = useModelServices()
  const [data, setData] = useState<UnifiedService[]>(initialUnifiedServices)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()
  /** 弹窗打开时的表单初始值，配合 key 让 Form 挂载时即有正确数据，避免编辑时为空 */
  const [formInitialValues, setFormInitialValues] = useState<FormInitialValues | null>(null)

  const handleAdd = () => {
    setFormInitialValues({
      serviceName: modelServicesList[0]?.name ?? '',
      models: [{ modelId: '', displayName: '' }],
    })
    setEditingId(null)
    setModalOpen(true)
  }

  const handleEdit = (record: UnifiedService) => {
    setFormInitialValues({
      serviceName: record.serviceName,
      models:
        record.models.length > 0
          ? record.models
          : [{ modelId: '', displayName: '' }],
    })
    setEditingId(record.id)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setFormInitialValues(null)
  }

  /** 弹窗完全打开后再用 setFieldsValue 填一次，确保 Form.List 能正确显示（initialValues 在受控 form 下有时不生效） */
  const handleAfterOpenChange = (open: boolean) => {
    if (!open || !formInitialValues) return
    const timer = setTimeout(() => {
      form.setFieldsValue(formInitialValues)
    }, 50)
    return () => clearTimeout(timer)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const models = (values.models || []).filter(
        (m: { modelId?: string; displayName?: string }) => m?.modelId && m?.displayName
      )
      if (!models.length) return
      const payload = { serviceName: values.serviceName, models }
      if (editingId) {
        setData((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s))
        )
      } else {
        setData((prev) => [...prev, { id: String(Date.now()), ...payload }])
      }
      handleModalClose()
    })
  }

  const serviceNameOptions = modelServicesList.map((m) => ({
    label: `${m.name} (${m.spec})`,
    value: m.name,
  }))

  const modelOptions = modelServicesList.map((m) => ({
    label: `${m.name} (${m.spec})`,
    value: m.name,
  }))

  const columns = [
    { title: '模型服务名称（对外）', dataIndex: 'serviceName', key: 'serviceName', width: 200 },
    {
      title: '接入的模型',
      dataIndex: 'models',
      key: 'models',
      render: (list: { modelId: string; displayName: string }[]) =>
        (list || []).map((m) => (
          <span key={m.modelId} style={{ marginRight: 8 }}>
            {m.displayName} ({m.modelId})
          </span>
        )),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: UnifiedService) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="同一模型服务下多模型接入"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加模型服务
          </Button>
        }
      >
        <p style={{ color: '#666', marginBottom: 16 }}>
          模型服务名称与接入的模型均来自「模型服务管理」中的对外的模型名称。支持在同一模型服务下接入多个已登记的模型，对外统一入口。
        </p>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑模型服务' : '添加模型服务（多模型接入）'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        afterOpenChange={handleAfterOpenChange}
        width={560}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          key={editingId ?? 'add'}
          initialValues={formInitialValues ?? undefined}
          style={{ marginTop: 8 }}
        >
          <Form.Item
            name="serviceName"
            label="模型服务名称（与模型服务管理中的模型名称一致）"
            rules={[{ required: true, message: '请选择对外的模型名称' }]}
            style={{ marginBottom: 16 }}
          >
            <Select
              showSearch
              placeholder="请选择模型服务管理中的模型名称"
              options={serviceNameOptions}
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.List name="models">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Flex key={key} gap={12} align="center" style={{ marginBottom: 12 }}>
                    <Form.Item
                      {...rest}
                      name={[name, 'modelId']}
                      rules={[{ required: true, message: '请选择模型' }]}
                      style={{ marginBottom: 0, flex: 1, minWidth: 0 }}
                    >
                      <Select
                        showSearch
                        placeholder="从模型服务管理中选择模型"
                        options={modelOptions}
                        optionFilterProp="label"
                        onChange={(value) => {
                          const model = modelServicesList.find((m) => m.name === value)
                          if (model) {
                            form.setFieldValue(['models', name, 'modelId'], model.name)
                            form.setFieldValue(['models', name, 'displayName'], model.spec)
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'displayName']}
                      rules={[{ required: true, message: '显示名' }]}
                      hidden
                      style={{ marginBottom: 0, display: 'none' }}
                    >
                      <input type="hidden" />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      style={{ flexShrink: 0 }}
                    />
                  </Flex>
                ))}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="dashed" onClick={() => add()} block>
                    + 添加模型（从模型服务管理中选择）
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  )
}
