import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join } from 'path';

const IMAGES = [
  'hero-energy.jpg',
  'eon-strom.jpg',
  'eon-solar.jpg',
  'eon-emobility.jpg',
  'eon-waermepumpe.jpg',
  'eon-smarthome.jpg',
  'eon-gas.jpg',
  'blog-energy-tips.jpg',
];

const BASE_DIR = join(process.cwd(), 'public', 'images', 'explore');

async function main() {
  const results = {};
  
  for (const filename of IMAGES) {
    const filePath = join(BASE_DIR, filename);
    try {
      const fileBuffer = readFileSync(filePath);
      const blob = await put(`explore/${filename}`, fileBuffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });
      const localPath = `/images/explore/${filename}`;
      results[localPath] = blob.url;
      console.log(`Uploaded: ${localPath} -> ${blob.url}`);
    } catch (err) {
      console.error(`Failed to upload ${filename}:`, err.message);
    }
  }
  
  console.log('\n--- Add these to blob-image-urls.ts ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
