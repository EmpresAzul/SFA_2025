const { spawn } = require('child_process');
const os = require('os');

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        ips.push(interface.address);
      }
    }
  }
  
  return ips;
}

console.log('🚀 Iniciando servidor de desenvolvimento...\n');

const server = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

let serverStarted = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Local:') && !serverStarted) {
    serverStarted = true;
    
    console.log('\n🌐 LINKS PARA ACESSAR O SISTEMA:\n');
    
    // Links locais
    console.log('📍 ACESSO LOCAL (mesmo computador):');
    console.log('   http://localhost:3000');
    console.log('   http://127.0.0.1:3000\n');
    
    // Links da rede
    const ips = getLocalIPs();
    if (ips.length > 0) {
      console.log('🌍 ACESSO NA REDE LOCAL (outros dispositivos):');
      ips.forEach(ip => {
        console.log(`   http://${ip}:3000`);
      });
      console.log('');
    }
    
    console.log('✅ Servidor rodando! Escolha um dos links acima.\n');
    console.log('💡 Dica: Se um link não funcionar, tente o próximo da lista.\n');
    console.log('🔄 Para parar o servidor: Ctrl+C\n');
  }
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`\n🛑 Servidor encerrado com código ${code}`);
});

// Capturar Ctrl+C para encerrar graciosamente
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.kill('SIGINT');
  process.exit(0);
});