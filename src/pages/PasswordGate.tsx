import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

export default function PasswordGate() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const onFinish = (values: { password: string }) => {
    setLoading(true)
    const ok = login(values.password)
    setLoading(false)
    if (!ok) {
      message.error('密码错误，请重试')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        bodyStyle={{ padding: '32px 24px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <LockOutlined style={{ fontSize: 48, color: '#667eea', marginBottom: 16 }} />
          <Title level={4} style={{ margin: '0 0 8px' }}>
            请输入访问密码
          </Title>
          <Text type="secondary">大模型网关与 Multi-LoRA 演示系统</Text>
        </div>
        <Form
          name="password-gate"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              placeholder="请输入站点密码"
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              autoFocus
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              进入站点
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
