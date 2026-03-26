# FlorandoSur — Sistema de Gestión

Sistema web para gestión de inventario, clientes, ventas y deliveries.

---

## ✅ Pasos para poner en marcha

### PASO 1 — Crear cuenta en Supabase

1. Ir a **https://supabase.com** y crear cuenta gratuita
2. Hacer clic en **"New project"**
3. Elegir nombre: `florandosur`
4. Crear una contraseña segura para la base de datos (guardala)
5. Región: **South America (São Paulo)** — la más cercana a Argentina
6. Esperar ~2 minutos mientras se crea el proyecto

---

### PASO 2 — Crear las tablas

1. En el panel de Supabase, ir a **SQL Editor** → **New query**
2. Copiar y pegar todo el contenido del archivo `supabase-setup.sql`
3. Hacer clic en **Run** (ícono de play)
4. Verificar que aparece "Success" sin errores

---

### PASO 3 — Crear los usuarios

1. En Supabase ir a **Authentication** → **Users** → **Add user**

**Usuario admin (tu amigo):**
- Email: `admin@florandosur.com` (o el que quiera)
- Password: una contraseña segura
- Hacer clic en "Add user"
- Después de crearlo, hacer clic en el usuario → **Edit** → agregar en "User Metadata":
  ```json
  { "rol": "admin", "nombre": "Tu nombre" }
  ```

**Usuario Juan (delivery):**
- Email: `juan@florandosur.com`
- Password: una contraseña segura
- Hacer clic en "Add user"
- Editar y agregar en "User Metadata":
  ```json
  { "rol": "delivery", "nombre": "Juan" }
  ```

---

### PASO 4 — Conectar el proyecto

1. En Supabase ir a **Project Settings** → **API**
2. Copiar:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon / public key**

3. Abrir el archivo `js/supabase.js` en VS Code
4. Reemplazar los valores:
   ```javascript
   const SUPABASE_URL = 'https://TU_URL.supabase.co'
   const SUPABASE_ANON_KEY = 'eyJhbGc...'
   ```

---

### PASO 5 — Abrir el proyecto

**Opción A — Con VS Code (desarrollo):**
1. Instalar extensión "Live Server" en VS Code
2. Hacer clic derecho en `index.html` → "Open with Live Server"
3. Acceder en `http://127.0.0.1:5500`

**Opción B — Subir a Netlify (producción, gratis):**
1. Ir a **https://netlify.com** y crear cuenta
2. Arrastrar la carpeta `FlorandoSur` al área de deploy
3. Netlify te da una URL pública tipo `florandosur.netlify.app`

---

## 📱 Cómo usar el sistema

### Login
- Entrar a la URL del sistema
- Ingresar email y contraseña
- El sistema redirige automáticamente según el rol

### Tu amigo (admin) puede:
| Módulo | Qué puede hacer |
|--------|----------------|
| **Dashboard** | Ver resumen del día, alertas de stock |
| **Inventario** | Agregar/editar/eliminar productos, ver stock |
| **Clientes** | Gestionar base de clientes, ver historial de compras |
| **Ventas** | Registrar ventas con múltiples productos |
| **Pedidos** | Crear pedidos y cambiar su estado |

### Juan (delivery) puede:
| Módulo | Qué puede hacer |
|--------|----------------|
| **Mis pedidos** | Ver pedidos pendientes y en camino |
| | Marcar "Salir a entregar" → pasa a "En camino" |
| | Marcar "Entregado" cuando llega |

---

## 📂 Estructura de archivos

```
FlorandoSur/
├── index.html              ← Página de login
├── supabase-setup.sql      ← Script para crear las tablas
├── README.md               ← Este archivo
├── css/
│   └── styles.css          ← Estilos globales
├── js/
│   ├── supabase.js         ← ⚠️ CONFIGURAR URL y KEY acá
│   └── sidebar.js          ← Menú lateral
└── pages/
    ├── dashboard.html      ← Panel principal
    ├── inventario.html     ← Gestión de productos
    ├── clientes.html       ← Base de clientes
    ├── ventas.html         ← Registro de ventas
    └── pedidos.html        ← Deliveries (admin + Juan)
```

---

## ❓ Preguntas frecuentes

**¿Los datos se guardan en la nube?**
Sí, todo se guarda en Supabase (PostgreSQL). No se pierde nada si se cierra el navegador.

**¿Pueden usar el sistema desde el celular?**
Sí, el sistema es responsive y funciona en cualquier dispositivo con internet.

**¿Juan puede ver el inventario o las ventas?**
No, Juan solo ve sus pedidos asignados. No tiene acceso a los demás módulos.

**¿Cómo recupero una contraseña olvidada?**
El admin puede resetear contraseñas desde el panel de Supabase → Authentication → Users.

**¿El plan gratuito de Supabase tiene límites?**
El plan gratuito incluye 500MB de base de datos y 50.000 solicitudes/mes, suficiente para este negocio.
