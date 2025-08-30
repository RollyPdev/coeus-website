const { execSync } = require('child_process');

try {
  console.log('Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('Database schema deployed successfully!');
} catch (error) {
  console.error('Error deploying database:', error.message);
}