const { execSync } = require('child_process');

console.log('🚀 Setting up Coeus Website Database...');
console.log('=====================================');

try {
  console.log('1. 📊 Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n2. ⚙️  Generating Prisma client...');
  execSync('npx prisma generate --no-engine', { stdio: 'inherit' });
  
  console.log('\n3. 🌱 Seeding database with sample data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!');
  console.log('=====================================');
  console.log('🔑 Admin login: admin@coeusreview.com / admin123');
  console.log('📊 View data: /api/admin/data');
  console.log('🎓 Features now connected to database:');
  console.log('   - Student enrollment');
  console.log('   - Admin authentication');
  console.log('   - Lecturers management');
  console.log('   - News & events');
  console.log('   - All admin panels');
  console.log('=====================================');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   - Make sure your DATABASE_URL is correct in .env');
  console.log('   - Check your internet connection');
  console.log('   - Verify Prisma Accelerate is accessible');
}