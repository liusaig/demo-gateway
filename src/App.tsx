import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ModelServicesProvider } from './context/ModelServicesContext'
import Layout from './layout/Layout'
import ModelServices from './pages/ModelServices'
import RateLimit from './pages/RateLimit'
import ChannelModels from './pages/ChannelModels'
import MultiModelService from './pages/MultiModelService'
import Observability from './pages/Observability'
import MultiLoRA from './pages/MultiLoRA'

function App() {
  return (
    <BrowserRouter>
      <ModelServicesProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/gateway/models" replace />} />
          <Route path="gateway/models" element={<ModelServices />} />
          <Route path="gateway/rate-limit" element={<RateLimit />} />
          <Route path="gateway/channels" element={<ChannelModels />} />
          <Route path="gateway/multi-model" element={<MultiModelService />} />
          <Route path="gateway/observability" element={<Observability />} />
          <Route path="lora" element={<MultiLoRA />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ModelServicesProvider>
    </BrowserRouter>
  )
}

export default App
