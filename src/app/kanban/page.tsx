'use client';

import React, { useState, useEffect } from 'react';
import { KanbanColumn, KanbanCard } from '@/components/ui/Kanban';
import Modal from '@/components/ui/Modal';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare,
  Trash2
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getTasks, createTask, updateTask, moveTask, deleteTask } from '@/lib/actions/tasks';

const COLUMNS = [
  { id: 'TODO', title: 'A Fazer', color: '#f59e0b' },
  { id: 'IN_PROGRESS', title: 'Em Andamento', color: '#3b82f6' },
  { id: 'IN_VALIDATION', title: 'Em Validação', color: '#8b5cf6' },
  { id: 'DONE', title: 'Concluído', color: '#10b981' },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const STARTUP_ID = 'startup-123'; // Mock

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    const data = await getTasks(STARTUP_ID);
    setTasks(data);
    setLoading(false);
  }

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveTask(tasks.find((t) => t.id === active.id));
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = tasks.some((t) => t.id === activeId);
    const isOverTask = tasks.some((t) => t.id === overId);

    if (isActiveTask && isOverTask) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === activeId);
        const newIndex = items.findIndex((t) => t.id === overId);
        
        const activeTask = items[oldIndex];
        const overTask = items[newIndex];

        if (activeTask.status !== overTask.status) {
          activeTask.status = overTask.status;
          return arrayMove(items, oldIndex, newIndex);
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    const isOverColumn = COLUMNS.some((c) => c.id === overId);
    if (isActiveTask && isOverColumn) {
      setTasks((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId);
        items[activeIndex].status = overId;
        return [...items];
      });
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTaskObj = tasks.find((t) => t.id === active.id);
    if (activeTaskObj) {
      // Sync with DB
      await moveTask(activeTaskObj.id, activeTaskObj.status, tasks.indexOf(activeTaskObj));
    }

    setActiveTask(null);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: STARTUP_ID,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string || 'TODO',
      order: tasks.length
    };

    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }

    setIsModalOpen(false);
    setEditingTask(null);
    loadTasks();
  }

  async function handleDelete(id: string) {
    if (confirm('Deseja excluir esta tarefa?')) {
      await deleteTask(id);
      loadTasks();
    }
  }

  return (
    <div style={{ height: 'calc(100vh - 12rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Kanban & Tarefas</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Arraste e solte cards para gerenciar seu fluxo de trabalho.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="premium-gradient" 
            style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Nova Tarefa
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: '1.5rem', minWidth: 'max-content', height: '100%' }}>
            {COLUMNS.map((col) => (
              <KanbanColumn 
                key={col.id} 
                id={col.id}
                title={col.title} 
                count={tasks.filter(t => t.status === col.id).length} 
                color={col.color}
              >
                <SortableContext items={tasks.filter(t => t.status === col.id).map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {tasks.filter(t => t.status === col.id).map((task) => (
                    <KanbanCard 
                      key={task.id} 
                      id={task.id}
                      title={task.title} 
                      subtitle={task.description}
                      onEdit={() => { setEditingTask(task); setIsModalOpen(true); }}
                    />
                  ))}
                </SortableContext>
              </KanbanColumn>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div style={{ transform: 'rotate(3deg)' }}>
                <KanbanCard 
                  id={activeTask.id}
                  title={activeTask.title} 
                  subtitle={activeTask.description}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Título</label>
            <input name="title" required defaultValue={editingTask?.title} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Descrição</label>
            <textarea name="description" defaultValue={editingTask?.description} rows={3} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Status Inicial</label>
            <select name="status" defaultValue={editingTask?.status || 'TODO'} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white' }}>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {editingTask && (
              <button 
                type="button" 
                onClick={() => handleDelete(editingTask.id)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--destructive)', color: 'var(--destructive)', fontWeight: '600' }}
              >
                <Trash2 size={18} />
              </button>
            )}
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" className="premium-gradient" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: '600' }}>Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
