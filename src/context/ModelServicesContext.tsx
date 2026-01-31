import { createContext, useContext, useState, type ReactNode } from 'react'

export interface ModelService {
  id: string
  name: string
  type: string
  vendor: string
  contextLength: number
  spec: string
  capabilities: string[]
}

const initialData: ModelService[] = [
  {
    id: '1',
    name: 'deepseek-chat',
    type: 'Chat',
    vendor: 'DeepSeek',
    contextLength: 128000,
    spec: 'DeepSeek-V3',
    capabilities: ['多轮对话', '长文本', '代码生成', '流式输出'],
  },
  {
    id: '2',
    name: 'qwen-plus',
    type: 'Chat',
    vendor: 'Qwen',
    contextLength: 32000,
    spec: 'Qwen2.5-72B',
    capabilities: ['多轮对话', '函数调用', '流式输出'],
  },
]

type ModelServicesContextValue = {
  list: ModelService[]
  setList: React.Dispatch<React.SetStateAction<ModelService[]>>
}

const ModelServicesContext = createContext<ModelServicesContextValue | null>(null)

export function ModelServicesProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<ModelService[]>(initialData)
  return (
    <ModelServicesContext.Provider value={{ list, setList }}>
      {children}
    </ModelServicesContext.Provider>
  )
}

export function useModelServices() {
  const ctx = useContext(ModelServicesContext)
  if (!ctx) throw new Error('useModelServices must be used within ModelServicesProvider')
  return ctx
}
