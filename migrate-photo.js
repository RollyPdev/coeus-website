const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('🔄 Creating migration for photo fields...');
  
  // Create migration directory
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
  const migrationDir = `prisma/migrations/${timestamp}_add_photo_fields`;
  
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
  }
  
  // Create migration SQL
  const migrationSQL = `-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "photo" TEXT,
ADD COLUMN     "photoUrl" TEXT;`;
  
  fs.writeFileSync(`${migrationDir}/migration.sql`, migrationSQL);
  
  console.log('✅ Migration file created');
  console.log('📝 Please run: npx prisma db push');
  console.log('   This will apply the schema changes to your database');
  
} catch (error) {
  console.error('❌ Error creating migration:', error);
}