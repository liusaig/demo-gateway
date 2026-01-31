import { useState } from 'react'
import { Card, Row, Col, Select, DatePicker, Space, Statistic, Table } from 'antd'
import { Line } from '@ant-design/charts'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

// 模拟时间序列数据
const genTimeSeries = (base: number, variance: number, points = 24) =>
  Array.from({ length: points }, (_, i) => ({
    time: dayjs().subtract(points - i, 'hour').format('HH:mm'),
    value: Math.round(base + Math.random() * variance),
  }))

const mockCallVolume = genTimeSeries(800, 200)
const mockFailureRate = genTimeSeries(2, 1.5).map((d) => ({ ...d, value: d.value / 10 }))
const mockTTFT = genTimeSeries(400, 150)
const mockOTPS = genTimeSeries(1200, 300)
const mockTPOT = genTimeSeries(80, 30)
const mockLatency = genTimeSeries(1200, 400)
const mockTPM = genTimeSeries(50000, 20000)

const lineConfig = (title: string, unit = '') => ({
  data: [],
  xField: 'time',
  yField: 'value',
  smooth: true,
  animation: { appear: { duration: 500 } },
  xAxis: { label: { autoRotate: true } },
  yAxis: { title: { text: unit } },
  meta: { time: { alias: '时间' }, value: { alias: title } },
})

export default function Observability() {
  const [org, setOrg] = useState<string>('全部组织')
  const [service, setService] = useState<string>('全部模型服务')
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(24, 'hour'),
    dayjs(),
  ])

  const callVolumeConfig = {
    ...lineConfig('调用次数', '次'),
    data: mockCallVolume,
  }
  const failureRateConfig = {
    ...lineConfig('失败率', '%'),
    data: mockFailureRate,
  }
  const ttftConfig = {
    ...lineConfig('TTFT 均值', 'ms'),
    data: mockTTFT,
  }
  const otpsConfig = {
    ...lineConfig('OTPS 均值', 'tokens/s'),
    data: mockOTPS,
  }
  const tpotConfig = {
    ...lineConfig('TPOT 均值', 'ms'),
    data: mockTPOT,
  }
  const latencyConfig = {
    ...lineConfig('端到端延迟', 'ms'),
    data: mockLatency,
  }
  const tpmConfig = {
    ...lineConfig('TPM', 'tokens/min'),
    data: mockTPM,
  }

  const summaryData = [
    { label: '调用次数', value: 19234 },
    { label: '失败次数', value: 128 },
    { label: '失败率', value: '0.66%' },
    { label: '总 Token', value: '2.1M' },
    { label: '输入 Token', value: '1.2M' },
    { label: '输出 Token', value: '0.9M' },
  ]

  const perfColumns = [
    { title: '指标', dataIndex: 'metric', key: 'metric', width: 140 },
    { title: '均值', dataIndex: 'avg', key: 'avg', width: 100 },
    { title: 'P50', dataIndex: 'p50', key: 'p50', width: 90 },
    { title: 'P90', dataIndex: 'p90', key: 'p90', width: 90 },
    { title: 'P95', dataIndex: 'p95', key: 'p95', width: 90 },
    { title: 'P99', dataIndex: 'p99', key: 'p99', width: 90 },
  ]
  const perfData = [
    { metric: 'TTFT (ms)', avg: 412, p50: 380, p90: 520, p95: 580, p99: 720 },
    { metric: 'OTPS (tokens/s)', avg: 1250, p50: 1180, p90: 1420, p95: 1500, p99: 1680 },
    { metric: 'TPOT (ms)', avg: 85, p50: 78, p90: 110, p95: 125, p99: 160 },
    { metric: '端到端延迟 (ms)', avg: 1280, p50: 1150, p90: 1650, p95: 1820, p99: 2100 },
    { metric: 'TPM', avg: 52000, p50: 48000, p90: 62000, p95: 68000, p99: 75000 },
  ]

  return (
    <>
      <Card title="观测大盘">
        <p style={{ color: '#666', marginBottom: 16 }}>
          对模型服务的调用量指标与性能指标进行全面观测。支持按时间间隔展示趋势图，支持按组织、模型服务维度筛选。
        </p>

        <Space style={{ marginBottom: 24 }} wrap>
          <span>组织：</span>
          <Select
            value={org}
            onChange={setOrg}
            style={{ width: 160 }}
            options={[
              { label: '全部组织', value: '全部组织' },
              { label: '组织A', value: '组织A' },
              { label: '组织B', value: '组织B' },
            ]}
          />
          <span>模型服务：</span>
          <Select
            value={service}
            onChange={setService}
            style={{ width: 200 }}
            options={[
              { label: '全部模型服务', value: '全部模型服务' },
              { label: 'deepseek-chat', value: 'deepseek-chat' },
              { label: 'qwen-plus', value: 'qwen-plus' },
            ]}
          />
          <span>时间范围：</span>
          <RangePicker
            value={range}
            onChange={(v) => setRange(v as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            showTime
          />
        </Space>

        <Card size="small" title="调用量指标概览" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            {summaryData.map((s) => (
              <Col key={s.label} span={4}>
                <Statistic title={s.label} value={s.value} />
              </Col>
            ))}
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small" title="调用次数趋势">
              <Line {...callVolumeConfig} height={220} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="失败率趋势">
              <Line {...failureRateConfig} height={220} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="TTFT 趋势（均值）">
              <Line {...ttftConfig} height={220} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="OTPS 趋势（均值）">
              <Line {...otpsConfig} height={220} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="TPOT 趋势（均值）">
              <Line {...tpotConfig} height={220} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="端到端延迟趋势">
              <Line {...latencyConfig} height={220} />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="TPM 趋势">
              <Line {...tpmConfig} height={220} />
            </Card>
          </Col>
        </Row>

        <Card size="small" title="性能指标汇总（TTFT / OTPS / TPOT / 端到端延迟 / TPM 的均值、P99、P95、P90、P50）" style={{ marginTop: 24 }}>
          <Table
            rowKey="metric"
            columns={perfColumns}
            dataSource={perfData}
            pagination={false}
            size="small"
          />
        </Card>
      </Card>
    </>
  )
}
