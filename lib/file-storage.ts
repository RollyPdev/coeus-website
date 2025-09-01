import fs from 'fs';
import path from 'path';

export async function saveImageLocally(base64Image: string, studentId: string): Promise<string> {
  try {
    // Remove data:image/jpeg;base64, prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'students');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate filename
    const filename = `${studentId}-${Date.now()}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    
    // Save file
    fs.writeFileSync(filepath, base64Data, 'base64');
    
    // Return public URL
    return `/uploads/students/${filename}`;
  } catch (error) {
    console.error('Local file save error:', error);
    throw error;
  }
}