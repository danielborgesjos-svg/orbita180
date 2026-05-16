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
  console.log('Conexão SSH estabelecida. Configurando Nginx Step 1...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('./orbita180_nginx_temp', '/etc/nginx/sites-available/orbita180', (err) => {
      if (err) throw err;
      
      const step1 = `
        ln -sf /etc/nginx/sites-available/orbita180 /etc/nginx/sites-enabled/ &&
        nginx -t &&
        systemctl restart nginx &&
        certbot --nginx -d orbita180.magistertech.com.br --non-interactive --agree-tos -m contato@magistertech.com.br
      `;
      
      conn.exec(step1, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          console.log('Passo 1 (HTTP + Certbot) finalizado. Aplicando Config Final SSL...');
          
          sftp.fastPut('./orbita180_nginx', '/etc/nginx/sites-available/orbita180', (err) => {
            if (err) throw err;
            conn.exec('nginx -t && systemctl restart nginx', (err, stream2) => {
              if (err) throw err;
              stream2.on('close', () => {
                console.log('Nginx configurado com Sucesso e SSL Ativo!');
                conn.end();
              });
            });
          });
        }).on('data', data => process.stdout.write(data.toString()))
          .stderr.on('data', data => process.stderr.write(data.toString()));
      });
    });
  });
}).on('error', err => console.error(err)).connect(config);
