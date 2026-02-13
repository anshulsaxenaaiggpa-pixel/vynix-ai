const { spawn } = require('child_process');

const child = spawn('npx', ['drizzle-kit', 'push'], {
    cwd: process.cwd(),
    stdio: ['pipe', 'inherit', 'inherit']
});

// Wait for the prompt to appear
setTimeout(() => {
    // Send down arrow key to select "Yes"
    child.stdin.write('\x1B[B');

    setTimeout(() => {
        // Press Enter
        child.stdin.write('\n');
    }, 500);
}, 8000);

child.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
    process.exit(code);
});
