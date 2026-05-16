const TOKEN = '9BvFFv1EGHUvGWIiYI1H4R26eW9pBpJRpsOHwk677421a29b';
const DOMAIN = 'magistertech.com.br';
const SUBDOMAIN = 'orbita180';
const IP = '187.127.11.172';

async function updateDNS() {
  console.log(`Buscando registros DNS para ${DOMAIN}...`);
  
  try {
    const response = await fetch(`https://api.hostinger.com/v1/domains/${DOMAIN}/dns-records`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao buscar registros:', error);
      return;
    }

    const data = await response.json();
    const records = data.data || [];
    
    const existing = records.find(r => r.name === SUBDOMAIN && r.type === 'A');
    
    if (existing) {
      console.log(`Registro existente encontrado (ID: ${existing.id}). Atualizando para ${IP}...`);
      const updateRes = await fetch(`https://api.hostinger.com/v1/domains/${DOMAIN}/dns-records/${existing.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'A',
          name: SUBDOMAIN,
          value: IP,
          ttl: 3600
        })
      });
      
      if (updateRes.ok) {
        console.log('DNS atualizado com sucesso!');
      } else {
        console.error('Erro ao atualizar DNS:', await updateRes.json());
      }
    } else {
      console.log(`Registro ${SUBDOMAIN} não encontrado. Criando novo registro A...`);
      const createRes = await fetch(`https://api.hostinger.com/v1/domains/${DOMAIN}/dns-records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'A',
          name: SUBDOMAIN,
          value: IP,
          ttl: 3600
        })
      });
      
      if (createRes.ok) {
        console.log('DNS criado com sucesso!');
      } else {
        console.error('Erro ao criar DNS:', await createRes.json());
      }
    }
  } catch (err) {
    console.error('Falha na comunicação com Hostinger:', err);
  }
}

updateDNS();
