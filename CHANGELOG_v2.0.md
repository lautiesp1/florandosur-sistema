# 🎉 FlorandoSur v2.0 - Actualización Completa

## ✅ Cambios Implementados

### 1. **Actualización del Schema de Base de Datos**
- ✅ Tabla `profiles` - Gestión de perfiles de usuario con foto de perfil
- ✅ Nuevos campos en `productos`:
  - `precio_costo` - Precio de costo (para margen de ganancia)
  - `precio_venta` - Precio de venta (reemplaza al antiguo `precio`)
  - `marca` - Marca del producto
  - `genetica` - Array de genéticas (para productos específicos)
  - `sabor` - Array de sabores
  - `cantidad` - Cantidad disponible
  - `unidad` - Unidad de medida (ml, gr, L, etc.)

- ✅ Nuevos campos en `ventas`:
  - `descuento` - Monto de descuento aplicado
  - `tipo_descuento` - Tipo: "porcentaje", "fijo", o "promocion"
  - `precio_final` - Precio final calculado
  - `usuario_id` - ID del usuario que registró la venta

- ✅ Campo adicional en `detalle_ventas`:
  - `descuento_item` - Descuento aplicado a cada ítem

- ✅ Nuevos campos en `pedidos`:
  - `usuario_delivery_id` - ID del delivery asignado
  - `telefono_entrega` - Teléfono del destino
  - `productos_json` - JSON con productos seleccionados
  - `total` - Total del pedido

### 2. **Seguridad - Row Level Security (RLS)**
✅ Políticas granulares por rol:
- **Admin**: Acceso total a todas las tablas
- **Delivery**: 
  - SELECT en `productos` (lectura de inventario)
  - SELECT en `clientes` (lectura de datos)
  - SELECT/UPDATE en `pedidos` asignados
  - SIN acceso a `ventas`, `detalle_ventas`

### 3. **Página de Perfil de Usuario - Mi Perfil**
**Archivo**: `pages/perfil.html`
- ✅ Edición de nombre, teléfono
- ✅ Cambio de foto de perfil (upload a Supabase Storage)
- ✅ Visualización del rol
- ✅ Vinculación automática con tabla `profiles`
- ✅ Sincronización de datos en tiempo real

### 4. **Módulo de Inventario - Versión 2.0**
**Archivo**: `pages/inventario.html`
- ✅ Nuevos campos en formulario:
  - Marca
  - Precio de costo y precio de venta
  - Genética (array separado por comas)
  - Sabor (array separado por comas)
  - Cantidad y Unidad de medida
  
- ✅ Validación: Precio de venta ≥ Precio de costo
- ✅ Tabla actualizada para mostrar `precio_venta`

### 5. **Vista Inventario para Delivery (Lectura)**
**Archivo**: `pages/inventario-delivery.html`
- ✅ Vista **solo lectura** del inventario
- ✅ Visualización de: nombre, categoría, marca, atributos, precio y stock
- ✅ Búsqueda avanzada (por nombre, genética, sabor, etc.)
- ✅ Protegida por RLS (Delivery solo puede hacer SELECT)

### 6. **Sistema de Ventas Mejorado**
**Archivo**: `pages/ventas.html`
- ✅ **Edición de ventas**: Modifica sales existentes completas
- ✅ **Eliminación de ventas**: Elimina registros con confirmación
- ✅ **Sistema de descuentos dinámicos**:
  - Tipo: Porcentaje (%), monto fijo ($), o promoción
  - Cálculo automático en tiempo real
  - Visualización de: Subtotal → Descuento → Total final
  
- ✅ **Filtrado avanzado por rango de fechas**:
  - Campo "Desde" y "Hasta"
  - Botón "Limpiar filtros" para reset
  
- ✅ **Tabla mejorada**: 
  - Botones de editar y eliminar en cada venta
  - Visualización clara de descuentos aplicados

### 7. **Módulo de Pedidos - Drag & Drop**
**Archivo**: `pages/pedidos.html`
- ✅ **Interfaz de dos paneles**:
  - Panel izquierdo: Productos disponibles (draggables)
  - Panel derecho: Zona de drop para seleccionar
  
- ✅ **Drag & Drop funcional**:
  - Arrastra productos desde la lista disponible
  - Suelta en la zona de seleccionados
  - Visualización de: Genética, Sabor, Cantidad disponible
  - Botones × para remover productos seleccionados
  
- ✅ **Campos adicionales**:
  - Teléfono de entrega (nuevo)
  - Productos_json almacena datos del pedido

### 8. **Integración WhatsApp Business**
**Archivo**: `pages/clientes.html`
- ✅ **Botón WhatsApp en tabla de clientes**:
  - Enlace `wa.me/{numero}` automático
  - Extrae número telefónico y lo formatea (sin caracteres especiales)
  - Abre WhatsApp Business directamente
  - Prefijo +54 (Argentina) incluido
  - Mensaje personalizado con saludo al cliente
  
