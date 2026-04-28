# 📋 Guía de Implementación FlorandoSur v2.0

## ✅ PASO 1: Ejecutar el SQL en Supabase

### 1.1 Acceder a SQL Editor
1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú izquierdo, haz clic en **SQL Editor**
3. Haz clic en **New query** (esquina superior derecha)

### 1.2 Copiar y ejecutar el SQL
1. Abre el archivo `supabase-setup.sql` en tu editor
2. **Selecciona TODO** el contenido (Ctrl+A)
3. **Cópia** (Ctrl+C)
4. **Pega** en el editor SQL de Supabase (Ctrl+V)
5. Haz clic en el botón **Run** (verde, abajo a la derecha)

### ✅ Resultado esperado:
```
Success - Created table: profiles
Success - Created table: clientes
Success - Created table: productos
Success - Created table: ventas
Success - Created table: detalle_ventas
Success - Created table: pedidos
Success - Created policies (RLS)
```

---

## ✅ PASO 2: Crear Buckets de Storage

### 2.1 Crear bucket "perfiles" para fotos de perfil
1. Ve a **Storage** (en el menú izquierdo)
2. Haz clic en **Create a new bucket**
3. Nombre: `perfiles`
4. Privado: ✅ Sí (Private)
5. Haz clic en **Create bucket**

### 2.2 Crear bucket "productos" (si aún no existe)
1. Repite los pasos 2-5 pero con nombre `productos`
2. Privado: ✅ Sí (Private)

---

## ✅ PASO 3: Actualizar Usuarios Existentes (si aplica)

Si tienes **usuarios ya creados antes de esta actualización**, ejecuta estas queries:

### 3.1 Para usuarios ADMIN
```sql
INSERT INTO profiles (id, email, rol, nombre)
SELECT 
  u.id,
  u.email,
  'admin',
  COALESCE(u.user_metadata->>'nombre', u.email)
FROM auth.users u
WHERE id NOT IN (SELECT id FROM profiles);
```

### 3.2 Para usuarios DELIVERY
```sql
INSERT INTO profiles (id, email, rol, nombre)
SELECT 
  u.id,
  u.email,
  'delivery',
  COALESCE(u.user_metadata->>'nombre', u.email)
FROM auth.users u
WHERE id NOT IN (SELECT id FROM profiles);
```

**Ejecuta ambas queries en SQL Editor** (son independientes)

---

## ✅ PASO 4: Migrar Datos de Productos (si tienes productos existentes)

Si ya tienes productos con el campo antiguo `precio`:

```sql
-- ADVERTENCIA: Esto modifica datos existentes. Haz un backup primero.
-- Asume 30% de margen de ganancia
UPDATE productos 
SET 
  precio_venta = COALESCE(precio, 0),
  precio_costo = CASE 
    WHEN precio > 0 THEN ROUND(precio * 0.7, 2)
    ELSE 0 
  END,
  updated_at = NOW()
WHERE precio_venta IS NULL AND precio IS NOT NULL;
```

---

## ✅ PASO 5: Verificar Configuración

### 5.1 Verificar Tablas Actualizadas
Ejecuta esta query para confirmar:
```sql
SELECT 
  table_name,
  COUNT(*) as columnas
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;
```

Deberías ver:
- `clientes` - 5 columnas
- `detalle_ventas` - 7 columnas
- `pedidos` - 9 columnas
- `perfiles` - 6 columnas
- `productos` - 13+ columnas
- `ventas` - 8 columnas

### 5.2 Verificar RLS está activado
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'productos', 'ventas', 'pedidos', 'clientes', 'detalle_ventas');
```

Deberías ver:
```
tablename          | rowsecurity
-------|----------
profiles           | t
productos          | t
ventas             | t
pedidos            | t
clientes           | t
detalle_ventas     | t
```

---

## ✅ PASO 6: Verificar en la Aplicación

### 6.1 Prueba con usuario ADMIN
1. Abre la app y **inicia sesión** como admin
2. Ve a **Mi Perfil** y sube una foto
3. Ve a **Inventario** y crea un nuevo producto con:
   - Nombre: "Test Producto"
   - Marca: "Test Brand"
   - Precio de costo: 100
   - Precio de venta: 150
   - Genética: "Indica, Sativa"
   - Sabor: "Fruto rojo, Vainilla"
4. Haz clic en **Guardar**
5. Debería aparecer en la tabla

### 6.2 Prueba VENTAS con descuento
1. Ve a **Ventas**
2. Haz clic en **Nueva venta**
3. Selecciona cliente, producto, cantidad
4. Tipo de descuento: **Porcentaje (%)**
5. Valor: **10**
6. Deberías ver el total actualizado (Subtotal - Descuento = Total final)

### 6.3 Prueba PEDIDOS con Drag-Drop
1. Ve a **Pedidos** (si eres admin)
2. Haz clic en **Nuevo pedido**
3. Selecciona cliente y dirección
4. **Arrastra** un producto desde la lista de la izquierda
5. Suéltalo en la zona de la derecha
6. Debería aparecer en "Seleccionados"

### 6.4 Prueba WhatsApp
1. Ve a **Clientes**
2. Busca un cliente con teléfono
3. Debería haber un ícono de WhatsApp
4. Haz clic en el ícono
5. Debería abrir WhatsApp en una nueva pestaña

---

## 🐛 Troubleshooting

### Problema: "Error al guardar el perfil" o storage
**Solución:**
1. Verifica que el bucket `perfiles` exista en Storage
2. Verifica que sea **Private**
3. El archivo `js/supabase.js` tiene las credenciales correctas

### Problema: RLS bloqueando acceso (error "no rows")
**Solución:**
1. Verifica que el usuario exista en tabla `profiles`
2. Ejecuta esta query:
```sql
SELECT id, email, rol FROM profiles;
```
3. Debería haber una fila para cada usuario

### Problema: Delivery no ve productos
**Solución:**
1. Verifica RLS policy: `delivery_read_productos`
2. Ejecuta: `SELECT * FROM productos LIMIT 5;` como delivery user
3. Si no devuelve nada, puede ser problema de rol
4. Verifica en `profiles` que delivery tenga `rol = 'delivery'`

### Problema: Descuentos no se calculan
**Solución:**
1. Abre Console (F12 > Console)
2. Debería no haber errores rojos
3. Verifica que `f-tipo-descuento` sea "porcentaje" o "fijo"
4. Verifica que `f-valor-descuento` tenga un número válido

---

## 📞 Validaciones Implementadas

| Campo | Validación |
|-------|-----------|
| Precio venta | Debe ser ≥ Precio costo |
| Stock | No puede ser negativo |
| Nombre | Requerido (*) |
| Dirección (pedidos) | Requerido (*) |
| Cliente (ventas) | Requerido si no es venta directa |
| Foto perfil | Max 5MB, se comprime automáticamente |
| Genética/Sabor | Arrays separados por comas |

---

## 🚀 Una vez completado...

1. **Hacer backup** en Supabase (Settings > Database > Backups)
2. **Revisar RLS policies** en SQL Editor
3. **Probar en producción** con pocos datos primero
4. **Instruir al equipo** sobre las nuevas funcionalidades
5. **Archivar** la documentación de v1.0

---

**¡Listo! Tu FlorandoSur está actualizado a v2.0 con todas las nuevas funcionalidades.** 🎉
