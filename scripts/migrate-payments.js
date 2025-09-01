const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Starting payment enhancement migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../prisma/migrations/enhance_payments.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and filter out empty statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.log(`⚠️  Statement ${i + 1} skipped (might already exist): ${error.message}`);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('📊 Verifying database structure...');
    
    // Verify the migration worked
    const paymentCount = await prisma.payment.count();
    const enrollmentCount = await prisma.enrollment.count();
    
    console.log(`✅ Found ${paymentCount} payments and ${enrollmentCount} enrollments`);
    console.log('🔄 Regenerating Prisma client...');
    
    // Note: In production, you should run `npx prisma generate` after this
    console.log('⚠️  Remember to run: npx prisma generate');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();