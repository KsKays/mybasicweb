#!/usr/bin/env node

/**
 * Simple test runner script for MyBasicWeb
 * This script helps run specific test suites or all tests
 */

const { execSync } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n${colors.bold}🧪 ${description}${colors.reset}`, 'blue');
    log(`Running: ${command}`, 'yellow');
    
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    log(`✅ ${description} completed successfully!`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed!`, 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  log(`${colors.bold}🎭 MyBasicWeb Playwright Test Runner${colors.reset}`, 'blue');
  log('='.repeat(50), 'blue');

  switch (command) {
    case 'all':
    case undefined:
      log('Running all tests...', 'yellow');
      runCommand('npx playwright test', 'Full Test Suite');
      break;

    case 'form':
      log('Running registration form tests...', 'yellow');
      runCommand('npx playwright test tests/registration-form.spec.js', 'Form Tests');
      break;

    case 'api':
      log('Running API endpoint tests...', 'yellow');
      runCommand('npx playwright test tests/api-endpoints.spec.js', 'API Tests');
      break;

    case 'visual':
      log('Running visual and accessibility tests...', 'yellow');
      runCommand('npx playwright test tests/visual-accessibility.spec.js', 'Visual Tests');
      break;

    case 'db':
    case 'database':
      log('Running database integration tests...', 'yellow');
      runCommand('npx playwright test tests/database-integration.spec.js', 'Database Tests');
      break;

    case 'perf':
    case 'performance':
      log('Running performance and load tests...', 'yellow');
      runCommand('npx playwright test tests/performance-load.spec.js', 'Performance Tests');
      break;

    case 'headed':
      log('Running tests in headed mode (visible browser)...', 'yellow');
      runCommand('npx playwright test --headed', 'Headed Mode Tests');
      break;

    case 'debug':
      log('Running tests in debug mode...', 'yellow');
      runCommand('npx playwright test --debug', 'Debug Mode Tests');
      break;

    case 'ui':
      log('Opening Playwright UI mode...', 'yellow');
      runCommand('npx playwright test --ui', 'UI Mode');
      break;

    case 'video-on':
      log('Running tests with video recording enabled...', 'yellow');
      runCommand('PLAYWRIGHT_VIDEO_MODE=on npx playwright test', 'Video Recording Tests');
      break;

    case 'video-off':
      log('Running tests with video recording disabled...', 'yellow');
      runCommand('PLAYWRIGHT_VIDEO_MODE=off npx playwright test', 'No Video Tests');
      break;

    case 'video-high':
      log('Running tests with high quality video recording...', 'yellow');
      runCommand('PLAYWRIGHT_VIDEO_MODE=high npx playwright test', 'High Quality Video Tests');
      break;

    case 'report':
      log('Opening test report...', 'yellow');
      runCommand('npx playwright show-report', 'Test Report');
      break;

    case 'install':
      log('Installing Playwright browsers...', 'yellow');
      runCommand('npx playwright install', 'Browser Installation');
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      log(`Unknown command: ${command}`, 'red');
      showHelp();
      break;
  }

  log('\n🎉 Test runner finished!', 'green');
}

function showHelp() {
  log('\n📚 Available Commands:', 'blue');
  log('');
  log('  all, (default)    Run all test suites', 'yellow');
  log('  form              Run registration form tests', 'yellow');
  log('  api               Run API endpoint tests', 'yellow');
  log('  visual            Run visual and accessibility tests', 'yellow');
  log('  db, database      Run database integration tests', 'yellow');
  log('  perf, performance Run performance and load tests', 'yellow');
  log('  headed            Run tests with visible browser', 'yellow');
  log('  debug             Run tests in debug mode', 'yellow');
  log('  ui                Open Playwright UI mode', 'yellow');
  log('');
  log('📹 Video Recording Options:', 'blue');
  log('  video-on          Run tests with video recording ON', 'yellow');
  log('  video-off         Run tests with video recording OFF', 'yellow');
  log('  video-high        Run tests with high quality video', 'yellow');
  log('');
  log('🛠️  Utility Commands:', 'blue');
  log('  report            Open test report', 'yellow');
  log('  install           Install Playwright browsers', 'yellow');
  log('  help, --help, -h  Show this help message', 'yellow');
  log('');
  log('📝 Examples:', 'blue');
  log('  node test-runner.js form', 'green');
  log('  node test-runner.js api', 'green');
  log('  node test-runner.js headed', 'green');
  log('  node test-runner.js video-on', 'green');
  log('  node test-runner.js debug', 'green');
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { runCommand, log };