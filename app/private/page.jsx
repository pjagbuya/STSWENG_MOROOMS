'use client';

import { useState } from 'react';
import { z } from 'zod';

const fileSchema = z.object({
  file: z
    .custom()
    .refine(file => file && file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    })
    .refine(file => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only .jpg, .jpeg, .png files are accepted',
    }),
});

export default function PrivatePage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = async e => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        fileSchema.parse({ file });
        setFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result);
          // console.log(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        await APILogger.log(
          'handleFileChange',
          'FILE-VALIDATION',
          'files',
          null,
          { fileName: file.name },
          error.errors[0].message,
        );
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt={file.name} />}
    </div>
  );
}
