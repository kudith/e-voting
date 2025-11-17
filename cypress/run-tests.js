#!/usr/bin/env node

/**
 * SiPilih E-Voting Test Runner
 * Menjalankan test suite dengan berbagai mode
 */

const { exec } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log.info(`${description}...`);
    
    const child = exec(command, { maxBuffer: 1024 * 1024 * 10 });
    
    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log.success(`${description} selesai`);
        resolve();
      } else {
        log.error(`${description} gagal dengan kode: ${code}`);
        reject(code);
      }
    });
  });
}

const testSuites = {
  all: {
    command: 'npx cypress run',
    description: 'Menjalankan semua test'
  },
  functional: {
    command: 'npx cypress run --spec "cypress/e2e/0[1-8]*.cy.js"',
    description: 'Menjalankan functional tests'
  },
  security: {
    command: 'npx cypress run --spec "cypress/e2e/09-security-tests.cy.js"',
    description: 'Menjalankan security tests'
  },
  e2e: {
    command: 'npx cypress run --spec "cypress/e2e/10-end-to-end.cy.js"',
    description: 'Menjalankan end-to-end tests'
  },
  homepage: {
    command: 'npx cypress run --spec "cypress/e2e/01-homepage.cy.js"',
    description: 'Menjalankan homepage tests'
  },
  authentication: {
    command: 'npx cypress run --spec "cypress/e2e/03-authentication.cy.js"',
    description: 'Menjalankan authentication tests'
  },
  voting: {
    command: 'npx cypress run --spec "cypress/e2e/06-voting-process.cy.js"',
    description: 'Menjalankan voting process tests'
  },
  admin: {
    command: 'npx cypress run --spec "cypress/e2e/07-admin-dashboard.cy.js"',
    description: 'Menjalankan admin dashboard tests'
  },
  api: {
    command: 'npx cypress run --spec "cypress/e2e/04-api-integration.cy.js"',
    description: 'Menjalankan API integration tests'
  },
  ui: {
    command: 'npx cypress open',
    description: 'Membuka Cypress UI'
  },
  chrome: {
    command: 'npx cypress run --browser chrome',
    description: 'Menjalankan tests dengan Chrome'
  },
  firefox: {
    command: 'npx cypress run --browser firefox',
    description: 'Menjalankan tests dengan Firefox'
  },
  edge: {
    command: 'npx cypress run --browser edge',
    description: 'Menjalankan tests dengan Edge'
  }
};

async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'help';

  log.title('SiPilih E-Voting Test Runner');

  if (testType === 'help' || testType === '-h' || testType === '--help') {
    console.log('Usage: node run-tests.js [test-type]\n');
    console.log('Available test types:\n');
    Object.keys(testSuites).forEach(key => {
      console.log(`  ${colors.cyan}${key.padEnd(15)}${colors.reset} - ${testSuites[key].description}`);
    });
    console.log('\nContoh:');
    console.log('  node run-tests.js all          # Jalankan semua test');
    console.log('  node run-tests.js functional   # Jalankan functional tests');
    console.log('  node run-tests.js security     # Jalankan security tests');
    console.log('  node run-tests.js ui           # Buka Cypress UI');
    process.exit(0);
  }

  const suite = testSuites[testType];

  if (!suite) {
    log.error(`Test type '${testType}' tidak ditemukan!`);
    log.info('Gunakan "node run-tests.js help" untuk melihat daftar test yang tersedia');
    process.exit(1);
  }

  try {
    log.info(`Mode: ${testType}`);
    await runCommand(suite.command, suite.description);
    log.title('Test Suite Selesai!');
    process.exit(0);
  } catch (error) {
    log.title('Test Suite Gagal!');
    process.exit(1);
  }
}

main();
