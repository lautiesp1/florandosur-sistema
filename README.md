# FlorandoSur — Sistema de Gestion

Sistema web gratuito para gestionar inventario, clientes, ventas y entregas.

## Inicio Rapido (6 Pasos)

### 1. Crear Supabase
- Ve a https://supabase.com  (Sign up)
- Nuevo proyecto: `florandosur`
- Region: **South America (São Paulo)**

### 2. Crear tablas
- SQL Editor → New query
- Copia/pega `supabase-setup.sql`
- Click "Run" ✓

### 3. Crear usuarios
- Authentication → Users → Add user
- Admin: `admin@florandosur.com`
- Metadata: `{"rol":"admin","nombre":"Tu Nombre"}`
- Delivery: `juan@florandosur.com`
- Metadata: `{"rol":"delivery","nombre":"Juan"}`

### 4. Conectar app
- Supabase → Project Settings → API
- Copia URL y anon Key
- Pega en `js/supabase.js`

### 5. Storage para fotos
- Supabase → Storage → Create bucket
- Nombre: `producto-imagenes`
- Mark "Public bucket" ✓

### 6. Abrir app
- **Desarrollo**: VS Code + Live Server → `index.html`
- **Produccion**: Sube a Netlify (drag & drop)

---

## Documentacion Completa

**Ver [README_COMPLETO.md](README_COMPLETO.md)** para:
- Caracteristicas detalladas del sistema
- Descripcion de modulos (Dashboard, Inventario, Clientes, Ventas, Pedidos)
- Como funciona el sistema de imagenes
- Roles y permisos de usuarios
- Estructura del proyecto
- 20+ preguntas frecuentes (FAQ)
- Seccion de troubleshooting
- Stack tecnico y mejoras

---

## Caracteristicas principales

- Inventario con fotos optimizadas (max 500KB)
- Gestion de clientes con historial
- Registro de ventas rapido
- Pedidos/Entregas con seguimiento
- Dashboard con estadisticas  
- Alertas de bajo stock
- Busqueda instantanea
- Responsive (movil, tablet, desktop)
- Roles (Admin + Delivery)
- Datos en la nube (Supabase)

---

## Costos

Gratis para siempre:
- 500 MB base de datos
- 1 GB Storage
- 50.000 llamadas/mes
- Usuarios ilimitados
- Backups automaticos

---

## Como usar

### Admin puede:
| Modulo | Que puede hacer |
|--------|----------------|
| **Dashboard** | Ver resumen del dia, alertas de stock |
| **Inventario** | Agregar/editar/eliminar productos |
| **Clientes** | Gestionar clientes, ver historial |
| **Ventas** | Registrar ventas con multiples productos |
| **Pedidos** | Crear pedidos y cambiar estado |

### Delivery (Juan) puede:
| Modulo | Que puede hacer |
|--------|----------------|
| **Mis pedidos** | Ver pedidos pendientes y en camino |
| | Marcar "Salir a entregar" |
| | Marcar "Entregado" cuando llega |

---

## Configuracion

**Archivo a editar: `js/supabase.js`**

```javascript
const SUPABASE_URL = 'https://TU_URL.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGc...'
```

Obten valores desde: Supabase → Project Settings → API

---

## Preguntas frecuentes

**Cuesta dinero?**
No, Supabase free tier es suficiente.

**Pierdo datos si apago la compu?**
No, todo esta en la nube.

**Juan puede ver inventario y ventas?**
No, solo ve sus pedidos (acceso restringido).

**Funciona sin internet?**
No, necesita conexion (es web).

**Las fotos se guardan en la BD?**
No, van a Supabase Storage.

**Ver mas FAQs** en [README_COMPLETO.md](README_COMPLETO.md)

---

## Archivos importantes

```
FlorandoSur/
├── js/supabase.js              ← EDITA AQUI (URL + KEY)
├── supabase-setup.sql          ← Script BD
├── README.md                   ← Este archivo
└── README_COMPLETO.md          ← Documentacion detallada
```

---

## Aprende mas

- [Documentacion Completa](README_COMPLETO.md)
- [Setup Storage](SUPABASE_STORAGE_SETUP.md)
- [Supabase Docs](https://supabase.com/docs)

---

Gracias por usar FlorandoSur
