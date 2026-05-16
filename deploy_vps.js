const { Client } = require('ssh2');
const { execSync } = require('child_process');
const fs = require('fs');

const config = {
  host: '187.127.11.172',
  port: 22,
  username: 'root',
  password: 'Magister25@#' // The password provided by the user
};

const ARCHIVE_NAME = 'orbita180_deploy.tar.gz';
const REMOTE_DIR = '/root/orbita180';

console.log('==========================================================');
console.log('  ORBITA 180 - NODE.JS SAFE DEPLOY (JARVIS v4.1)          ');
console.log('==========================================================\n');

console.log('[1/4] Compactando projeto localmente (excluindo node_modules, .next, dev.db)...');
try {
  if (fs.existsSync(ARCHIVE_NAME)) fs.unlinkSync(ARCHIVE_NAME);
  execSync(`tar czf ${ARCHIVE_NAME} --exclude=node_modules --exclude=.next --exclude=dev.db --exclude=.git --exclude=${ARCHIVE_NAME} --exclude=scripts .`);
  console.log('Compactação concluída.\n');
} catch (e) {
  console.error('Erro na compactação:', e.message);
  process.exit(1);
}

const conn = new Client();
conn.on('ready', () => {
  console.log('[2/4] Conexão SSH estabelecida. Transferindo arquivo via SFTP...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    sftp.fastPut(`./${ARCHIVE_NAME}`, `/root/${ARCHIVE_NAME}`, (err) => {
      if (err) throw err;
      console.log('Transferência concluída!\n');
      
      console.log('[3/4] Descompactando e configurando ambiente na VPS...');
      const commands = `
        mkdir -p ${REMOTE_DIR} &&
        tar -xzf /root/${ARCHIVE_NAME} -C ${REMOTE_DIR} &&
        cd ${REMOTE_DIR} &&
        echo '==> Instalando dependencias (npm install)...' &&
        npm install --omit=dev &&
        echo '==> Configurando banco de dados Prisma...' &&
        mkdir -p data &&
        export DATABASE_URL="file:${REMOTE_DIR}/data/prod.db" &&
        npx prisma db push --accept-data-loss &&
        echo '==> Build Next.js...' &&
        npm run build &&
        echo '==> Reiniciando PM2...' &&
        pm2 describe orbita180 > /dev/null 2>&1 && pm2 restart orbita180 || pm2 start npm --name orbita180 -- start -- --port 3001 &&
        pm2 save &&
        echo 'DEPLOY FINALIZADO COM SUCESSO'
      `;
      
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('\n[4/4] Processo remoto finalizado. Código:', code);
          conn.end();
        }).on('data', (data) => {
          process.stdout.write(data.toString('utf8'));
        }).stderr.on('data', (data) => {
          process.stderr.write(data.toString('utf8'));
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err.message);
}).connect(config);
