const { PrismaClient } = require('@prisma/client');

async function checkUserTable() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking User table structure...');
    
    // Try to describe the User table structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 User table columns:');
    result.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking User table:', error.message);
    
    // If User table doesn't exist, let's check what tables do exist
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `;
      
      console.log('\n📊 Available tables:');
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    } catch (tablesError) {
      console.error('❌ Error checking tables:', tablesError.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkUserTable();