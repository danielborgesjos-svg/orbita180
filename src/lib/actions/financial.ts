'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getFinancialTransactions(startupId: string) {
  try {
    return await db.financialTransaction.findMany({
      where: { startup_id: startupId },
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching financial transactions:', error)
    return []
  }
}

export async function createFinancialTransaction(data: {
  startup_id: string
  description: string
  amount: number
  type: string
  category?: string
  date?: Date
}) {
  try {
    const transaction = await db.financialTransaction.create({
      data: {
        ...data,
        date: data.date || new Date()
      }
    })
    revalidatePath('/financeiro')
    return { success: true, transaction }
  } catch (error) {
    console.error('Error creating financial transaction:', error)
    return { success: false, error: 'Falha ao criar registro financeiro' }
  }
}

export async function updateFinancialTransaction(id: string, data: any) {
  try {
    await db.financialTransaction.update({
      where: { id },
      data
    })
    revalidatePath('/financeiro')
    return { success: true }
  } catch (error) {
    console.error('Error updating financial transaction:', error)
    return { success: false, error: 'Falha ao atualizar registro financeiro' }
  }
}

export async function deleteFinancialTransaction(id: string) {
  try {
    await db.financialTransaction.delete({
      where: { id }
    })
    revalidatePath('/financeiro')
    return { success: true }
  } catch (error) {
    console.error('Error deleting financial transaction:', error)
    return { success: false, error: 'Falha ao excluir registro financeiro' }
  }
}
