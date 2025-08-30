const { execSync } = require('child_process');

try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate --no-engine', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating client:', error.message);
}