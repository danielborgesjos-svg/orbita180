'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Video, Plus, ChevronLeft, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAgendaEvents, createAgendaEvent, updateAgendaEvent, deleteAgendaEvent } from '@/lib/actions/agenda';

type EventType = 'Mentoria' | 'Pitch' | 'Interna' | 'Evento';

interface AgendaEvent {
  id: string;
  title: string;
  start_time: Date;
  end_time: Date;
  type: string;
  location: string;
  attendees: string;
  description?: string;
}

const typeColors: Record<string, string> = {
  Mentoria: '#3b82f6',
  Pitch: '#10b981',
  Interna: '#8b5cf6',
  Evento: '#f59e0b',
  MEETING: '#3b82f6',
};

const EMPTY_FORM = { title: '', start_time: '', end_time: '', type: 'Mentoria', location: '', attendees: '', description: '' };

export default function AgendaPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'semana' | 'mes'>('semana');
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [currentMonth, setCurrentMonth] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.startupId) {
      loadEvents(user.startupId);
    }
  }, [user]);

  async function loadEvents(startupId: string) {
    setLoading(true);
    const data = await getAgendaEvents(startupId);
    setEvents(data.map((e: any) => ({
      ...e,
      start_time: new Date(e.start_time),
      end_time: new Date(e.end_time)
    })));
    setLoading(false);
  }

  const handleSave = async () => {
    if (!form.title || !user?.startupId) return;
    
    const data = {
      startup_id: user.startupId,
      title: form.title,
      description: form.description,
      start_time: new Date(`${new Date().toISOString().split('T')[0]}T${form.start_time}`),
      end_time: new Date(`${new Date().toISOString().split('T')[0]}T${form.end_time}`),
      type: form.type,
      location: form.location,
      attendees: form.attendees
    };

    if (editingEvent) {
      await updateAgendaEvent(editingEvent.id, data);
    } else {
      await createAgendaEvent(data);
    }
    setModalOpen(false);
    loadEvents(user.startupId);
  };

  const handleDelete = async (id: string) => {
    await deleteAgendaEvent(id);
    if (user?.startupId) loadEvents(user.startupId);
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: 'calc(100vh - var(--header-height) - 4rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Agenda & Reuniões</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie seus compromissos, mentorias e reuniões de equipe.</p>
        </div>
        <button 
          onClick={() => { setEditingEvent(null); setForm(EMPTY_FORM); setModalOpen(true); }} 
          className="premium-gradient" 
          style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Novo Evento
        </button>
      </div>

      {/* Calendar Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
        {/* Left sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card premium-shadow">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{monthNames[currentMonth.month - 1]} {currentMonth.year}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '0.85rem' }}>
              {[...Array(firstDayOfMonth)].map((_, i) => <div key={`e-${i}`} />)}
              {[...Array(daysInMonth)].map((_, i) => (
                <div key={i} onClick={() => setSelectedDay(i+1)} style={{ padding: '0.35rem', borderRadius: '50%', cursor: 'pointer', background: selectedDay === i+1 ? 'var(--primary)' : 'transparent', color: selectedDay === i+1 ? 'white' : 'inherit' }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main schedule */}
        <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1.5rem' }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Eventos do Dia</h2>
           {loading ? <p>Carregando...</p> : events.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Nenhum evento agendado.</div>
           ) : events.map(ev => (
             <div key={ev.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
               <div style={{ fontWeight: 'bold', color: 'var(--primary)', width: '60px' }}>{ev.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
               <div style={{ flex: 1 }}>
                 <h4 style={{ fontWeight: 'bold' }}>{ev.title}</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{ev.location} • {ev.attendees}</p>
               </div>
               <button onClick={() => handleDelete(ev.id)} style={{ color: 'var(--destructive)' }}><Trash2 size={16} /></button>
             </div>
           ))}
        </div>
      </div>

      {/* Modal Placeholder */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '2rem' }}>
             <h3 style={{ marginBottom: '1.5rem' }}>Agendar Evento</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <input placeholder="Título" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
                 <input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
               </div>
               <input placeholder="Local/Link" value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
               <input placeholder="Participantes" value={form.attendees} onChange={e => setForm({...form, attendees: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }} />
               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                 <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '0.75rem' }}>Cancelar</button>
                 <button onClick={handleSave} className="premium-gradient" style={{ flex: 1, padding: '0.75rem', color: 'white', borderRadius: '8px' }}>Salvar Evento</button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
