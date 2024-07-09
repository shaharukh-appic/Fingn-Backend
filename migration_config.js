const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const sequelize = require('./app/config/sequelize'); // Replace with your Sequelize setup

const readdir = promisify(fs.readdir);



async function generateAndApplyMigrations() {
  const modelsDirectory = './models'; // Replace with your models directory
  const currentModelPaths = await readdir(modelsDirectory);

  // Compare current models with previous state to detect changes

  // Generate migration files based on changes

  // Apply the generated migrations
  await applyMigrations();
}

async function applyMigrations() {
  // Use Sequelize's CLI or a custom script to apply migrations
  const command = 'npx sequelize-cli db:migrate';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing migrations: ${error}`);
      return;
    }
    console.log(`Migrations applied successfully:\n${stdout}`);
  });
}

// Watch for changes in model files
fs.watch('./models', (eventType, filename) => {
  if (eventType === 'change' && filename) {
    console.log(`Detected changes in ${filename}.`);
    generateAndApplyMigrations();
  }
});

// Start watching for changes
console.log('Watching for changes in model files...');
