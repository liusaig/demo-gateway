import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ModelServicesProvider } from './context/ModelServicesContext'
import Layout from './layout/Layout'
import PasswordGate from './pages/PasswordGate'
import ModelServices from './pages/ModelServices'
import RateLimit from './pages/RateLimit'
import ChannelModels from './pages/ChannelModels'
import MultiModelService from './pages/MultiModelService'
import Observability from './pages/Observability'
import MultiLoRA from './pages/MultiLoRA'

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <PasswordGate />
  }
  return (
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
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
