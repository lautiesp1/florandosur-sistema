# FlorandoSur — Análisis de Errores y Correcciones Aplicadas

## 📋 Errores Identificados y Resueltos

---

## 1. VENTAS.HTML — TypeError: Cannot set properties of null

### ❌ PROBLEMA ORIGINAL
**Ubicación**: Línea ~228 en el script  
**Error**: `Uncaught TypeError: Cannot set properties of null (setting 'value')`

```javascript
// ❌ CÓDIGO PROBLEMÁTICO
if (document.getElementById('f-es-delivery').checked) {
    await supabase.from('pedidos').insert({
    cliente_id: clienteId,  // ← UNDEFINED, variable no existe en este scope
    direccion_entrega: document.getElementById('f-direccion-delivery').value,
    total: total,           // ← UNDEFINED
    ...
  });
}
```

### 🔍 CAUSA RAÍZ
1. **Timing issue**: Este bloque ejecutaba al cargar la página (`cargar()` function)
2. **DOM no existía**: El elemento `f-es-delivery` está DENTRO de un `<div id="modal-overlay" style="display:none;">` 
3. **Variables undefined**: Las variables `clienteId`, `total` no existen en ese scope (están dentro de `btn-guardar.addEventListener()`)
4. **ID incorrecto**: Buscaba `f-direccion-delivery` pero el elemento es `f-direccion-entrega-venta`

### ✅ SOLUCIÓN APLICADA
```javascript
// ✅ CÓDIGO CORREGIDO

// 1. Removido el bloque de código nivel top-level
// 2. Agregado null-check al event listener:
const checkboxDelivery = document.getElementById('f-es-delivery')
if (checkboxDelivery) {
  checkboxDelivery.addEventListener('change', (e) => {
    const infoDiv = document.getElementById('extra-delivery-info')
    if (infoDiv) {
      infoDiv.style.display = e.target.checked ? 'block' : 'none'
    }
  })
}

// 3. Movido la lógica de pedidos al evento btn-guardar (donde SÍ existen las variables)
if (document.getElementById('f-es-delivery')?.checked) {
  const direccionVenta = document.getElementById('f-direccion-entrega-venta')?.value?.trim() || 'Verificar con cliente'
  
  const { error: pedidoError } = await supabase.from('pedidos').insert({
    cliente_id: clienteId,    // ✅ Ahora existen en este scope
    direccion_entrega: direccionVenta,  // ✅ ID correcto
    total: total,             // ✅ Ahora existen
    ...
  })
}
```

---

## 2. VENTAS.HTML — Error 400 al hacer POST

### ❌ PROBLEMA ORIGINAL
**POST endpoint**: `POST /rest/v1/ventas`  
**Error**: `400 Bad Request`

**Payload incompleto que enviaba**:
```json
{
  "cliente_id": "uuid-or-null",
  "total": 250.50,
  "descuento": 50.00,
  "tipo_descuento": "porcentaje-10",
  "metodo_pago": "Efectivo"
  // ❌ FALTA: usuario_id (campo REQUERIDO en tabla)
}
```

### 🔍 CAUSA RAÍZ
1. **Campo requerido faltante**: `usuario_id` NO se estaba enviando en INSERT
2. **Estructura de relaciones**: Se intentaba hacer `clientes(nombre)` en SELECT pero no había foreign key explícita
3. **Stock no se actualizaba**: INSERT de venta no incluía actualización posterior de stock

### ✅ SOLUCIÓN APLICADA
```javascript
// ✅ INSERT COMPLETO con usuario_id
const { data: ventaData, error: ventaError } = await supabase
  .from('ventas')
  .insert({
    cliente_id: clienteId,
    total: total,
    descuento: descuentoAplicado,
    tipo_descuento: tipoDescuento,
    metodo_pago: metodo,
    usuario_id: user.id  // ✅ AGREGADO - Ahora el servidor lo recibe
  })
  .select('id')
  .single()

// ✅ Stock actualizado después de insertar
for (const item of itemsVenta) {
  const prod = productos.find(p => p.id === item.productoId)
  if (prod) {
    await supabase.from('productos')
      .update({ stock: prod.stock - item.cantidad })
      .eq('id', item.productoId)
  }
}
```

