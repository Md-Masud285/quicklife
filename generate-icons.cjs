const fs = require('fs');
const path = require('path');

const resDir = path.join(__dirname, 'android/app/src/main/res');

// SVG string for the Red Heart App Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="40%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)">
    <path fill="url(#heartGrad)" d="M256,448l-30.8-28C116,321.2,44,255.9,44,175.4C44,110.1,95.1,59,160.4,59c36.9,0,72.3,17.2,95.6,44.1 C279.3,76.2,314.7,59,351.6,59C416.9,59,468,110.1,468,175.4c0,80.5-72,145.8-181.2,244.6L256,448z"/>
    <path fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" d="M100,240 h65 l25,-45 l35,90 l40,-130 l35,115 l25,-30 h85" />
  </g>
</svg>`;

// Vector Drawable for Android Adaptive Icon Foreground
const icLauncherForegroundXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="512"
    android:viewportHeight="512">
    <path
        android:fillColor="#E11D48"
        android:pathData="M256,448l-30.8,-28C116,321.2 44,255.9 44,175.4C44,110.1 95.1,59 160.4,59c36.9,0 72.3,17.2 95.6,44.1 C279.3,76.2 314.7,59 351.6,59C416.9,59 468,110.1 468,175.4c0,80.5 -72,145.8 -181.2,244.6L256,448z"/>
    <path
        android:strokeColor="#FFFFFF"
        android:strokeWidth="20"
        android:strokeLineCap="round"
        android:strokeLineJoin="round"
        android:pathData="M100,240 h65 l25,-45 l35,90 l40,-130 l35,115 l25,-30 h85" />
</vector>`;

const icLauncherBackgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0F172A"
        android:pathData="M0,0h108v108h-108z"/>
</vector>`;

async function applyIcons() {
  console.log('Generating Android App Icons in:', resDir);
  if (!fs.existsSync(resDir)) {
    console.error('Android res dir not found!');
    return;
  }

  // 1. Update Android vector drawables (Android 8.0 - 15.0 Adaptive Icons)
  const drawableV24 = path.join(resDir, 'drawable-v24');
  const drawable = path.join(resDir, 'drawable');
  [drawable, drawableV24].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'ic_launcher_foreground.xml'), icLauncherForegroundXml, 'utf8');
    fs.writeFileSync(path.join(d, 'ic_launcher_background.xml'), icLauncherBackgroundXml, 'utf8');
  });

  // 2. Render PNGs into all mipmap density folders
  const sharp = require('sharp');
  const buffer = Buffer.from(svgContent);

  const densities = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const { dir, size } of densities) {
    const targetDir = path.join(resDir, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Generate ic_launcher.png & ic_launcher_round.png
    await sharp(buffer).resize(size, size).png().toFile(path.join(targetDir, 'ic_launcher.png'));
    await sharp(buffer).resize(size, size).png().toFile(path.join(targetDir, 'ic_launcher_round.png'));
    await sharp(buffer).resize(Math.round(size * 1.5), Math.round(size * 1.5)).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
    console.log(`Generated ${size}x${size} icon for ${dir}`);
  }

  console.log('ALL ANDROID LAUNCHER ICONS SUCCESSFULLY GENERATED!');
}

applyIcons().catch(console.error);
