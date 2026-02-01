import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const iconSvg = fs.readFileSync(path.join(__dirname, 'brand-icon.svg'))
const foregroundSvg = fs.readFileSync(path.join(__dirname, 'brand-icon-foreground.svg'))
const traySvg = fs.readFileSync(path.join(__dirname, 'brand-tray.svg'))
const splashSvg = fs.readFileSync(path.join(__dirname, 'brand-splash.svg'))

// Ensure directory exists
function ensureDir(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function gen(svgBuffer, outPath, size) {
  const fullPath = path.join(ROOT, outPath)
  ensureDir(fullPath)
  await sharp(svgBuffer).resize(size, size).png().toFile(fullPath)
  console.log(`  ${outPath} (${size}x${size})`)
}

async function genSplash(svgBuffer, outPath, w, h) {
  const fullPath = path.join(ROOT, outPath)
  ensureDir(fullPath)
  await sharp(svgBuffer).resize(w, h, { fit: 'cover' }).png().toFile(fullPath)
  console.log(`  ${outPath} (${w}x${h})`)
}

// Generate ICO from multiple PNG sizes
async function genIco(svgBuffer, outPath) {
  const sizes = [16, 32, 48, 64, 128, 256]
  const buffers = await Promise.all(
    sizes.map((s) => sharp(svgBuffer).resize(s, s).png().toBuffer())
  )

  // ICO file format
  const headerSize = 6
  const dirEntrySize = 16
  const numImages = sizes.length

  // Calculate offsets
  let offset = headerSize + dirEntrySize * numImages
  const imageData = []

  for (let i = 0; i < numImages; i++) {
    const png = buffers[i]
    imageData.push({ size: sizes[i], data: png, offset })
    offset += png.length
  }

  // ICO header
  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // ICO type
  header.writeUInt16LE(numImages, 4)

  // Directory entries
  const dirEntries = Buffer.alloc(dirEntrySize * numImages)
  for (let i = 0; i < numImages; i++) {
    const e = imageData[i]
    const o = i * dirEntrySize
    dirEntries.writeUInt8(e.size >= 256 ? 0 : e.size, o) // width
    dirEntries.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1) // height
    dirEntries.writeUInt8(0, o + 2) // color palette
    dirEntries.writeUInt8(0, o + 3) // reserved
    dirEntries.writeUInt16LE(1, o + 4) // color planes
    dirEntries.writeUInt16LE(32, o + 6) // bits per pixel
    dirEntries.writeUInt32LE(e.data.length, o + 8) // image size
    dirEntries.writeUInt32LE(e.offset, o + 12) // image offset
  }

  const fullPath = path.join(ROOT, outPath)
  ensureDir(fullPath)
  const ico = Buffer.concat([header, dirEntries, ...buffers])
  fs.writeFileSync(fullPath, ico)
  console.log(`  ${outPath} (ICO: ${sizes.join(',')})`)
}

async function main() {
  console.log('Generating VidDownloadPro brand icons...\n')

  // --- Core / Electron ---
  console.log('[Core]')
  await gen(iconSvg, 'build/icon.png', 1024)
  await genIco(iconSvg, 'build/icon.ico')
  await gen(iconSvg, 'resources/icon.png', 512)
  await gen(traySvg, 'resources/tray-icon.png', 128)

  // --- Renderer (web) ---
  console.log('\n[Renderer]')
  await gen(iconSvg, 'src/renderer/public/app-icon.png', 512)
  await gen(iconSvg, 'src/renderer/src/assets/app-icon.png', 512)

  // --- Android launcher icons ---
  console.log('\n[Android - Launcher]')
  const androidMipmap = 'android/app/src/main/res'
  const androidSizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 }
  for (const [density, size] of Object.entries(androidSizes)) {
    await gen(iconSvg, `${androidMipmap}/mipmap-${density}/ic_launcher.png`, size)
    await gen(iconSvg, `${androidMipmap}/mipmap-${density}/ic_launcher_round.png`, size)
    await gen(foregroundSvg, `${androidMipmap}/mipmap-${density}/ic_launcher_foreground.png`, size)
  }

  // --- Android splash screens ---
  console.log('\n[Android - Splash]')
  const splashSizes = {
    'drawable': [480, 800],
    'drawable-land-hdpi': [800, 480],
    'drawable-land-mdpi': [480, 320],
    'drawable-land-xhdpi': [1280, 720],
    'drawable-land-xxhdpi': [1600, 960],
    'drawable-land-xxxhdpi': [1920, 1280],
    'drawable-port-hdpi': [480, 800],
    'drawable-port-mdpi': [320, 480],
    'drawable-port-xhdpi': [720, 1280],
    'drawable-port-xxhdpi': [960, 1600],
    'drawable-port-xxxhdpi': [1280, 1920]
  }
  for (const [dir, [w, h]] of Object.entries(splashSizes)) {
    await genSplash(splashSvg, `${androidMipmap}/${dir}/splash.png`, w, h)
  }

  // --- Android public app icon ---
  console.log('\n[Android - Public]')
  await gen(iconSvg, 'android/app/src/main/assets/public/app-icon.png', 512)

  // --- iOS ---
  console.log('\n[iOS - AppIcon]')
  await gen(iconSvg, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png', 1024)

  // iOS splash
  console.log('\n[iOS - Splash]')
  await genSplash(splashSvg, 'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png', 2732, 2732)
  await genSplash(splashSvg, 'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-1.png', 2732, 2732)
  await genSplash(splashSvg, 'ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-2.png', 2732, 2732)

  // iOS public app icon
  await gen(iconSvg, 'ios/App/App/public/app-icon.png', 512)

  // --- Docs ---
  console.log('\n[Docs]')
  const docSizes = [16, 32, 48, 64, 128, 192, 256, 512]
  for (const size of docSizes) {
    await gen(iconSvg, `docs/public/icon-${size}.png`, size)
  }
  await gen(iconSvg, 'docs/public/icon.png', 512)
  await gen(iconSvg, 'docs/public/icon-original.png', 1024)
  await gen(iconSvg, 'docs/public/favicon.png', 32)
  await gen(iconSvg, 'docs/public/apple-touch-icon.png', 180)

  // --- Extension ---
  console.log('\n[Extension]')
  const extSizes = [16, 32, 48, 128]
  for (const size of extSizes) {
    await gen(iconSvg, `extension/public/icon/${size}.png`, size)
  }
  // Loading variants (same icon with slight blue tint)
  for (const size of [16, 32, 48]) {
    await gen(iconSvg, `extension/public/icon/icon-loading-${size}.png`, size)
  }
  // Success variants
  for (const size of [16, 32, 48]) {
    await gen(iconSvg, `extension/public/icon/icon-success-${size}.png`, size)
  }

  console.log('\nAll icons generated successfully!')
}

main().catch((err) => {
  console.error('Icon generation failed:', err)
  process.exit(1)
})
