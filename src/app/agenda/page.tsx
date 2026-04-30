'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Video, Plus, ChevronLeft, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';

type EventType = 'Mentoria' | 'Pitch' | 'Interna' | 'Evento';

interface AgendaEvent {
  id: number;
  title: string;
  time: string;
  endTime: string;
  type: EventType;
  location: string;
  attendees: string;
  color: string;
  description?: string;
}

const typeColors: Record<EventType, string> = {
  Mentoria: '#3b82f6',
  Pitch: '#10b981',
  Interna: '#8b5cf6',
  Evento: '#f59e0b',
};

const INITIAL_EVENTS: AgendaEvent[] = [
  { id: 1, title: 'Mentoria de Vendas B2B', time: '10:00', endTime: '11:30', type: 'Mentoria', location: 'Google Meet', attendees: 'Daniel, Mentor Silva', color: '#3b82f6', description: 'Foco em estratégias de prospecção e pipeline de vendas.' },
  { id: 2, title: 'Reunião com Investidor (Anjo)', time: '14:00', endTime: '15:00', type: 'Pitch', location: 'Zoom', attendees: 'Aline, Daniel', color: '#10b981', description: 'Apresentação do deck e discussão de termo de investimento.' },
  { id: 3, title: 'Check-in de Sprint', time: '16:00', endTime: '16:30', type: 'Interna', location: 'Sala 3 (Hub)', attendees: 'Equipe TechInova', color: '#8b5cf6' },
];

const EMPTY_FORM = { title: '', time: '09:00', endTime: '10:00', type: 'Mentoria' as EventType, location: '', attendees: '', description: '' };

