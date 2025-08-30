-- Insert admin user with hashed password
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  'admin001',
  'admin@coeus.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrator',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  "updatedAt" = NOW();

-- Alternative admin credentials
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  'admin002',
  'coeus@admin.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Coeus Admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  "updatedAt" = NOW();