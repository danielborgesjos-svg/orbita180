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
  console.log('Conexão SSH estabelecida. Aplicando Nginx HTTP-only...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('./orbita180_nginx_temp', '/etc/nginx/sites-available/orbita180', (err) => {
      if (err) throw err;
      conn.exec('nginx -t && systemctl restart nginx', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          console.log('Nginx configurado (HTTP-only). O site deve estar acessível em http://orbita180.magistertech.com.br');
          conn.end();
        });
      });
    });
  });
}).on('error', err => console.error(err)).connect(config);
