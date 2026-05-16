'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

export async function getContracts(startupId: string) {
  try {
    return await db.contract.findMany({
      where: { startup_id: startupId },
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
}

export async function createContract(formData: FormData) {
  try {
    const startup_id = formData.get('startup_id') as string;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    let url = formData.get('url') as string || null;
    const status = 'ACTIVE';
    
    // Handle PDF upload
    const file = formData.get('file') as File;
    let file_url = null;
    
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      
      // Ensure directory exists
      const fs = require('fs');
      if (!fs.existsSync(join(process.cwd(), 'public', 'uploads'))) {
        fs.mkdirSync(join(process.cwd(), 'public', 'uploads'), { recursive: true });
      }
      
      await writeFile(filepath, buffer);
      file_url = `/uploads/${filename}`;
    }

    const contract = await db.contract.create({
      data: { startup_id, title, type, url, file_url, status }
    })
    revalidatePath('/contratos')
    return { success: true, contract }
  } catch (error) {
    console.error('Error creating contract:', error)
    return { success: false, error: 'Falha ao criar contrato' }
  }
}

export async function updateContract(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    let url = formData.get('url') as string || null;
    
    // Handle PDF upload
    const file = formData.get('file') as File;
    let file_url = undefined;
    
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      
      const fs = require('fs');
      if (!fs.existsSync(join(process.cwd(), 'public', 'uploads'))) {
        fs.mkdirSync(join(process.cwd(), 'public', 'uploads'), { recursive: true });
      }
      
      await writeFile(filepath, buffer);
      file_url = `/uploads/${filename}`;
    }

    await db.contract.update({
      where: { id },
      data: file_url !== undefined ? { title, type, url, file_url } : { title, type, url }
    })
    revalidatePath('/contratos')
    return { success: true }
  } catch (error) {
    console.error('Error updating contract:', error)
    return { success: false, error: 'Falha ao atualizar contrato' }
  }
}

export async function deleteContract(id: string) {
  try {
    await db.contract.delete({
      where: { id }
    })
    revalidatePath('/startup')
    return { success: true }
  } catch (error) {
    console.error('Error deleting contract:', error)
    return { success: false, error: 'Falha ao excluir contrato' }
  }
}