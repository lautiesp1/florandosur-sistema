// ══════════════════════════════════════════════════════
//  FlorandoSur — Supabase Config
//  ⚠️  Reemplazá SUPABASE_URL y SUPABASE_KEY con tus valores
//     Los encontrás en: Supabase > Project Settings > API
// ══════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/v128/@supabase/supabase-js@2.38.4'

const SUPABASE_URL = 'https://vvazpmmhfpcfymlzkphi.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_pSgYmHZmSRnMtuMNIaOj_Q_eZJ_4rli'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Helpers de auth ──────────────────────────────────

export async function getUsuarioActual() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getRol() {
  const user = await getUsuarioActual()
  if (!user) return 'delivery'
  
  // Leer rol desde tabla profiles (más confiable)
  const { data, error } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()
  
  if (error || !data) {
    // Fallback a user_metadata si no existe en profiles
    return user?.user_metadata?.rol ?? 'delivery'
  }
  
  return data.rol ?? 'delivery'
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = '/index.html'
}

// ── Redirigir si no hay sesión ───────────────────────

export async function requiereAuth() {
  const user = await getUsuarioActual()
  if (!user) window.location.href = '/index.html'
  return user
}

// ── Toast helper ─────────────────────────────────────

export function toast(mensaje, tipo = 'default') {
  const container = document.getElementById('toast-container')
  if (!container) return
  const el = document.createElement('div')
  el.className = `toast ${tipo}`
  el.textContent = mensaje
  container.appendChild(el)
  setTimeout(() => el.remove(), 3500)
}

// ── Modal Custom Confirm ─────────────────────────────

export function confirmar(mensaje, titulo = '¿Confirmar?') {
  return new Promise((resolve) => {
    // Crear overlay y modal
    const overlay = document.createElement('div')
    overlay.className = 'confirm-dialog-overlay'
    
    const dialog = document.createElement('div')
    dialog.className = 'confirm-dialog'
    
    dialog.innerHTML = `
      <div class="confirm-dialog-title">${titulo}</div>
      <div class="confirm-dialog-message">${mensaje}</div>
      <div class="confirm-dialog-buttons">
        <button class="btn btn-ghost" id="btn-cancel">Cancelar</button>
        <button class="btn btn-primary" id="btn-confirm">Confirmar</button>
      </div>
    `
    
    overlay.appendChild(dialog)
    document.body.appendChild(overlay)
    
    const btnConfirm = dialog.querySelector('#btn-confirm')
    const btnCancel = dialog.querySelector('#btn-cancel')
    
    const cleanup = () => overlay.remove()
    
    btnConfirm.addEventListener('click', () => {
      cleanup()
      resolve(true)
    })
    
    btnCancel.addEventListener('click', () => {
      cleanup()
      resolve(false)
    })
    
    // Cerrar con ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handleEsc)
        cleanup()
        resolve(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
  })
}
