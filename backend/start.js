const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Database Server...');

function startServer() {
  console.log('📡 Launching server process...');
  
  const serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  serverProcess.on('close', (code) => {
    console.log(`❌ Server process exited with code ${code}`);
    console.log('🔄 Restarting server in 3 seconds...');
    
    setTimeout(() => {
      startServer();
    }, 3000);
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server process:', error);
    console.log('🔄 Restarting server in 5 seconds...');
    
    setTimeout(() => {
      startServer();
    }, 5000);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

startServer(); 