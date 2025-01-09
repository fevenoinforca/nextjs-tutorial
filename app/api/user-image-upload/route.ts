import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (file.size > 1000000) {
      return NextResponse.json({ error: 'File size exceeds 1MB limit' }, { status: 413 });
    }

    const email = formData.get('email') as string;

    const extension = path.extname(file?.name || '');
    const filePath = path.join(process.cwd(), 'public', 'users', `${email}${extension}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ filePath: `/users/${email}${extension}` });
  } catch (error) {
    console.error('Error uploading file:', error);

    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
