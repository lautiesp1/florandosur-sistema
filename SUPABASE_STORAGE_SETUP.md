## 🗄️ Configuración de Supabase Storage para Imágenes

Para que el sistema de imágenes funcione correctamente, necesitas crear un bucket en Supabase Storage.

### Pasos:

1. **Accedé al Dashboard de Supabase**
   - Ve a https://app.supabase.com
   - Seleccioná tu proyecto "FlorandoSur"

2. **Creá el bucket**
   - Ve a la sección **Storage** (izquierda)
   - Click en **"Create a new bucket"**
   - Nombre: `producto-imagenes`
   - Habilita "Public bucket" (importante para que las imágenes sean públicas)
   - Click en "Create bucket"

3. **Configurá RLS (Row Level Security) - IMPORTANTE**
   - Ve a **Storage** → **Policies**
   - Busca el bucket `producto-imagenes`
   - Click en **"Create Policy"**
   - Selecciona:
     - **"For SELECT"** (allow authenticated users to read)
     - Apply to: `producto-imagenes`
     - Write the policy: Deja los valores por defecto o simplifica a:
       ```
       (SELECT auth.uid() IS NOT NULL)
       ```
   - Click en **"Review"** → **"Save policy"**

4. **Verificá la configuración**
   - En **Storage Settings**, asegyurate que:
     - ✅ Bucket es **PUBLIC**
     - ✅ Las políticas permiten lectura
     - ✅ El bucket tiene el nombre exacto `producto-imagenes`

### Cómo funciona:

- **Subida**: Los usuarios autenticados suben imágenes
- **Almacenamiento**: Las imágenes se guardan como WebP optimizado (max 500KB)
- **URL**: Se guarda la URL pública en la columna `imagen_url` de productos
- **Visualización**: En el detalle del producto, se carga directamente desde Storage

### Límites:

- **Tamaño máximo de archivo original**: 10MB
- **Tamaño optimizado**: ~500KB (incluye compresión WebP)
- **Dimensiones máximas**: 800x800px
- **Espacios economia**: ✅ Supabase Storage es ilimitado
- **Ancho de banda**: ✅ Supabase Storage incluye banda ancha generosa

### Troubleshooting:

**Error "Bucket not found"**
- Verifica que el nombre del bucket sea exactamente: `producto-imagenes`
- La ortografía debe coincidir exactamente

**Las imágenes no cargan**
- Asegurate que el bucket es PUBLIC
- Verifica las políticas RLS permiten SELECT

**Error "Permission denied"**
- Configura una política que permita a usuarios autenticados subir

---

**Nota**: Una vez configurado, ya no necesitas volver a tocar esto. ¡Las imágenes se subirán y optimizarán automáticamente!
