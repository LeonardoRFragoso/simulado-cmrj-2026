import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import {
  TreinoRapidoSetupPage,
  TreinoRapidoConfigPage,
  TreinoRapidoRunPage,
  TreinoAssuntoSetupPage,
  TreinoAssuntoListPage,
  TreinoAssuntoRunPage,
} from './pages/TreinoPages'
import { TreinoResultPage } from './pages/TreinoResultPage'
import { SimuladoSetupPage, SimuladoRunPage, SimuladoResultPage } from './pages/SimuladoPages'
import { RedacaoPage } from './pages/RedacaoPage'
import { ProvasAnterioresPage } from './pages/ProvasAnterioresPage'
import { RevisaoPage } from './pages/RevisaoPage'
import { CadernoDeErrosPage } from './pages/CadernoDeErrosPage'
import { DashboardPage } from './pages/DashboardPage'
import { useProgress } from './hooks/useProgress'
import { updateSettings } from './stores/progress'
import './styles.css'

function ScrollToContent() {
  const { pathname } = useLocation()
  useEffect(() => {
    const el = document.getElementById('conteudo')
    if (el) el.focus()
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ThemeApplier() {
  const progress = useProgress()
  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const theme = progress.settings.theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = theme === 'escuro' || (theme === 'sistema' && prefersDark)
      root.setAttribute('data-theme', dark ? 'escuro' : 'claro')
    }
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [progress.settings.theme])

  // respeita prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => updateSettings({ reducedMotion: mq.matches })
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return null
}

function NotFoundPage() {
  return (
    <div className="page">
      <h1>Página não encontrada</h1>
      <p>O endereço que você acessou não existe.</p>
      <a href="/" className="link-btn">Voltar ao início</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeApplier />
      <ScrollToContent />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="treino" element={<TreinoRapidoSetupPage />} />
          <Route path="treino/rapido" element={<TreinoRapidoSetupPage />} />
          <Route path="treino/rapido/:subject" element={<TreinoRapidoConfigPage />} />
          <Route path="treino/rapido/:subject/:qty" element={<TreinoRapidoRunPage />} />
          <Route path="treino/rapido/:subject/:qty/resultado" element={<TreinoResultPage />} />
          <Route path="treino/assunto" element={<TreinoAssuntoSetupPage />} />
          <Route path="treino/assunto/:subject" element={<TreinoAssuntoListPage />} />
          <Route path="treino/assunto/:subject/:topic" element={<TreinoAssuntoRunPage />} />
          <Route path="treino/assunto/:subject/:topic/resultado" element={<TreinoResultPage />} />
          <Route path="simulado" element={<SimuladoSetupPage />} />
          <Route path="simulado/prova" element={<SimuladoRunPage />} />
          <Route path="simulado/resultado" element={<SimuladoResultPage />} />
          <Route path="redacao" element={<RedacaoPage />} />
          <Route path="provas-anteriores" element={<ProvasAnterioresPage />} />
          <Route path="revisao" element={<RevisaoPage />} />
          <Route path="caderno-de-erros" element={<CadernoDeErrosPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
