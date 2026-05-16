const { Client } = require('ssh2');
const fs = require('fs');

const config = {
  host: '187.127.11.172',
  port: 22,
  username: 'root',
  password: 'Magister25@#'
};

const conn = new Client();
conn.on('ready', () => {
  console.log('Enviando script de Seed...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('./scripts/seed.js', '/root/orbita180/seed.js', (err) => {
      if (err) throw err;
      console.log('Script enviado. Executando...');
      conn.exec('cd /root/orbita180 && export DATABASE_URL="file:/root/orbita180/data/prod.db" && node seed.js', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Seed finalizado na VPS. Código:', code);
          conn.end();
        }).on('data', data => process.stdout.write(data.toString()))
          .stderr.on('data', data => process.stderr.write(data.toString()));
      });
    });
  });
}).on('error', err => console.error(err)).connect(config);
