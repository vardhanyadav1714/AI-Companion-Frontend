const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const directory = path.join(root, 'public', 'branding');
  await fs.mkdir(directory, { recursive: true });
  const master = path.join(directory, 'eva-app-icon.png');
  if (process.argv[2]) await fs.copyFile(path.resolve(process.argv[2]), master);
  for (const size of [192, 512]) {
    await sharp(master).resize(size, size).png().toFile(path.join(directory, `eva-icon-${size}.png`));
  }
  await sharp(master).resize(180, 180).png().toFile(path.join(root, 'src/app/apple-icon.png'));
  // ICO directory entries point to PNG-encoded images for each browser size.
  const sizes = [16, 32, 48, 256];
  const images = [];
  for (const size of sizes) images.push(await sharp(master).resize(size, size).ensureAlpha().png().toBuffer());
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    header[entry] = size === 256 ? 0 : size;
    header[entry + 1] = size === 256 ? 0 : size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[index].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  });
  await fs.writeFile(path.join(root, 'src/app/favicon.ico'), Buffer.concat([header, ...images]));
  console.log('Created Eva ICO, Apple touch icon, and 192/512px app exports.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
