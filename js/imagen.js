// ══════════════════════════════════════════════════════
//  FlorandoSur — Optimización y Gestión de Imágenes
// ══════════════════════════════════════════════════════

import { supabase } from './supabase.js'

/**
 * Optimiza una imagen antes de subirla
 * - Comprime el archivo
 * - Redimensiona si es muy grande
 * - Convierte a WebP si es posible
 * 
 * @param {File} file - Archivo de imagen
 * @param {Object} opciones - {maxWidth, maxHeight, quality, maxSizeKB}
 * @returns {Promise<Blob>} Imagen optimizada
 */
export async function optimizarImagen(file, opciones = {}) {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85,
    maxSizeKB = 500
  } = opciones

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let ancho = img.width
        let alto = img.height
        
        if (ancho > maxWidth || alto > maxHeight) {
          const ratio = Math.min(maxWidth / ancho, maxHeight / alto)
          ancho = Math.round(ancho * ratio)
          alto = Math.round(alto * ratio)
        }

        // Crear canvas y dibujar imagen escalada
        const canvas = document.createElement('canvas')
        canvas.width = ancho
        canvas.height = alto
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, ancho, alto)

        // Convertir a blob con calidad específica
        canvas.toBlob(
          (blob) => {
            // Verificar tamaño
            const sizeMB = blob.size / 1024 / 1024
            if (sizeMB > maxSizeKB / 1024) {
              console.warn(`⚠️ Imagen optimizada aún es muy grande: ${(sizeMB * 1024).toFixed(0)}KB`)
            }
            resolve(blob)
          },
          'image/webp',
          quality
        )
      }
      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Error al leer archivo'))
    reader.readAsDataURL(file)
  })
}

/**
 * Sube una imagen a Supabase Storage
 * Usa el ID del producto como nombre único
 * 
 * @param {Blob} blob - Imagen optimizada
 * @param {string} productoId - ID del producto
 * @returns {Promise<string>} URL pública de la imagen
 */
export async function subirImagenSupabase(blob, productoId) {
  if (!blob || !productoId) {
    throw new Error('Blob y productoId son requeridos')
  }

  const nombreArchivo = `${productoId}-${Date.now()}.webp`
  const { data, error } = await supabase.storage
    .from('producto-imagenes')
    .upload(nombreArchivo, blob, {
      contentType: 'image/webp',
      upsert: true
    })

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`)
  }

  // Obtener URL pública
  const { data: publico } = supabase.storage
    .from('producto-imagenes')
    .getPublicUrl(nombreArchivo)

  return publico.publicUrl
}

/**
 * Procesa y sube una imagen en un paso
 * 
 * @param {File} file - Archivo de imagen original
 * @param {string} productoId - ID del producto
 * @param {Object} opciones - Opciones de optimización
 * @returns {Promise<string>} URL pública final
 */
export async function procesarYSubirImagen(file, productoId, opciones = {}) {
  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  // Limitar por tamaño original (máx 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('La imagen es demasiado grande (máx 10MB)')
  }

  // Optimizar
  const imagenOptimizada = await optimizarImagen(file, opciones)
  
  // Subir
  const urlPublica = await subirImagenSupabase(imagenOptimizada, productoId)
  
  return urlPublica
}

/**
 * Obtiene el tamaño de archivo en formato legible
 * @param {number} bytes 
 * @returns {string}
 */
export function formatearTamano(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Obtiene información sobre optimización realizada (para mostrar al usuario)
 * @param {File} original - Archivo original
 * @param {Blob} optimizada - Imagen optimizada
 * @returns {string} Mensaje descriptivo
 */
export function obtenerMensajeOptimizacion(original, optimizada) {
  const ratioCompresion = ((1 - optimizada.size / original.size) * 100).toFixed(1)
  return `Optimizado: ${formatearTamano(original.size)} → ${formatearTamano(optimizada.size)} (${ratioCompresion}% reducción)`
}
