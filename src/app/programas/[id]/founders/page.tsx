'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getFoundersByProgram } from '@/lib/actions/founders';
import { getProgramById } from '@/lib/actions/programs';
import FoundersTab from '../dashboard/FoundersTab';

export default function FoundersPage() {
  const params = useParams();
  const programId = params.id as string;
  const [founders, setFounders] = useState<any[]>([]);
  const [program, setProgram] = useState<any>(null);

  async function load() {
    const [f, p] = await Promise.all([getFoundersByProgram(programId), getProgramById(programId)]);
    setFounders(f);
    setProgram(p);
  }

  useEffect(() => { load(); }, [programId]);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <div>
        <Link href={`/programas/${programId}/dashboard`} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', color:'#64748B', fontSize:'0.85rem', fontWeight:600, textDecoration:'none', marginBottom:'0.75rem' }}>
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>
        <h1 style={{ fontSize:'2rem', fontWeight:900, color:'#0F172A' }}>
          Founders — {program?.name || '...'}
        </h1>
        <p style={{ color:'#64748B', fontSize:'0.9rem', marginTop:'0.25rem' }}>{program?.institution?.name}</p>
      </div>
      <FoundersTab founders={founders} programId={programId} onRefresh={load} />
    </div>
  );
}
