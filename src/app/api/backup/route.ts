import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // In a real scenario, check admin permissions here using next-auth or similar
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Database file not found.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(dbPath);
    
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="backup_orbita180_${new Date().toISOString().split('T')[0]}.db"`,
        'Content-Type': 'application/octet-stream',
      },
    });

    return response;
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
}
