const { createBackup } = require('./safe-db-reset');

createBackup().catch(console.error);