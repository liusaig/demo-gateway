import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Typography } from 'antd'
import {
  ApiOutlined,
  ThunderboltOutlined,
  PartitionOutlined,
  ClusterOutlined,
  BarChartOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = AntLayout
const { Title } = Typography

const gatewayItems = [
  { key: '/gateway/models', icon: <ApiOutlined />, label: '模型服务管理' },
  { key: '/gateway/rate-limit', icon: <ThunderboltOutlined />, label: '限流策略' },
  { key: '/gateway/channels', icon: <PartitionOutlined />, label: '渠道模型' },
  { key: '/gateway/multi-model', icon: <ClusterOutlined />, label: '多模型接入' },
  { key: '/gateway/observability', icon: <BarChartOutlined />, label: '观测大盘' },
]
const loraItems = [
  { key: '/lora', icon: <ExperimentOutlined />, label: 'Multi-LoRA' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={240}
      >
        <div style={{ height: 48, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
          <Title level={5} style={{ color: '#fff', margin: 0 }}>
            {collapsed ? '演示' : '大模型网关演示'}
          </Title>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={[
            { type: 'group', label: '大模型网关', children: gatewayItems },
            { type: 'group', label: 'Multi-LoRA', children: loraItems },
          ]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={5} style={{ margin: 0, lineHeight: '64px' }}>
            大模型网关与 Multi-LoRA 演示系统
          </Title>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}