- ✅ **Disponible también en `pages/pedidos.html`** (para Delivery)

### 9. **Actualización del Sidebar**
**Archivo**: `js/sidebar.js`
- ✅ Nueva sección "Cuenta" con link a "Mi Perfil"
- ✅ Icono de usuario para el perfil
- ✅ Accesible para ambos roles (Admin y Delivery)

## 🔧 PRÓXIMOS PASOS - CONFIGURACIÓN REQUERIDA

### 1. Ejecutar SQL en Supabase
1. Ve a **Supabase > Project > SQL Editor**
2. Crea una **New query**
3. Copia el contenido completo de `supabase-setup.sql`
4. Haz clic en **Run** (botón verde de play)
5. Verifica que no haya errores (deberías ver ✅ Success)

### 2. Crear Storage Bucket para Perfiles
1. Ve a **Supabase > Storage**
2. Crea un nuevo bucket llamado **`perfiles`**
3. Configuración recomendada:
   - Nombre: `perfiles`
   - Tipo: Private (para que solo usuarios autenticados accedan)
   - Habilita CORS si es necesario

### 3. Crear Storage Bucket para Productos (si no existe)
1. Crea un bucket llamado **`productos`** (si aún no existe)
2. Tipo: Private
3. Este bucket se usa para las imágenes de productos

### 4. Migración de Datos (si tienes productos existentes)
Si ya tienes productos con el campo `precio`, ejecuta esta query en SQL Editor:

```sql
-- Copiar precios antiguos a precio_venta
UPDATE productos 
SET precio_venta = precio, 
    precio_costo = CASE 
      WHEN precio > 0 THEN precio * 0.7 -- asume 30% de margen
      ELSE 0 
    END
WHERE precio_venta IS NULL AND precio > 0;
```

### 5. Actualizar Usuarios en Auth (importante)
Para que los RLS funcionen correctamente, cada usuario necesita tener un rol en la tabla `profiles`:

```sql
-- Para usuarios existentes, crea registros en profiles
INSERT INTO profiles (id, email, rol)
SELECT id, email, 'admin' -- o 'delivery' según corresponda
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

## 📋 Validaciones y Seguridad Implementadas

### Frontend
- ✅ Validación: Precio de venta ≥ Precio de costo
- ✅ Validación: Stock no negativo
- ✅ Validación: Campos requeridos (*) en formularios
- ✅ Confirmación antes de eliminar ventas/productos
- ✅ Upload de fotos limitado a 5MB con optimización

### Backend (RLS)
- ✅ Delivery solo ve productos en READ (SELECT)
- ✅ Delivery solo accede a sus propios pedidos
- ✅ Admin tiene acceso total
- ✅ Perfiles solo editables por el propietario

## 🎨 Nuevas Funcionalidades Resumen

| Feature | Estado | Ubicación |
|---------|--------|-----------|
| Mi Perfil con foto | ✅ | `pages/perfil.html` |
| Inventario v2.0 (marca, genética, sabor) | ✅ | `pages/inventario.html` |
| Vista Delivery lectura | ✅ | `pages/inventario-delivery.html` |
| Editar/Eliminar ventas | ✅ | `pages/ventas.html` |
| Descuentos dinámicos (%, $, promoción) | ✅ | `pages/ventas.html` |
| Filtros por fecha en ventas | ✅ | `pages/ventas.html` |
| Drag & Drop de productos en pedidos | ✅ | `pages/pedidos.html` |
| WhatsApp Business integration | ✅ | `pages/clientes.html`, `pages/pedidos.html` |
| RLS por rol | ✅ | `supabase-setup.sql` |

## 🚀 Testing Recomendado

1. **Crear productos** con todos los nuevos campos
2. **Registrar una venta** con descuento y verificar cálculo
3. **Editar la venta** y confirmar que actualice correctamente
4. **Crear un pedido** usando drag-drop
5. **Acceder como Delivery** y verificar que solo ve inventario (sin editar)
6. **Probar WhatsApp** - click en botón debe abrir chat

## ⚠️ Notas Importantes

- El campo `precio` en productos sigue existiendo por compatibilidad, pero ahora se usa `precio_venta`
- Los arrays (genética, sabor) se validan en TypeScript/JavaScript antes de enviar
- Los descuentos se almacenan pero no se revierten en el stock (la venta reduce stock ya)
- El teléfono en pedidos es opcional, puede dejarse en blanco
- Las fotos de perfil se comprimen automáticamente antes de subir

## 📞 Contacto y Soporte

Si encuentras errores:
1. Revisa la consola del navegador (F12 > Console) para mensajes de error
2. Verifica los logs de Supabase (SQL Editor)
3. Confirma que los buckets de Storage existan
4. Verifica que el usuario tenga rol asignado en `profiles`

---

**FlorandoSur v2.0 - Completamente actualizado y listo para producción** ✨
