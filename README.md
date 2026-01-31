# 大模型网关与 Multi-LoRA 演示系统

演示 Demo 系统，覆盖大模型网关与 Multi-LoRA 能力评审要点。

## 功能清单

### 大模型网关

1. **模型服务管理（最高 6 分）**  
   支持可视化添加模型服务，可配置：  
   模型名称、模型类型、模型厂商、上下文长度、模型规格、特性能力。

2. **限流策略（3 分）**  
   支持按服务等级（L0、L1、L2 等）为模型服务设定限流策略，可配置 RPM（每分钟请求数）和 TPM（每分钟 Token 数）。

3. **渠道模型与流量权重（3 分）**  
   支持可视化添加渠道模型（如不同渠道的 DeepSeek 服务），并为不同渠道设置流量权重。

4. **同一模型服务下多模型接入（3 分）**  
   支持在同一模型服务下接入多个模型（如 DeepSeek 与 Qwen2.5-72B 统一接入同一服务）。

5. **观测大盘（5 分）**  
   - 调用量指标：调用次数、失败次数、失败率、调用总/输入/输出 Token 量。  
   - 性能指标：TTFT、OTPS、TPOT、端到端延迟、TPM（均值、P99、P95、P90、P50）。  
   - 支持按时间间隔展示指标趋势图，支持按组织、模型服务维度筛选。

### Multi-LoRA

1. **多 LoRA 适配器（3 分）**  
   支持同时加载、卸载、切换多个 LoRA 适配器（≥5 个）。

2. **动态切换模式（2 分）**  
   支持一次仅激活一个 LoRA 的动态切换模式。

## 运行方式

```bash
cd demo-gateway
npm install
npm run dev
```

浏览器访问：`http://localhost:5173`（或终端提示的地址）。

## 技术栈

- React 19 + TypeScript + Vite  
- Ant Design 5 + @ant-design/charts  
- React Router 7  
- dayjs  

## 构建

```bash
npm run build
npm run preview  # 预览生产构建
```