export default function AgendaPage() {
  const [activeView, setActiveView] = useState<'semana' | 'mes'>('semana');
  const [events, setEvents] = useState<AgendaEvent[]>(INITIAL_EVENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [detailEvent, setDetailEvent] = useState<AgendaEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState({ month: 4, year: 2026 }); // Abril 2026
  const [selectedDay, setSelectedDay] = useState(27);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const openCreate = () => {
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    setDetailEvent(null);
    setModalOpen(true);
  };

  const openEdit = (ev: AgendaEvent) => {
    setEditingEvent(ev);
    setForm({ title: ev.title, time: ev.time, endTime: ev.endTime, type: ev.type, location: ev.location, attendees: ev.attendees, description: ev.description ?? '' });
    setDetailEvent(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const color = typeColors[form.type];
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...editingEvent, ...form, color } : e));
    } else {
      setEvents(prev => [...prev, { id: Date.now(), ...form, color }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDetailEvent(null);
  };

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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', background: 'var(--secondary)', padding: '0.25rem', borderRadius: 'var(--radius)' }}>
            {(['semana', 'mes'] as const).map(v => (
              <button key={v} onClick={() => setActiveView(v)} style={{ padding: '0.5rem 1rem', borderRadius: 'calc(var(--radius) - 4px)', fontSize: '0.85rem', fontWeight: '600', background: activeView === v ? 'white' : 'transparent', color: activeView === v ? 'var(--primary)' : 'var(--muted-foreground)', boxShadow: activeView === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
                {v === 'semana' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
          <button onClick={openCreate} className="premium-gradient" style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Novo Evento
          </button>
        </div>
      </div>

      {/* Calendar Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
        {/* Left sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {/* Mini Calendar */}
          <div className="card premium-shadow">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{monthNames[currentMonth.month - 1]} {currentMonth.year}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setCurrentMonth(p => p.month === 1 ? { month: 12, year: p.year - 1 } : { month: p.month - 1, year: p.year })} style={{ padding: '0.25rem', borderRadius: '4px', background: 'var(--secondary)', display: 'flex', alignItems: 'center' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setCurrentMonth(p => p.month === 12 ? { month: 1, year: p.year + 1 } : { month: p.month + 1, year: p.year })} style={{ padding: '0.25rem', borderRadius: '4px', background: 'var(--secondary)', display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '0.85rem' }}>
              {[...Array(firstDayOfMonth)].map((_, i) => <div key={`e-${i}`} />)}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDay;
                const isToday = day === 27 && currentMonth.month === 4 && currentMonth.year === 2026;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      padding: '0.35rem', borderRadius: '50%', cursor: 'pointer',
                      background: isSelected ? 'var(--primary)' : isToday ? '#dbeafe' : 'transparent',
                      color: isSelected ? 'white' : isToday ? 'var(--primary)' : 'inherit',
                      fontWeight: isToday || isSelected ? '700' : '400',
                      transition: 'background 0.15s'
                    }}
                    className="cal-day"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="card premium-shadow">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Filtros</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(typeColors).map(([type, color]) => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: color, width: '15px', height: '15px' }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    {type}s
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick add */}
          <button
            onClick={openCreate}
            style={{ padding: '0.875rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            className="add-event-btn"
          >
            <Plus size={16} /> Adicionar evento
          </button>
        </div>

        {/* Main schedule */}
        <div className="card premium-shadow" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {selectedDay} de {monthNames[currentMonth.month - 1]}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                {events.length} evento{events.length !== 1 ? 's' : ''} programado{events.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--secondary)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
              <Plus size={15} /> Evento
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
                <CalendarIcon size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ fontWeight: '600' }}>Nenhum evento neste dia</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Clique em &quot;Novo Evento&quot; para adicionar.</p>
              </div>
            )}
            {events.map(ev => (
              <div key={ev.id} style={{ display: 'flex', gap: '1.5rem' }} onClick={() => setDetailEvent(detailEvent?.id === ev.id ? null : ev)}>
                <div style={{ width: '64px', textAlign: 'right', fontWeight: '600', color: 'var(--muted-foreground)', fontSize: '0.9rem', paddingTop: '1.1rem', flexShrink: 0 }}>
                  {ev.time}
                </div>
                <div style={{
                  flex: 1, borderLeft: `4px solid ${ev.color}`,
                  padding: '1rem 1.5rem', background: `${ev.color}0d`, borderRadius: '0 12px 12px 0',
                  cursor: 'pointer', transition: 'background 0.15s'
                }} className="event-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--foreground)' }}>{ev.title}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '99px', background: `${ev.color}20`, color: ev.color, fontWeight: '700', border: `1px solid ${ev.color}40` }}>{ev.type}</span>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(ev); }} style={{ padding: '0.25rem', borderRadius: '6px', color: 'var(--muted-foreground)', background: 'transparent', cursor: 'pointer' }} className="action-btn">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }} style={{ padding: '0.25rem', borderRadius: '6px', color: '#ef4444', background: 'transparent', cursor: 'pointer' }} className="action-btn">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} /> {ev.time} – {ev.endTime}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {ev.location.includes('Meet') || ev.location.includes('Zoom') ? <Video size={14} /> : <MapPin size={14} />} {ev.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={14} /> {ev.attendees}
                    </span>
                  </div>
                  {detailEvent?.id === ev.id && ev.description && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${ev.color}30`, fontSize: '0.85rem', color: 'var(--foreground)' }}>
                      {ev.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setModalOpen(false)}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ padding: '0.375rem', borderRadius: '8px', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Título *</label>
                <input
                  type="text" placeholder="Nome do evento"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Início</label>
                  <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Fim</label>
                  <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Tipo</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(Object.keys(typeColors) as EventType[]).map(t => (
                    <button
                      key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                      style={{
                        padding: '0.375rem 0.875rem', borderRadius: '99px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                        background: form.type === t ? typeColors[t] : `${typeColors[t]}15`,
                        color: form.type === t ? 'white' : typeColors[t],
                        border: `1.5px solid ${typeColors[t]}40`
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Local / Link</label>
                <input type="text" placeholder="Ex: Google Meet, Sala 3, Zoom..." value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Participantes</label>
                <input type="text" placeholder="Ex: Daniel, Aline, Carlos..." value={form.attendees} onChange={e => setForm(p => ({ ...p, attendees: e.target.value }))} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.35rem' }}>Descrição (opcional)</label>
                <textarea placeholder="Pauta, links, observações..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', color: 'var(--muted-foreground)', background: 'white' }}>
                  Cancelar
                </button>
                <button onClick={handleSave} className="premium-gradient" style={{ padding: '0.625rem 1.5rem', borderRadius: '8px', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer' }}>
                  {editingEvent ? 'Salvar alterações' : 'Criar evento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cal-day:hover { background: var(--secondary) !important; }
        .event-card:hover { background: inherit; }
        .action-btn:hover { background: var(--secondary) !important; }
        .add-event-btn:hover { border-color: var(--primary); color: var(--primary); background: #eff6ff; }
      `}</style>
    </div>
  );
}
