import { NavLink, Outlet } from 'react-router-dom'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const navItems = [
  { to: '/', label: 'Início', icon: 'home', end: true },
  { to: '/treino', label: 'Treino', icon: 'treino' },
  { to: '/simulado', label: 'Simulado', icon: 'simulado' },
  { to: '/redacao', label: 'Redação', icon: 'redacao' },
  { to: '/dashboard', label: 'Progresso', icon: 'dashboard' },
]

function Icon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'home':
      return (<svg {...common}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>)
    case 'treino':
      return (<svg {...common}><path d="M4 19h16" /><path d="M6 19V9l6-4 6 4v10" /></svg>)
    case 'simulado':
      return (<svg {...common}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M9 2h6" /></svg>)
    case 'redacao':
      return (<svg {...common}><path d="M5 4h11l3 3v13H5z" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>)
    case 'dashboard':
      return (<svg {...common}><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></svg>)
    default:
      return null
  }
}

export function Layout() {
  const online = useOnlineStatus()
  return (
    <div className="app-shell">
      <header className="topbar" role="banner">
        <NavLink to="/" className="brand" aria-label="Página inicial">
          <span className="brand-mark" aria-hidden="true">CM</span>
          <span className="brand-text">Simulado CMRJ 2026/2027</span>
        </NavLink>
        <span className={`status-pill ${online ? 'online' : 'offline'}`} role="status" aria-live="polite">
          <span className="dot" aria-hidden="true" />
          {online ? 'Online' : 'Offline'}
        </span>
      </header>

      <main id="conteudo" className="content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="disclaimer" role="contentinfo">
        Plataforma independente de estudos. Não possui vínculo oficial com o Colégio Militar do Rio de Janeiro ou com o Exército Brasileiro.
      </footer>

      <nav className="bottom-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
