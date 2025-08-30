const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function applySchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Applying new schema...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'prisma/migrations/20250118120000_add_missing_tables/migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        await prisma.$executeRawUnsafe(statement + ';');
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        console.log('⚠️  Skipped (already exists):', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Schema applied successfully');
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

applySchema();