'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

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

export async function createContract(data: {
  startup_id: string
  title: string
  type: string
  url?: string
  status?: string
}) {
  try {
    const contract = await db.contract.create({
      data
    })
    revalidatePath('/startup')
    return { success: true, contract }
  } catch (error) {
    console.error('Error creating contract:', error)
    return { success: false, error: 'Falha ao criar contrato' }
  }
}

export async function updateContract(id: string, data: any) {
  try {
    await db.contract.update({
      where: { id },
      data
    })
    revalidatePath('/startup')
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
