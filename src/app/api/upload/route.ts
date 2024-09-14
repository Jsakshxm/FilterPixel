// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parsing to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), '/public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Handle image upload
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({
    uploadDir, // Save uploaded images here
    keepExtensions: true, // Keep file extensions
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ message: 'File upload failed' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file; // Handle both array and non-array case

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = file.filepath; // The uploaded file path

    // Return the file path as a response
    res.status(200).json({ filePath });
  });
}
