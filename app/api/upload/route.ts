import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine file type and create appropriate directory
    const fileType = file.type.split('/')[0];
    const directory = fileType === 'image' ? 
      (file.name.includes('logo') ? 'logos' : 'backgrounds') : 
      'vcards';

    // Create the base upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', directory);
    await mkdir(uploadDir, { recursive: true });

    // Use original filename
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);
    
    return NextResponse.json({
      url: `/${directory}/${file.name}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
} 