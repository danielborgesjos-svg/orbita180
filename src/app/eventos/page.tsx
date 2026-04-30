'use client';

import React from 'react';
import { 
  Globe, 
  Calendar, 
  Award, 
  FileText, 
  Search, 
  Filter, 
  ArrowRight,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';

const EventsPage = () => {
  const editais = [
    { title: 'Finep Startup 2024', deadline: '20 Jun', budget: 'R$ 500k', type: 'Fomento' },
    { title: 'BNDES Garagem', deadline: '15 Jul', budget: 'R$ 200k', type: 'Aceleração' },
    { title: 'Sebrae Catalisa', deadline: '30 Ago', budget: 'R$ 150k', type: 'Inovação' },
  ];

  const events = [
    { title: 'Demoday Órbita 180', date: '15 Mai', time: '14:00', location: 'Hub de Inovação / Online', tag: 'Destaque' },
    { title: 'Web Summit Rio', date: '18-21 Jun', time: 'Dia todo', location: 'Rio de Janeiro', tag: 'Global' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Eventos, Editais & Programas</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Fique por dentro das oportunidades e eventos do ecossistema.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--secondary)', padding: '0.4rem 1rem', borderRadius: 'var(--radius)' }}>
          <Search size={18} color="var(--muted-foreground)" />
          <input placeholder="Buscar oportunidades..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.85rem' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Open Editais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} color="var(--primary)" />
              Editais Abertos
            </h3>
            <button style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Ver Todos</button>
          </div>
          
          {editais.map((edital, i) => (
            <div key={i} className="card premium-shadow" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: 'var(--secondary)', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'inline-block' }}>{edital.type}</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{edital.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Até {edital.deadline}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Award size={14} /> Até {edital.budget}</p>
                </div>
              </div>
              <button style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--secondary)', color: 'var(--primary)' }}>
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={22} color="var(--primary)" />
              Próximos Eventos
            </h3>
            <button style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Minha Agenda</button>
          </div>

          {events.map((event, i) => (
            <div key={i} className="card premium-shadow" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', minWidth: '60px', padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.8 }}>MAI</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{event.date.split(' ')[0]}</p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{event.title}</h4>
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontWeight: '700' }}>{event.tag}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {event.time}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.location}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="card premium-shadow" style={{ background: 'var(--muted)', border: '1px dashed var(--border)', textAlign: 'center', padding: '2rem' }}>
            <Globe size={32} color="var(--muted-foreground)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Nenhum outro evento confirmado para esta semana.</p>
            <button style={{ marginTop: '1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Explorar Calendário Global</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
