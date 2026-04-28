-- ══════════════════════════════════════════════════════
--  FlorandoSur — Setup de base de datos (v2.0)
--  Ejecutar en: Supabase > SQL Editor > New query
-- ══════════════════════════════════════════════════════

-- 0. Perfiles de Usuario
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT,
  email       TEXT,
  foto_url    TEXT,
  telefono    TEXT,
  rol         TEXT DEFAULT 'delivery',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  telefono    TEXT,
  direccion   TEXT,
  notas       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Productos (inventario v2.0)
CREATE TABLE IF NOT EXISTS productos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  precio_costo      NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_venta      NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0,
  categoria   TEXT,
  marca       TEXT,
  genetica    TEXT[],
  sabor       TEXT[],
  cantidad    NUMERIC(10,2),
  unidad      TEXT,
  imagen_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ventas (v2.0)
CREATE TABLE IF NOT EXISTS ventas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  UUID REFERENCES clientes(id) ON DELETE SET NULL,
  total       NUMERIC(10,2) NOT NULL,
  descuento   NUMERIC(10,2) DEFAULT 0,
  tipo_descuento TEXT,
  precio_final NUMERIC(10,2) NOT NULL,
  metodo_pago TEXT,
  usuario_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Detalle de ventas (v2.0)
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id        UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id     UUID REFERENCES productos(id) ON DELETE SET NULL,
  cantidad        INTEGER NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  descuento_item  NUMERIC(10,2) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Pedidos / Deliveries (v2.0)
CREATE TABLE IF NOT EXISTS pedidos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id        UUID REFERENCES clientes(id) ON DELETE SET NULL,
  usuario_delivery_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  estado            TEXT NOT NULL DEFAULT 'pendiente',
  direccion_entrega TEXT,
  telefono_entrega  TEXT,
  notas             TEXT,
  productos_json    JSONB,
  total             NUMERIC(10,2),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT estado_valido CHECK (estado IN ('pendiente','en_camino','entregado'))
);

-- ══════════════════════════════════════════════════════
--  Seguridad: Row Level Security (RLS) v2.0
--  Políticas granulares por rol
-- ══════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos          ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ────────────────────────────────────────
-- Cada usuario puede ver/editar su propio perfil
CREATE POLICY "users_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ── CLIENTES ────────────────────────────────────────
-- Acceso total a admins
CREATE POLICY "admin_full_access_clientes" ON clientes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Delivery solo puede leer
CREATE POLICY "delivery_read_clientes" ON clientes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'delivery'
    )
  );

-- ── PRODUCTOS ────────────────────────────────────────
-- Acceso total a admins
CREATE POLICY "admin_full_access_productos" ON productos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Delivery solo lectura (inventario read-only)
CREATE POLICY "delivery_read_productos" ON productos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'delivery'
    )
  );

-- ── VENTAS ──────────────────────────────────────────
-- Acceso total a admins
CREATE POLICY "admin_full_access_ventas" ON ventas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Delivery no accede a ventas
-- (podés cambiar esto si lo necesitas)

-- ── DETALLE_VENTAS ──────────────────────────────────
CREATE POLICY "admin_full_access_detalle_ventas" ON detalle_ventas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- ── PEDIDOS ─────────────────────────────────────────
-- Admins acceso total
CREATE POLICY "admin_full_access_pedidos" ON pedidos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Delivery solo sus propios pedidos
CREATE POLICY "delivery_own_pedidos" ON pedidos
  FOR SELECT USING (
    usuario_delivery_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "delivery_update_own_pedidos" ON pedidos
  FOR UPDATE USING (
    usuario_delivery_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );


-- ══════════════════════════════════════════════════════
--  DATOS DE PRUEBA (opcional - ejecutar aparte)
--  Corré esto DESPUÉS de crear los usuarios en Auth
-- ══════════════════════════════════════════════════════

/*
-- Productos de ejemplo
INSERT INTO productos (nombre, precio, stock, categoria) VALUES
  ('Vaper Caliburn A2',     12500, 8,  'vaporizadores'),
  ('Vaper Vaporesso Xros 3',15000, 5,  'vaporizadores'),
  ('Líquido Frutos del Bosque 60ml', 4500, 20, 'liquidos'),
  ('Líquido Menta Fresca 60ml',      4200, 15, 'liquidos'),
  ('Pod Caliburn A2 (2 unid)',       3500, 12, 'pods'),
  ('Batería 18650 Samsung',           2800,  6, 'baterias'),
  ('Resistencia Mesh 0.8ohm',         800,  30, 'resistencias'),
  ('Cargador USB-C',                 1500,   4, 'accesorios');

-- Clientes de ejemplo
INSERT INTO clientes (nombre, telefono, direccion) VALUES
  ('Agustín Fernández',  '351 234-5678', 'Bv. Illia 920, Córdoba'),
  ('Valentina López',    '351 456-7890', 'Av. Rafael Núñez 4200, Córdoba'),
  ('Matías Rodríguez',   '351 678-9012', 'Calle Lima 345, Córdoba'),
  ('Julieta Martínez',   '351 890-1234', 'Av. Colón 1890, Córdoba');
*/