---

## 3. PEDIDOS.HTML — SyntaxError: Unexpected token '<'

### ❌ PROBLEMA ORIGINAL
**Ubicación**: Línea ~189 en topbar-actions  
**Error**: `Uncaught SyntaxError: Unexpected token '<'`  
**Causa al loginear como delivery**: Pantalla negra

```javascript
// ❌ CÓDIGO PROBLEMÁTICO - String incompleto y HTML suelto
if (esAdmin) {
  document.getElementById('topbar-actions').innerHTML = ''; // ← String vacío
    <button class="btn btn-primary" id="btn-nuevo">  // ← HTML FUERA DE STRING
      <svg>...</svg>
      Nuevo pedido
    </button>
  document.getElementById('filtros-estado').style.display = 'flex'
  // ...
}
```

### 🔍 CAUSA RAÍZ
1. **Sintaxis JavaScript rota**: HTML literal fuera de string
2. **Parser confundido**: El intérprete ve un `<` cuando espera código JavaScript
3. **Error cascada**: Cuando role === 'admin', página se rompe completamente

### ✅ SOLUCIÓN APLICADA
```javascript
// ✅ HTML correctamente dentro de template string
if (esAdmin) {
  document.getElementById('topbar-actions').innerHTML = `
    <button class="btn btn-primary" id="btn-nuevo">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Nuevo pedido
    </button>
  `
  document.getElementById('filtros-estado').style.display = 'flex'
}
```

---

## 4. PEDIDOS.HTML — Error 400 al crear pedido

### ❌ PROBLEMA ORIGINAL
**POST endpoint**: `POST /rest/v1/pedidos`  
**Error**: `400 Bad Request`

**Payload que enviaba**:
```json
{
  "cliente_id": "uuid",
  "direccion_entrega": "Av. Colón 1234",
  "telefono_entrega": "351-1234-567",
  "descripcion": "Cliente prioritario",  // ❌ CAMPO NO EXISTE EN BD
  "notas": "Entregar en puerta",
  "productos_json": [...],
  "estado": "pendiente"
}
```

### 🔍 CAUSA RAÍZ
1. **Campo ficticio**: `descripcion` NO existe en tabla `pedidos` de Supabase
2. **Validación débil de teléfono**: Aceptaba caracteres especiales que podrían causar validaciones en BD
3. **No había feedback**: Error 400 genérico sin detalles

### ✅ SOLUCIÓN APLICADA
```javascript
// 1. ✅ Removido campo descripcion del formulario HTML
// Antes: <input id="f-descripcion" ... />
// Ahora:  ❌ ELIMINADO

// 2. ✅ Validación mejorada de teléfono
const validarTelefono = (tel) => {
  if (!tel) return true // opcional
  return /^[\d+\s\-()]+$/.test(tel) && tel.length >= 5
}

// 3. ✅ INSERT correcto sin campo invalido
const { error } = await supabase.from('pedidos').insert({
  cliente_id: clienteId,
  direccion_entrega: direccion,
  telefono_entrega: telefono || null,
  notas: notas || null,
  productos_json: productosSeleccionados,
  estado: 'pendiente'
  // ❌ REMOVIDO: descripcion
})

// 4. ✅ Mejor logging de errores
if (error) { 
  console.error('Error INSERT:', error)
  toast('Error al crear el pedido: ' + (error.message || 'Error desconocido'), 'error'); 
  return 
}
```

---

## 5. MEJORAS ADICIONALES IMPLEMENTADAS

