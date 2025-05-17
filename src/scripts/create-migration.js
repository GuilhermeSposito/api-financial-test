const { execSync } = require('child_process');
const path = require('path');

const name = process.env.npm_config_name;

if (!name) {
    console.error('❌ Você deve passar o nome da migration com --name=Nome');
    process.exit(1);
}

const fileName = `${name}`;
const outputPath = `src/database/migrations/${fileName}`;

const command = `npx typeorm-ts-node-commonjs migration:create ${outputPath}`;

console.log(`📦 Gerando migration: ${fileName}`);
execSync(command, { stdio: 'inherit' });
