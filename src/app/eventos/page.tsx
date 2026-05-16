'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { 
  Globe, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Plus, 
  Search,
  Trash2,
  FileText,
  Clock
} from 'lucide-react';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '@/lib/actions/announcements';
import { useAuth } from '@/context/AuthContext';

const EventsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAnnouncements();
    setItems(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createAnnouncement({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      link: formData.get('link') as string,
      start_date: new Date(formData.get('start_date') as string),
      end_date: new Date(formData.get('end_date') as string),
    });
    setIsModalOpen(false);
    loadData();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Eventos & Editais</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Fique por dentro das oportunidades e eventos do ecossistema.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="premium-gradient" 
            style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Novo Evento/Edital
          </button>
        )}
      </div>

      <div className="card premium-shadow">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input placeholder="Buscar por título ou descrição..." style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.9rem' }} />
          </div>
          <select style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white', fontSize: '0.9rem' }}>
            <option>Todos</option>
            <option>Eventos</option>
            <option>Editais</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '99px', 
                  background: item.type === 'EVENT' ? 'var(--primary)15' : 'var(--secondary)', 
                  color: item.type === 'EVENT' ? 'var(--primary)' : 'var(--muted-foreground)',
                  fontWeight: 'bold'
                }}>
                  {item.type === 'EVENT' ? 'EVENTO' : 'EDITAL'}
                </span>
                {user?.role === 'admin' && (
                  <button onClick={() => deleteAnnouncement(item.id).then(loadData)} style={{ color: 'var(--destructive)' }}><Trash2 size={16} /></button>
                )}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                  <Calendar size={14} /> {new Date(item.start_date).toLocaleDateString('pt-BR')} - {new Date(item.end_date).toLocaleDateString('pt-BR')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                  <Clock size={14} /> Inscrições até {new Date(item.end_date).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="premium-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none' }}>
                Saber Mais <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Evento / Edital">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Título</label>
            <input name="title" required placeholder="Ex: Hackathon Órbita 2026" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tipo</label>
            <select name="type" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white' }}>
              <option value="EVENT">Evento</option>
              <option value="EDITAL">Edital / Oportunidade</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Descrição</label>
            <textarea name="description" required rows={3} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Início</label>
              <input name="start_date" type="date" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Fim / Prazo</label>
              <input name="end_date" type="date" required style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Link Externo</label>
            <input name="link" type="url" placeholder="https://..." style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: '600' }}>Publicar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventsPage;
