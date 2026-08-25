const { spawn } = require('child_process');

const p = spawn('npx', ['vercel', 'link'], { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });

p.stdout.on('data', d => {
  const str = d.toString();
  process.stdout.write(str);
  
  if (str.includes('Set up')) {
    p.stdin.write('y\n');
  }
  if (str.includes('Which scope')) {
    p.stdin.write('\n');
  }
  if (str.includes('Link to existing project?')) {
    p.stdin.write('y\n');
  }
  if (str.includes("What's the name of your existing project?")) {
    p.stdin.write('terraza-sonora\n');
  }
  if (str.includes('In which directory')) {
    p.stdin.write('\n');
  }
});

p.stderr.on('data', d => {
  process.stderr.write(d.toString());
});

p.on('close', code => {
  console.log(`Process exited with code ${code}`);
});
