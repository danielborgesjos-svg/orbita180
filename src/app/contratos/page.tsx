'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Download, 
  ExternalLink, 
  Trash2, 
  Edit,
  Filter,
  FileCheck,
  Users,
  Shield
} from 'lucide-react';
import { getContracts, createContract, updateContract, deleteContract } from '@/lib/actions/contracts';

const ContractsPage = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock startup ID for demonstration (in a real app, this would come from the user's context/session)
  const STARTUP_ID = 'startup-123';

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    setLoading(true);
    const data = await getContracts(STARTUP_ID);
    setContracts(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      startup_id: STARTUP_ID,
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      url: formData.get('url') as string,
      status: 'ACTIVE'
    };

    if (editingContract) {
      await updateContract(editingContract.id, data);
    } else {
      await createContract(data);
    }

    setIsModalOpen(false);
    setEditingContract(null);
    loadContracts();
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      await deleteContract(id);
      loadContracts();
    }
  }

  const contractTypes = [
    { value: 'CLIENT', label: 'Contrato de Cliente', icon: Users, color: 'var(--primary)' },
    { value: 'SOCIETARY', label: 'Contrato Societário', icon: Shield, color: '#8b5cf6' },
    { value: 'PARTNERSHIP', label: 'Parceria', icon: FileCheck, color: '#10b981' },
    { value: 'OTHER', label: 'Outros', icon: FileText, color: 'var(--muted-foreground)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Gestão de Contratos</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Gerencie seus documentos legais, societários e parcerias.</p>
        </div>
        <button 
          onClick={() => { setEditingContract(null); setIsModalOpen(true); }}
          className="premium-gradient" 
          style={{ color: 'white', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Novo Contrato
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {contractTypes.map((type) => (
          <div key={type.value} className="card premium-shadow" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${type.color}15`, color: type.color }}>
              <type.icon size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{type.label}</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {contracts.filter(c => c.type === type.value).length}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card premium-shadow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
            <input 
              type="text" 
              placeholder="Buscar contratos..." 
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.9rem' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            <Filter size={18} /> Filtrar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {loading ? (
            <p>Carregando contratos...</p>
          ) : contracts.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
              <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Nenhum contrato cadastrado.</p>
            </div>
          ) : (
            contracts.map((contract) => (
              <div key={contract.id} className="card" style={{ border: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--secondary)', color: 'var(--primary)' }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setEditingContract(contract); setIsModalOpen(true); }} style={{ color: 'var(--muted-foreground)' }} title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(contract.id)} style={{ color: 'var(--destructive)' }} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{contract.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'var(--secondary)', color: 'var(--primary)', fontWeight: '600' }}>
                    {contractTypes.find(t => t.value === contract.type)?.label || 'Outros'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                    {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <a href={contract.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <ExternalLink size={14} /> Visualizar
                  </a>
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <Download size={14} /> Baixar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingContract(null); }}
        title={editingContract ? 'Editar Contrato' : 'Adicionar Novo Contrato'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Título do Contrato</label>
            <input 
              name="title" 
              required 
              defaultValue={editingContract?.title}
              placeholder="Ex: Acordo de Sócios, Contrato de Prestação de Serviços..." 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tipo de Contrato</label>
            <select 
              name="type" 
              required 
              defaultValue={editingContract?.type || 'CLIENT'}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white' }}
            >
              <option value="CLIENT">Contrato de Cliente</option>
              <option value="SOCIETARY">Contrato Societário</option>
              <option value="PARTNERSHIP">Parceria</option>
              <option value="OTHER">Outros</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Link do Documento (URL)</label>
            <input 
              name="url" 
              type="url"
              defaultValue={editingContract?.url}
              placeholder="https://drive.google.com/..." 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              onClick={() => { setIsModalOpen(false); setEditingContract(null); }}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontWeight: '600' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="premium-gradient" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', color: 'white', fontWeight: '600' }}
            >
              {editingContract ? 'Salvar Alterações' : 'Salvar Contrato'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContractsPage;