### ✏️ Iconografía Estandarizada
| Acción | Antes | Después |
|--------|-------|---------|
| Editar | SVG/text variado | ✏️ consistente |
| Eliminar | "Eliminar"/✕/SVG | 🗑️ consistente |
| Historial | SVG | 🕐 emoji |

**Archivos actualizados**:
- `pages/ventas.html`
- `pages/pedidos.html`  
- `pages/clientes.html`
- `pages/inventario.html`

### 🎭 Rol Dinámico en Perfil
```javascript
// Antes: "ADMIN" / "DELIVERY"
// Ahora: "Administrador" / "Repartidor/Delivery"
const rolLabel = profile.rol === 'admin' 
  ? 'Administrador' 
  : (profile.rol === 'delivery' ? 'Repartidor/Delivery' : 'Usuario')
document.getElementById('f-rol').textContent = rolLabel
```

### 🔒 Validación de Teléfono Mejorada
```javascript
// Input listener: Solo permite números, +, espacios y guiones
telInput.addEventListener('input', (e) => {
  let value = e.target.value
  value = value.replace(/[^\d+\s\-()]/g, '')
  value = value.substring(0, 20)
  e.target.value = value
})
```

---

## 📊 Resumen de Errores y Root Causes

| Error | Archivo | Línea | Causa Principal | Tipo |
|-------|---------|-------|-----------------|------|
| TypeError null | ventas.html | ~228 | Acceso DOM antes de que exista | Timing |
| 400 Bad Request | ventas.html | INSERT | `usuario_id` faltante | Schema |
| SyntaxError '<' | pedidos.html | ~189 | HTML fuera de string | Syntax |
| 400 Bad Request | pedidos.html | INSERT | Campo `descripcion` no existe | Schema |

---

## 🚀 Cómo Verificar las Correcciones

### 1. Probar Ventas
```bash
# Abrir DevTools (F12) → Console
# 1. Ir a Ventas
# 2. Click "Nueva venta"
# 3. Agregar producto
# 4. Marcar "¿Es para envío?" → No debe haber TypeError
# 5. Registrar venta → Debe existir en BD con usuario_id
# 6. Intentar eliminar → Debe pedir confirmación (no confirm() del browser)
```

### 2. Probar Pedidos (Admin)
```bash
# 1. Login como Admin
# 2. Ir a Pedidos
# 3. Click "Nuevo pedido" → Debe aparecer botón SIN SyntaxError
# 4. Completar formulario
# 5. Crear pedido → NO debe haber error 400
# 6. Verificar DB: No debe haber columna "descripcion" guardada
```

### 3. Probar Pedidos (Delivery)
```bash
# 1. Login como Delivery (role: delivery)
# 2. Ir a Pedidos → Debe mostrar "Mis pedidos" sin SyntaxError
# 3. Ingresar teléfono → Solo debe aceptar números y +
# 4. Cambiar estado → Debe actualizar sin errores
```

---

## ✅ Checklist de Correcciones

- [x] **ventas.html**: Removido bloque null-check, agregado import confirmar, corregido evento checkbox
- [x] **ventas.html**: Agregado usuario_id en INSERT (fix error 400)
- [x] **ventas.html**: Stock actualizado automáticamente
- [x] **ventas.html**: Eliminar usa confirmar() en lugar de confirm()
- [x] **pedidos.html**: HTML del botón en string correcto (fix SyntaxError)
- [x] **pedidos.html**: Removido campo descripcion (fix error 400)
- [x] **pedidos.html**: Validación mejorada de teléfono
- [x] **pedidos.html**: Mejor logging de errores
- [x] **perfil.html**: Rol mostrado de forma amigable
- [x] **Iconografía**: ✏️ y 🗑️ estandarizados en todas las páginas

---

**Generado**: 2026-04-25  
**Stack**: HTML5, CSS3, JavaScript vainilla, Supabase  
**Próximos pasos**: Implementar promociones automáticas 2x3 y 3x4 (ver plan inicial)
