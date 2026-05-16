import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(10px)',
      padding: '4rem 1rem'
    }}>
      <div className="card premium-shadow animate-scale-up" style={{
        width: '95%',
        maxWidth: '850px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '28px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        overflow: 'hidden',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 2.5rem',
          borderBottom: '1px solid #F1F5F9',
          background: 'white'
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#0F172A' }}>{title}</h2>
          <button onClick={onClose} style={{ 
            color: '#94A3B8', 
            background: '#F8FAFC', 
            border: '1px solid #E2E8F0', 
            borderRadius: '14px', 
            padding: '0.6rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}>
            <X size={22} />
          </button>
        </div>
        <div style={{ padding: '2rem', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
