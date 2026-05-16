'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

const prisma = db;

export async function getCommunityPosts() {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: { 
          select: { 
            name: true,
            roles: {
              select: {
                role: { select: { name: true } }
              }
            }
          } 
        }
      }
    });
    return { success: true, posts };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao buscar posts.' };
  }
}

export async function createCommunityPost(userId: string, content: string, category: string = 'Geral', tags: string = '') {
  try {
    const post = await db.communityPost.create({
      data: {
        user_id: userId,
        content,
        category,
        tags
      }
    });
    revalidatePath('/comunidade');
    return { success: true, post };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao criar post.' };
  }
}

export async function likeCommunityPost(postId: string) {
  try {
    await prisma.communityPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }
    });
    revalidatePath('/comunidade');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Erro ao curtir post.' };
  }
}
