import { supabase, getRol, logout, getUsuarioActual } from './supabase.js'

const NAV_ADMIN = [
  { section: 'Principal', links: [{ id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: iconDashboard() }] },
  { section: 'Gestión', links: [
      { id: 'inventario', label: 'Inventario', href: 'inventario.html', icon: iconInventario() },
      { id: 'clientes', label: 'Clientes', href: 'clientes.html', icon: iconClientes() },
      { id: 'ventas', label: 'Ventas', href: 'ventas.html', icon: iconVentas() },
      { id: 'pedidos', label: 'Pedidos', href: 'pedidos.html', icon: iconPedidos() }
  ]},
  { section: 'Cuenta', links: [{ id: 'perfil', label: 'Mi Perfil', href: 'perfil.html', icon: iconPerfil() }] }
]

const NAV_DELIVERY = [
  { section: 'Mis pedidos', links: [{ id: 'pedidos', label: 'Pedidos del día', href: 'pedidos.html', icon: iconPedidos() }] },
  // NUEVA OPCIÓN PARA DELIVERY
  { section: 'Consulta', links: [{ id: 'inventario', label: 'Ver Productos', href: 'inventario-delivery.html', icon: iconInventario() }] },
  { section: 'Cuenta', links: [{ id: 'perfil', label: 'Mi Perfil', href: 'perfil.html', icon: iconPerfil() }] }
]

// 👇 ESTAS SON LAS 3 LÍNEAS QUE FALTABAN PARA QUE EL LOGO NO DE ERROR
const brandLogo = '../logo.png'
const brandName = 'FlorandoSur'
const brandTagline = 'GESTIÓN'

export async function renderSidebar() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 1. Consultar el perfil real en la base de datos (una sola vez)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  const rol = profile?.rol || 'delivery'
  const nombre = profile?.nombre || 'Usuario'
  const rolLabel = rol === 'admin' ? 'Administrador' : 'Delivery'
  const fotoUrl = profile?.foto_url || null

  // 2. Definir qué menú mostrar (¡Esta línea faltaba!)
  const nav = rol === 'admin' ? NAV_ADMIN : NAV_DELIVERY

  // 3. Detectar la página actual para pintar el botón de verde (¡Esta línea faltaba!)
  const paginaActiva = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard'

  const iniciales = nombre.slice(0, 2).toUpperCase()
  const navHtml = nav.map(group => `
    <p class="nav-section-label">${group.section}</p>
    ${group.links.map(link => `
      <a class="nav-link ${link.id === paginaActiva ? 'active' : ''}" href="${link.href}">
        <span class="nav-icon">${link.icon}</span> ${link.label}
      </a>
    `).join('')}
  `).join('')

  const sidebarHtml = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div style="width:80px; height:80px; margin-bottom:8px;">
          <img src="${brandLogo}" alt="Logo" style="width:100%; height:auto; object-fit:contain;">
        </div>
        <span class="wordmark">${brandName}</span>
        <span class="tagline">${brandTagline}</span>
      </div>
      <nav class="sidebar-nav">${navHtml}</nav>
      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="user-avatar" style="${fotoUrl ? `background-image: url('${fotoUrl}');` : ''}">${!fotoUrl ? iniciales : ''}</div>
          <div class="user-info">
            <div class="user-name">${nombre}</div>
            <div class="user-role">${rolLabel}</div>
          </div>
        </div>
        <button class="nav-link" id="btn-logout" style="margin-top:4px; color:var(--text-muted); font-size:13px;">
          <span class="nav-icon">${iconLogout()}</span> Cerrar sesión
        </button>
      </div>
    </aside>`

  const shell = document.querySelector('.app-shell')
  if (shell) {
    const old = shell.querySelector('.sidebar'); if (old) old.remove()
    shell.insertAdjacentHTML('afterbegin', sidebarHtml)
  }
  document.getElementById('btn-logout')?.addEventListener('click', logout)
  if (shell) shell.classList.add('ready')

  // 👇 MAGIA PARA MÓVILES: Agregar botón de menú (Hamburguesa)
  const topbar = document.querySelector('.topbar')
  if (topbar && !document.querySelector('.topbar-hamburger')) {
    const btnMenu = document.createElement('button')
    btnMenu.className = 'topbar-hamburger'
    btnMenu.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
    
    // Insertar el botón a la izquierda del título
    const pageTitle = topbar.querySelector('.page-title')
    if (pageTitle) topbar.insertBefore(btnMenu, pageTitle)
    else topbar.appendChild(btnMenu)

    // Evento para abrir y cerrar el panel lateral
    btnMenu.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar')
      if (sidebar) sidebar.classList.toggle('mobile-open')
    })

    // Evento para cerrar el panel si tocas afuera de él
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar')
      if (sidebar && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !btnMenu.contains(e.target)) {
        sidebar.classList.remove('mobile-open')
      }
    })
  }
}

// Iconos
function iconDashboard() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` }
function iconInventario() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>` }
function iconClientes() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` }
function iconVentas() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` }
function iconPedidos() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12H3l9-9 9 9h-2"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>` }
function iconPerfil() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` }
function iconLogout() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>` }