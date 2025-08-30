const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up database...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test connection
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if Student table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Student" LIMIT 1`;
      console.log('✅ Student table already exists');
      return;
    } catch (error) {
      console.log('📝 Student table does not exist, creating...');
    }
    
    // Read and execute migration
    const migrationPath = path.join(__dirname, 'prisma/migrations/20250118120000_add_missing_tables/migration.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      return;
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📋 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await prisma.$executeRawUnsafe(statement + ';');
        console.log(`✅ ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  ${i + 1}/${statements.length}: Already exists - ${statement.substring(0, 50)}...`);
        } else {
          console.error(`❌ ${i + 1}/${statements.length}: Error - ${error.message}`);
        }
      }
    }
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    const tables = ['Student', 'Enrollment', 'Payment', 'Attendance'];
    
    for (const table of tables) {
      try {
        await prisma.$queryRaw`SELECT 1 FROM ${table} LIMIT 1`;
        console.log(`✅ ${table} table verified`);
      } catch (error) {
        console.log(`❌ ${table} table verification failed`);
      }
    }
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    if (error.code === 'P5010') {
      console.log('💡 This appears to be a Prisma Accelerate connection issue.');
      console.log('   Please check your internet connection and DATABASE_URL.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();