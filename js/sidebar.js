// ══════════════════════════════════════════════════════
//  FlorandoSur — Sidebar component
//  Uso: import { renderSidebar } from '../js/sidebar.js'
//       renderSidebar('inventario')   ← nombre de la página activa
// ══════════════════════════════════════════════════════

import { getRol, logout, getUsuarioActual } from './supabase.js'

const NAV_ADMIN = [
  {
    section: 'Principal',
    links: [
      { id: 'dashboard',  label: 'Dashboard',   href: 'dashboard.html',  icon: iconDashboard() },
    ]
  },
  {
    section: 'Gestión',
    links: [
      { id: 'inventario', label: 'Inventario',  href: 'inventario.html', icon: iconInventario() },
      { id: 'clientes',   label: 'Clientes',    href: 'clientes.html',   icon: iconClientes() },
      { id: 'ventas',     label: 'Ventas',      href: 'ventas.html',     icon: iconVentas() },
      { id: 'pedidos',    label: 'Pedidos',     href: 'pedidos.html',    icon: iconPedidos() },
    ]
  }
]

const NAV_DELIVERY = [
  {
    section: 'Mis pedidos',
    links: [
      { id: 'pedidos', label: 'Pedidos del día', href: 'pedidos.html', icon: iconPedidos() },
    ]
  }
]

export async function renderSidebar(paginaActiva = '', user = null) {
  // Si no pasamos el user, lo obtenemos (para compatibilidad hacia atrás)
  if (!user) user = await getUsuarioActual()
  const rol = user?.user_metadata?.rol ?? 'delivery'
  const nav = rol === 'admin' ? NAV_ADMIN : NAV_DELIVERY

  const nombre = user?.user_metadata?.nombre ?? user?.email?.split('@')[0] ?? 'Usuario'
  const iniciales = nombre.slice(0,2).toUpperCase()
  const rolLabel  = rol === 'admin' ? 'Administrador' : 'Delivery'

  const navHtml = nav.map(group => `
    <p class="nav-section-label">${group.section}</p>
    ${group.links.map(link => `
      <a class="nav-link ${link.id === paginaActiva ? 'active' : ''}" href="${link.href}">
        <span class="nav-icon">${link.icon}</span>
        ${link.label}
      </a>
    `).join('')}
  `).join('')

  const sidebarHtml = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div style="width:100px; height:100px; display:flex; align-items:center; justify-content:center; margin-bottom:8px;">
          <img src="../logo.png" alt="FlorandoSur" style="width:100%; height:auto; object-fit:contain; filter: drop-shadow(0 2px 8px rgba(255,20,147,0.3));">
        </div>
        <span class="wordmark" style="font-size:18px; letter-spacing:0.5px;">FlorandoSur</span>
        <span class="tagline" style="font-size:10px;">Gestión</span>
      </div>
      <nav class="sidebar-nav">
        ${navHtml}
      </nav>
      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar">${iniciales}</div>
          <div class="user-info">
            <div class="user-name">${nombre}</div>
            <div class="user-role">${rolLabel}</div>
          </div>
        </div>
        <button class="nav-link" id="btn-logout" style="margin-top:4px; color:var(--text-muted); font-size:13px;">
          <span class="nav-icon">${iconLogout()}</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  `

  // Insertar sidebar al inicio del app-shell
  const shell = document.querySelector('.app-shell')
  if (shell) shell.insertAdjacentHTML('afterbegin', sidebarHtml)

  // Botón logout
  document.getElementById('btn-logout')?.addEventListener('click', logout)

  // ─── Funcionalidad móvil ───
  const topbar = document.querySelector('.topbar')
  if (topbar) {
    const hamburgerHtml = `
      <div class="topbar-hamburger" id="btn-hamburger" title="Menú">
        ${iconHamburger()}
      </div>
    `
    // Insertar hamburguesa al inicio de topbar (antes del title)
    topbar.insertAdjacentHTML('afterbegin', hamburgerHtml)

    const hamburguerBtn = document.getElementById('btn-hamburger')
    const sidebar = document.querySelector('.sidebar')

    // Toggle menú
    hamburguerBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('mobile-open')
    })

    // Cerrar menú al hacer clic en un link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar?.classList.remove('mobile-open')
      })
    })

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!hamburguerBtn?.contains(e.target) && !sidebar?.contains(e.target)) {
        sidebar?.classList.remove('mobile-open')
      }
    })
  }

  // Mostrar la página cuando esté lista
  if (shell) shell.classList.add('ready')
}

// ── SVG Icons (inline, 16×16) ────────────────────────

function iconDashboard() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
}

function iconInventario() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
}

function iconClientes() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
}

function iconVentas() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
}

function iconPedidos() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H3l9-9 9 9h-2"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>`
}

function iconLogout() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`
}

function iconHamburger() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>`
}
