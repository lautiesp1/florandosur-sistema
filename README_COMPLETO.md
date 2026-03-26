# 🌸 FlorandoSur — Sistema de Gestión Completo

**Sistema web gratuito, rápido y responsive para gestionar inventario, clientes, ventas y entregas para tu negocio.**

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Backend](https://img.shields.io/badge/Backend-Supabase-3ECF8E) ![Responsive](https://img.shields.io/badge/Design-Responsive-blue)

---

## 📋 Tabla de Contenidos

1. [¿Qué es FlorandoSur?](#qué-es-florandosur)
2. [Características](#características)
3. [Requisitos](#requisitos)
4. [Instalación Rápida (6 Pasos)](#instalación-rápida-6-pasos)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Sistema de Imágenes](#sistema-de-imágenes)
7. [Roles y Permisos](#roles-y-permisos)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Preguntas Frecuentes](#preguntas-frecuentes)
10. [Troubleshooting](#troubleshooting)

---

## ¿Qué es FlorandoSur?

FlorandoSur es un **sistema de gestión integral** diseñado para pequeños negocios de ventas (vaperías, tiendas, etc.). Te permite:

✅ Gestionar inventario con fotos de productos  
✅ Registrar ventas rápidamente  
✅ Administrar clientes con historial completo  
✅ Crear pedidos/entregas y rastrearlas en tiempo real  
✅ Ver dashboards con estadísticas del día  
✅ Funciona en PC, tablet y móviles  

### Ventajas:

🆓 **100% gratuito** - usa Supabase free tier (suficiente para pequeños negocios)  
⚡ **Súper rápido** - carga optimizada para velocidad  
📱 **Totalmente responsive** - funciona perfectamente en cualquier dispositivo  
☁️ **En la nube** - accede desde cualquier lugar  
🔒 **Seguro** - autenticación y base de datos encriptada  
📸 **Fotos optimizadas** - imágenes comprimidas automáticamente  

---

## Características

### 🎯 Funcionalidades Principales

| Feature | Descripción |
|---|---|
| **Inventario** | Agregar/editar/eliminar productos con categorías, precio, stock y fotos |
| **Fotos productos** | Sube fotos que se optimizan automáticamente (max 500KB) |
| **Detalle producto** | Panel elegante con imagen grande, descripción, precio y stock |
| **Clientes** | Base de datos con teléfono, dirección, notas y historial |
| **Registro de ventas** | Vende múltiples productos de una vez, totales automáticos |
| **Historial compras** | Ve todas las compras de cada cliente |
| **Pedidos/entregas** | Crea pedidos, cambia estado (pendiente → en camino → entregado) |
| **Dashboard** | Resumen del día: ventas, clientes nuevos, alertas de bajo stock |
| **Alertas stock** | Notificaciones cuando un producto llega a 3 unidades |
| **Búsqueda** | Busca productos, clientes o pedidos al instante (en tiempo real) |
| **Roles usuario** | Admin (acceso total) y Delivery (solo sus pedidos) |
| **Responsive** | Funciona perfectamente en móviles, tablets y desktops |

---

## Requisitos

Necesitas:

✅ Computadora o smartphone con internet  
✅ Navegador moderno (Chrome, Firefox, Edge, Safari)  
✅ Cuenta Supabase (gratis - https://supabase.com)  
✅ Editor de texto (VS Code recomendado - gratis)  
✅ Conexión a internet estable  

**Opcional:**
- VS Code + extensión "Live Server" para desarrollo local
- Netlify para hostear en producción (gratis)

---

## Instalación Rápida (6 Pasos)

### Paso 1️⃣ — Crear cuenta en Supabase

1. Ve a **https://supabase.com**
2. Haz clic en **"Sign up"** (arriba a la derecha)
3. Usa tu email o cuenta de GitHub
4. Verifica tu email
5. Crea tu primer proyecto:
   - **Nombre**: `florandosur`
   - **Contraseña BD**: algo seguro como `FlorandoSur2024!`
   - **Región**: **South America (São Paulo)** ← importante, es la más cercana

⏳ Supabase tarda ~2 minutos. Espera mientras se configura.

---

### Paso 2️⃣ — Crear las tablas

1. En Supabase, ve a **SQL Editor** (izquierda)
2. Haz clic en **"New query"**
3. **Copia TODO** del archivo `supabase-setup.sql`
4. **Pégalo** en el editor
5. Haz clic en **"Run"** (botón play 
verde)
6. Deberías ver ✅ **"Success"** sin errores

**¿Qué pasó?** Se crearon: productos, clientes, ventas, pedidos, etc.

---

### Paso 3️⃣ — Crear usuarios

1. En Supabase: **Authentication** (izquierda) → **Users**
2. Haz clic en **"Add user"**

**Usuario Admin (tu amigo):**
- Email: `admin@florandosur.com`
- Password: algo seguro
- Haz clic en **"Add user"**
- Haz clic en el usuario recién creado
- Abre **"User Metadata"** (abajo)
- Coloca este JSON:
  ```json
  {"rol": "admin", "nombre": "Tu Nombre"}
  ```
- Guarda

**Usuario Delivery (Juan):**
- Repite pero:
  - Email: `juan@florandosur.com`
  - Metadata: `{"rol": "delivery", "nombre": "Juan"}`

---

### Paso 4️⃣ — Conectar tu app

1. Ve a **Project Settings** (ruedata arriba a la derecha en Supabase)
2. Haz clic en **"API"**
3. **Copia** estos dos valores:
   - **Project URL**: algo como `https://vvazpmmhfpcfymlzkphi.supabase.co`
   - **anon public key**: un texto largo que empieza con `eyJhbGc...`

4. **Abre** el archivo `js/supabase.js` con un editor
5. Reemplaza:
   ```javascript
   const SUPABASE_URL = 'https://TU_URL.supabase.co'
   const SUPABASE_ANON_KEY = 'eyJhbGc...'
   ```
   Con TUS valores. **Guarda** (Ctrl+S)

---

### Paso 5️⃣ — Configurar Storage (para fotos)

1. En Supabase: **Storage** (izquierda)
2. Haz clic en **"Create a new bucket"**
3. **Nombre**: `producto-imagenes`
4. ✅ Marca **"Public bucket"**
5. Haz clic en **"Create"**

¡Listo! Ver [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) si necesitas ayuda.

---

### Paso 6️⃣ — Abrir la app

**Opción A - Localhost (desarrollo):**
1. Descarga **VS Code** (gratis)
2. Instala extensión **"Live Server"**
3. Abre carpeta `FlorandoSur` en VS Code
4. Haz clic derecho en `index.html`
5. **"Open with Live Server"**
6. Se abre en `http://127.0.0.1:5500` 🎉

**Opción B - En la nube (producción):**
1. Ve a **https://netlify.com**
2. Arrastra la carpeta entero al área de deploy
3. Netlify te da URL pública tipo `florandosur.netlify.app`

---

## Módulos del Sistema

### 📊 Dashboard

**Qué ves:**
- Total de ventas hoy  
- Monto total vendido  
- Clientes nuevos hoy  
- **⚠️ Alertas de stock bajo** (≤3 unidades)  
- Últimas ventas registradas  

**Acceso:** Solo Admin

---

### 📦 Inventario

**Funciones:**
- ✅ Ver todos los productos en tabla
- ✅ **Agregar producto** - nombre, precio, stock, categoría, descripción, **foto**
- ✅ **Buscar** por nombre o categoría (instantáneo)
- ✅ **Editar producto** - cambiar datos o foto
- ✅ **Eliminar producto**
- ✅ **Ver detalle** - haz click en la fila para ver la foto grande

**Fotos:**
- Sube cualquier imagen (JPG, PNG, etc.)
- Se optimiza automáticamente → WebP, max 500KB
- Se guarda en Supabase Storage (no en BD)

**Acceso:** Solo Admin

---

### 👥 Clientes

**Funciones:**
- ✅ Ver lista de clientes
- ✅ **Agregar cliente** - nombre, teléfono, dirección, notas
- ✅ **Ver historial** - todas las compras del cliente
- ✅ **Editar cliente**
- ✅ **Eliminar cliente**

**Acceso:** Solo Admin

---

### 💳 Ventas

**Cómo registrar una venta:**
1. Selecciona cliente (o crea uno)
2. Agrega productos al carrito
3. Sistema calcula total automáticamente
4. Selecciona método de pago
5. Guarda

**Más:**
- ✅ Ver historial de todas las ventas
- ✅ Buscar por cliente

**Acceso:** Solo Admin

---

### 🚚 Pedidos/Entregas

**Admin puede:**
- ✅ Crear pedido - cliente, dirección, productos
- ✅ Ver todos los pedidos
- ✅ Cambiar estado:
  - 🟡 Pendiente
  - 🟠 En camino
  - 🟢 Entregado

**Juan (Delivery) puede:**
- ✅ Ver **solo sus pedidos**
- ✅ Cambiar estado de sus pedidos

---

## Sistema de Imágenes

### ¿Cómo funciona?

1. **Subes una foto** en Inventario (puede ser muy grande)
2. **La app optimiza:**
   - Redimensiona a 800x800px
   - Convierte a WebP (más eficiente)
   - Comprime a ~200-500KB
3. **Se sube a Supabase Storage** (no ocupa BD)
4. **Se guarda URL** en tabla productos
5. **En detalle** del producto ves la imagen grande

### Tecnología:

- **Canvas API** (navegador) - optimización local
- **Supabase Storage** - almacenamiento nube
- **WebP** - formato moderno

### Límites:

| Aspecto | Límite |
|---|---|
| Archivo original | 10 MB |
| Optimizado | ~500 KB |
| Dimensiones | 800x800px |
| Espacio | ✅ Ilimitado |
| Ancho de banda | ✅ Generoso |

---

## Roles y Permisos

### 👨‍💼 Admin

**Acceso a:**
- 📊 Dashboard
- 📦 Inventario (crear/editar/eliminar)
- 👥 Clientes
- 💳 Ventas
- 🚚 Pedidos

---

### 🚚 Delivery

**Solo puede:**
- 🚚 Ver sus pedidos
- Cambiar estado de sus pedidos

**No puede ver:**
- Inventario
- Clientes
- Ventas

---

## Estructura del Proyecto

```
FlorandoSur/
│
├── index.html                    ← Login
├── supabase-setup.sql            ← Script BD
├── SUPABASE_STORAGE_SETUP.md     ← Setup Storage
├── README.md / README_COMPLETO   ← Documentación
│
├── /css
│   └── styles.css                ← Estilos globales
│
├── /js
│   ├── supabase.js               ← ⚙️ CONFIGURACIÓN (edita aquí)
│   ├── sidebar.js                ← Menú
│   └── imagen.js                 ← Optimización imágenes
│
└── /pages
    ├── dashboard.html            ← Panel principal
    ├── inventario.html           ← Productos + fotos
    ├── clientes.html             ← Clientes
    ├── ventas.html               ← Ventas
    ├── pedidos.html              ← Entregas
    ├── producto-detalle.html     ← Detalle del producto
    └── signup.html               ← Registro usuarios
```

---

## Preguntas Frecuentes

### ¿Los datos están seguros?

Sí. Supabase usa:
- ✅ PostgreSQL (profesional)
- ✅ Encriptación end-to-end
- ✅ Backups automáticos
- ✅ Row Level Security

### ¿Pierdo datos si cierro el navegador?

No, todo está en la nube (Supabase). Los datos persisten.

### ¿Cuánto cuesta?

**Plan GRATUITO incluye:**
- ✅ 500 MB BD
- ✅ 1 GB Storage
- ✅ 50.000 llamadas/mes
- ✅ Usuarios ilimitados

Para un pequeño negocio es **más que suficiente**.

### ¿Puedo usar desde el celular?

Sí, 100% responsive. Chrome, Safari, Firefox en cualquier dispositivo.

### ¿Cómo agrego más usuarios?

1. Supabase → Authentication → Users
2. "Add user"
3. Completa email, password, rol en metadata

### ¿Cómo reseteo contraseña?

1. Supabase → Authentication → Users
2. Encuentra usuario → ⋮ (acción)
3. "Reset password" → se le envía email

### ¿Dónde están mis datos?

En servidores de Supabase (São Paulo, Brasil) - cercano a Argentina.

### ¿Puedo exportar datos?

Sí, desde Supabase → Database → backup SQL.

### ¿Necesito internet siempre?

Sí, es una app web en la nube. Necesita conexión.

### ¿Se pueden cambiar los colores?

Sí, edita `css/styles.css`:
```css
--accent: #00D84F;            /* Color principal */
--bg: #1A1A1E;                /* Fondo */
--text-primary: #FFFFFF;      /* Texto */
```

---

## Troubleshooting

### ❌ "Error: Proyecto no encontrado"

**Solución:**
1. Verifica `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `js/supabase.js`
2. Cópialo de nuevo desde Supabase → Project Settings → API

### ❌ "Bucket not found" al subir imagen

**Solución:**
1. Supabase → Storage
2. Verifica que exista bucket `producto-imagenes`
3. Name exacto: `producto-imagenes` (sin mayúsculas)

### ❌ Las imágenes no cargan

**Causas:**
1. Bucket no es PUBLIC
   - Solución: Storage → selecciona bucket → marca "Public"
2. Sin política RLS
   - Solución: Ver `SUPABASE_STORAGE_SETUP.md`

### ❌ "Row violates row-level security"

Significa RLS bloquea la operación.

**Solución:**
- Verifica políticas RLS en Supabase
- O deshabilita RLS (bucket público es seguro)

### ❌ Página carga lenta

**Causas:**
1. Mala conexión
2. Muchos datos en BD

**Solución:**
- Verifica internet
- Divide datos (archivar ventas viejas)

### ❌ No puedo crear usuario

**Verifica:**
1. Rol exacto: `admin` o `delivery` (minúsculas)
2. Email válido
3. Políticas RLS no bloquean

---

## Mejoras Técnicas

### ⚡ Performance
- Carga paralela sidebar + datos
- Compresión imágenes en cliente
- Caché en memoria

### 📱 Responsive
- Mobile-first approach
- Breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop)
- Menú hamburguesa en móviles
- Inputs grandes en móviles

### 🎨 UI/UX
- Dark mode elegante
- Animaciones suaves
- Modales custom
- Toasts notificaciones
- Badges coloridos

### 🔒 Seguridad
- Autenticación Supabase Auth
- Row Level Security
- Validación cliente/servidor
- Encriptación datos

---

## Endpoints API Documentados

Backend usa Supabase con estas tablas:

```
- productos (id, nombre, precio, stock, categoria, imagen_url)
- clientes (id, nombre, telefono, direccion, notas)
- ventas (id, cliente_id, total, metodo_pago)
- detalle_ventas (id, venta_id, producto_id, cantidad)
- pedidos (id, cliente_id, estado, direccion_entrega)
```

Acceso a través de `supabase.from('tabla').select()`.

---

## Contacto & Links

- **Supabase Docs**: https://supabase.com/docs
- **Netlify**: https://netlify.com
- **VS Code**: https://code.visualstudio.com
- **MDN Web Docs**: https://developer.mozilla.org/es/

---

## Licencia

Código abierto. Úsalo libremente en tu negocio.

---

**Última actualización**: Marzo 26, 2026  
**Versión**: 1.0 - Sistema completo con imágenes optimizadas para móviles
