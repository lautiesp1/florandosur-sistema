-- ══════════════════════════════════════════════════════
--  FlorandoSur — Setup de base de datos
--  Ejecutar en: Supabase > SQL Editor > New query
-- ══════════════════════════════════════════════════════

-- 1. Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  telefono    TEXT,
  direccion   TEXT,
  notas       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Productos (inventario)
CREATE TABLE IF NOT EXISTS productos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  precio      NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0,
  categoria   TEXT,
  imagen_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  UUID REFERENCES clientes(id) ON DELETE SET NULL,
  total       NUMERIC(10,2) NOT NULL,
  metodo_pago TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id        UUID REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id     UUID REFERENCES productos(id) ON DELETE SET NULL,
  cantidad        INTEGER NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL
);

-- 5. Pedidos / Deliveries
CREATE TABLE IF NOT EXISTS pedidos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id        UUID REFERENCES clientes(id) ON DELETE SET NULL,
  estado            TEXT NOT NULL DEFAULT 'pendiente',
  direccion_entrega TEXT,
  notas             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT estado_valido CHECK (estado IN ('pendiente','en_camino','entregado'))
);

-- ══════════════════════════════════════════════════════
--  Seguridad: Row Level Security (RLS)
--  Permite que solo usuarios autenticados accedan
-- ══════════════════════════════════════════════════════

ALTER TABLE clientes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos        ENABLE ROW LEVEL SECURITY;

-- Políticas: acceso total a usuarios autenticados
-- (podés hacer más granular después según roles)

CREATE POLICY "acceso autenticados" ON clientes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "acceso autenticados" ON productos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "acceso autenticados" ON ventas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "acceso autenticados" ON detalle_ventas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "acceso autenticados" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');


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
