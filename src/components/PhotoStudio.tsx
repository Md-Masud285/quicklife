import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Download, 
  RotateCw, 
  RotateCcw, 
  Printer, 
  RefreshCw, 
  Crop, 
  PenTool, 
  Palette,
  Wand2,
  Sun,
  Eraser,
  CheckCircle2
} from 'lucide-react';

import { AdBanner } from './AdBanner';

interface PhotoPreset {
  id: string;
  name: string;
  category: 'job' | 'passport' | 'signature' | 'custom';
  width: number; // in pixels
  height: number; // in pixels
  maxKb?: number;
  description: string;
  aspectRatio: number;
}

const PHOTO_PRESETS: PhotoPreset[] = [
  {
    id: 'teletalk_job',
    name: '🇧🇩 সরকারি চাকরি (Teletalk)',
    category: 'job',
    width: 300,
    height: 300,
    maxKb: 100,
    description: '৩০০×৩০০ পিক্সেল (সর্বোচ্চ ১০০ KB)',
    aspectRatio: 1,
  },
  {
    id: 'signature_standard',
    name: '✍️ ডিজিটাল স্বাক্ষর (Signature)',
    category: 'signature',
    width: 300,
    height: 80,
    maxKb: 60,
    description: '৩০০×৮০ পিক্সেল (সর্বোচ্চ ৬০ KB)',
    aspectRatio: 300 / 80,
  },
  {
    id: 'passport_bd',
    name: '🛂 পাসপোর্ট সাইজ (Passport)',
    category: 'passport',
    width: 413, // 45x55 mm approx at 240 DPI
    height: 531,
    maxKb: 150,
    description: '৪৫×৫৫ মিমি (পাসপোর্ট ও ভিসা ফরম্যাট)',
    aspectRatio: 45 / 55,
  },
  {
    id: 'stamp_bd',
    name: '🔖 স্ট্যাম্প সাইজ (Stamp Photo)',
    category: 'passport',
    width: 200, // 20x25 mm
    height: 250,
    maxKb: 80,
    description: '২০×২৫ মিমি (অফিস ও স্কুল স্ট্যাম্প)',
    aspectRatio: 20 / 25,
  },
  {
    id: 'admission_bd',
    name: '🎓 বিশ্ববিদ্যালয় ভর্তি ও এনআইডি',
    category: 'job',
    width: 300,
    height: 300,
    maxKb: 100,
    description: '৩০০×৩০০ পিক্সেল (ভর্তি ও রেজিস্ট্রেশন)',
    aspectRatio: 1,
  },
  {
    id: 'custom',
    name: '📐 কাস্টম সাইজ (Custom)',
    category: 'custom',
    width: 300,
    height: 300,
    description: 'নিজের ইচ্ছামতো সাইজ ও রেজোলিউশন',
    aspectRatio: 1,
  },
];

// Helper to parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

import type { UserProfile } from '../services/authService';

interface PhotoStudioProps {
  currentUser?: UserProfile | null;
  onRequireLogin?: () => void;
}

export const PhotoStudio: React.FC<PhotoStudioProps> = ({ currentUser, onRequireLogin }) => {
  // State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PhotoPreset>(PHOTO_PRESETS[0]);
  
  // Custom dimensions
  const [customWidth, setCustomWidth] = useState<number>(300);
  const [customHeight, setCustomHeight] = useState<number>(300);

  // Transformations
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  // Background Replacement: Edge-Connected Flood Fill
  const [bgMode, setBgMode] = useState<'original' | 'white' | 'blue' | 'grey' | 'custom'>('original');
  const [customBgColor, setCustomBgColor] = useState<string>('#0ea5e9');
  const [bgSensitivity, setBgSensitivity] = useState<number>(28); // Safe edge tolerance
  const [protectCenterFace, setProtectCenterFace] = useState<boolean>(true); // Protects face/clothes from color bleed

  // Manual Eraser Brush
  const [activeTool, setActiveTool] = useState<'pan' | 'eraser'>('pan');
  const [eraserSize, setEraserSize] = useState<number>(24);
  const [manualErasedPoints, setManualErasedPoints] = useState<{ x: number; y: number; r: number }[]>([]);

  // Border Stroke (User requested feature!)
  const [hasBorder, setHasBorder] = useState<boolean>(false);
  const [borderWidth, setBorderWidth] = useState<number>(2);
  const [borderColor, setBorderColor] = useState<string>('#000000');

  // Signature Enhancer Mode
  const [isSignatureMode, setIsSignatureMode] = useState<boolean>(false);
  const [signatureThreshold, setSignatureThreshold] = useState<number>(135);

  // Export settings
  const [exportFormat, setExportFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [targetKb, setTargetKb] = useState<number>(selectedPreset.maxKb || 100);
  const [exportQuality] = useState<number>(0.92);
  const [estimatedSizeKb, setEstimatedSizeKb] = useState<number | null>(null);
  const [actualDimensions, setActualDimensions] = useState<{ w: number; h: number }>({ w: 300, h: 300 });

  // Canvas Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load Image when file is selected
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const src = uploadEvent.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setImageSrc(src);
        setZoom(1);
        setRotation(0);
        setPanX(0);
        setPanY(0);
        setBrightness(100);
        setContrast(100);
        setManualErasedPoints([]);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Preset Selection Handler
  const handlePresetSelect = (preset: PhotoPreset) => {
    setSelectedPreset(preset);
    const targetW = preset.id === 'custom' ? customWidth : preset.width;
    const targetH = preset.id === 'custom' ? customHeight : preset.height;
    setActualDimensions({ w: targetW, h: targetH });

    if (preset.id === 'signature_standard') {
      setIsSignatureMode(true);
      setHasBorder(false);
      setTargetKb(60);
      setBgMode('original');
    } else {
      setIsSignatureMode(false);
      setTargetKb(preset.maxKb || 100);
    }
  };

  // Main Render Function to Canvas
  const renderCanvas = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !originalImage) return;

    const targetWidth = selectedPreset.id === 'custom' ? customWidth : selectedPreset.width;
    const targetHeight = selectedPreset.id === 'custom' ? customHeight : selectedPreset.height;

    setActualDimensions({ w: targetWidth, h: targetHeight });

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // 1. Draw Transformed Image on canvas first
    ctx.save();
    ctx.translate(targetWidth / 2 + panX, targetHeight / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Apply Filter (Brightness / Contrast)
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Calculate source aspect ratio fitting
    const imgRatio = originalImage.width / originalImage.height;
    const targetRatio = targetWidth / targetHeight;

    let drawW: number;
    let drawH: number;

    if (imgRatio > targetRatio) {
      drawH = targetHeight;
      drawW = drawH * imgRatio;
    } else {
      drawW = targetWidth;
      drawH = drawW / imgRatio;
    }

    ctx.drawImage(originalImage, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 2. Real Pixel-Level Processing: Edge-Connected Flood Fill or Signature Cleaner
    const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imgData.data;

    if (isSignatureMode) {
      // Signature Mode: Threshold paper to pure white & ink to crisp dark black
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (gray < signatureThreshold) {
          data[i] = 15;     // Deep Black ink
          data[i + 1] = 23;
          data[i + 2] = 42;
          data[i + 3] = 255;
        } else {
          data[i] = 255;   // Pure White paper
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

    } else if (bgMode !== 'original') {
      // EDGE-CONNECTED FLOOD FILL ALGORITHM:
      // Only spreads from the outer perimeter into the background.
      // Will NOT penetrate the person's face/shirt/hair!

      // Target replacement color
      let targetColor = { r: 255, g: 255, b: 255 }; // Default white
      if (bgMode === 'blue') {
        targetColor = { r: 186, g: 230, b: 253 }; // Official Sky Blue #bae6fd
      } else if (bgMode === 'grey') {
        targetColor = { r: 241, g: 245, b: 249 }; // Official Light Grey #f1f5f9
      } else if (bgMode === 'custom') {
        targetColor = hexToRgb(customBgColor);
      }

      // Sample background from 4 corners and top middle
      const c1 = { r: data[0], g: data[1], b: data[2] };
      const c2Idx = (targetWidth - 1) * 4;
      const c2 = { r: data[c2Idx], g: data[c2Idx + 1], b: data[c2Idx + 2] };
      const c3Idx = ((targetHeight - 1) * targetWidth) * 4;
      const c3 = { r: data[c3Idx], g: data[c3Idx + 1], b: data[c3Idx + 2] };
      const c4Idx = (targetHeight * targetWidth - 1) * 4;
      const c4 = { r: data[c4Idx], g: data[c4Idx + 1], b: data[c4Idx + 2] };
      const topMidIdx = Math.floor(targetWidth / 2) * 4;
      const cTopMid = { r: data[topMidIdx], g: data[topMidIdx + 1], b: data[topMidIdx + 2] };

      const bgSamples = [c1, c2, c3, c4, cTopMid];

      const maxTolerance = (bgSensitivity / 100) * 240; // Controlled sensitivity

      const isBgPixel = (r: number, g: number, b: number): boolean => {
        for (const s of bgSamples) {
          const dist = Math.sqrt(
            Math.pow(r - s.r, 2) +
            Math.pow(g - s.g, 2) +
            Math.pow(b - s.b, 2)
          );
          if (dist <= maxTolerance) return true;
        }
        return false;
      };

      // BFS Flood Fill from perimeter
      const totalPixels = targetWidth * targetHeight;
      const isBackgroundMask = new Uint8Array(totalPixels);
      const visited = new Uint8Array(totalPixels);
      const queue: number[] = [];

      // Seed all perimeter pixels (top row, bottom row, left col, right col)
      for (let x = 0; x < targetWidth; x++) {
        queue.push(x, 0);
        queue.push(x, targetHeight - 1);
      }
      for (let y = 1; y < targetHeight - 1; y++) {
        queue.push(0, y);
        queue.push(targetWidth - 1, y);
      }

      // Center Face Guard box coordinates (keeps central face 100% safe)
      const faceBoxMinX = targetWidth * 0.25;
      const faceBoxMaxX = targetWidth * 0.75;
      const faceBoxMinY = targetHeight * 0.20;
      const faceBoxMaxY = targetHeight * 0.70;

      let head = 0;
      while (head < queue.length) {
        const px = queue[head++];
        const py = queue[head++];
        const idx = py * targetWidth + px;

        if (visited[idx]) continue;
        visited[idx] = 1;

        // If Face Guard is ON and we are inside core face zone, do not cross unless strongly matching corner
        if (protectCenterFace && px > faceBoxMinX && px < faceBoxMaxX && py > faceBoxMinY && py < faceBoxMaxY) {
          // Inside core face box, only continue if extremely close to outer corner color
          const byteIdx = idx * 4;
          const r = data[byteIdx];
          const g = data[byteIdx + 1];
          const b = data[byteIdx + 2];
          const dist = Math.sqrt(Math.pow(r - c1.r, 2) + Math.pow(g - c1.g, 2) + Math.pow(b - c1.b, 2));
          if (dist > maxTolerance * 0.6) {
            continue; // Stop flood fill at face
          }
        }

        const byteIdx = idx * 4;
        const r = data[byteIdx];
        const g = data[byteIdx + 1];
        const b = data[byteIdx + 2];

        if (isBgPixel(r, g, b)) {
          isBackgroundMask[idx] = 1;

          // Push 4 neighbors
          if (px > 0 && !visited[idx - 1]) queue.push(px - 1, py);
          if (px < targetWidth - 1 && !visited[idx + 1]) queue.push(px + 1, py);
          if (py > 0 && !visited[idx - targetWidth]) queue.push(px, py - 1);
          if (py < targetHeight - 1 && !visited[idx + targetWidth]) queue.push(px, py + 1);
        }
      }

      // Apply Background Color only to masked background pixels
      for (let i = 0; i < totalPixels; i++) {
        if (isBackgroundMask[i]) {
          const byteIdx = i * 4;
          data[byteIdx] = targetColor.r;
          data[byteIdx + 1] = targetColor.g;
          data[byteIdx + 2] = targetColor.b;
          data[byteIdx + 3] = 255;
        }
      }

      // Apply Manual Eraser Points (if user brushed any spot)
      for (const pt of manualErasedPoints) {
        const startX = Math.max(0, Math.floor(pt.x - pt.r));
        const endX = Math.min(targetWidth, Math.ceil(pt.x + pt.r));
        const startY = Math.max(0, Math.floor(pt.y - pt.r));
        const endY = Math.min(targetHeight, Math.ceil(pt.y + pt.r));

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const d = Math.sqrt(Math.pow(x - pt.x, 2) + Math.pow(y - pt.y, 2));
            if (d <= pt.r) {
              const byteIdx = (y * targetWidth + x) * 4;
              data[byteIdx] = targetColor.r;
              data[byteIdx + 1] = targetColor.g;
              data[byteIdx + 2] = targetColor.b;
              data[byteIdx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
    }

    // 3. Draw Crisp Visible Border Stroke on TOP of the image
    if (hasBorder && borderWidth > 0) {
      ctx.save();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      const offset = borderWidth / 2;
      ctx.strokeRect(offset, offset, targetWidth - borderWidth, targetHeight - borderWidth);
      ctx.restore();
    }

    // 4. Calculate Live Download Size
    const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
    canvas.toBlob((blob) => {
      if (blob) {
        setEstimatedSizeKb(Math.round((blob.size / 1024) * 10) / 10);
      }
    }, mime, exportQuality);

  }, [
    originalImage,
    selectedPreset,
    customWidth,
    customHeight,
    zoom,
    rotation,
    panX,
    panY,
    brightness,
    contrast,
    bgMode,
    customBgColor,
    bgSensitivity,
    protectCenterFace,
    manualErasedPoints,
    hasBorder,
    borderWidth,
    borderColor,
    isSignatureMode,
    signatureThreshold,
    exportFormat,
    exportQuality
  ]);

  // Re-render whenever parameters change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Touch / Mouse Dragging & Eraser
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'eraser' && bgMode !== 'original') {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      setManualErasedPoints(prev => [...prev, { x: clickX, y: clickY, r: eraserSize }]);
      isDraggingRef.current = true;
    } else {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'eraser' && bgMode !== 'original') {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      setManualErasedPoints(prev => [...prev, { x: clickX, y: clickY, r: eraserSize }]);
    } else {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setPanX(prev => prev + dx);
      setPanY(prev => prev + dy);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'eraser' && bgMode !== 'original') {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      const touchY = (e.touches[0].clientY - rect.top) * scaleY;
      setManualErasedPoints(prev => [...prev, { x: touchX, y: touchY, r: eraserSize }]);
      isDraggingRef.current = true;
    } else {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'eraser' && bgMode !== 'original') {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      const touchY = (e.touches[0].clientY - rect.top) * scaleY;
      setManualErasedPoints(prev => [...prev, { x: touchX, y: touchY, r: eraserSize }]);
    } else {
      const dx = e.touches[0].clientX - lastMousePosRef.current.x;
      const dy = e.touches[0].clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPanX(prev => prev + dx);
      setPanY(prev => prev + dy);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Download Processed Image with EXACT Target Dimensions and Format
  const handleDownloadImage = () => {
    if (!currentUser && onRequireLogin) {
      onRequireLogin();
      return;
    }
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const targetWidth = selectedPreset.id === 'custom' ? customWidth : selectedPreset.width;
    const targetHeight = selectedPreset.id === 'custom' ? customHeight : selectedPreset.height;

    // Create Dedicated Output Canvas of EXACT Dimensions
    const outCanvas = document.createElement('canvas');
    outCanvas.width = targetWidth;
    outCanvas.height = targetHeight;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;

    // Copy exact image from preview canvas
    outCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
    const ext = exportFormat === 'png' ? 'png' : 'jpg';
    const fileName = `quicklife_${selectedPreset.id}_${targetWidth}x${targetHeight}_${Date.now()}.${ext}`;

    const attemptCompress = (quality: number) => {
      outCanvas.toBlob((blob) => {
        if (!blob) return;

        // If JPEG and larger than target KB, reduce quality
        if (exportFormat === 'jpeg' && targetKb && blob.size / 1024 > targetKb && quality > 0.3) {
          attemptCompress(quality - 0.08);
          return;
        }

        // Trigger Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, mime, quality);
    };

    attemptCompress(exportQuality);
  };

  // Generate & Download A4 Print Sheet (4x or 8x Passport Photos aligned on A4)
  const handleDownloadA4Sheet = (photoCount: 4 | 8) => {
    if (!currentUser && onRequireLogin) {
      onRequireLogin();
      return;
    }
    const singleCanvas = previewCanvasRef.current;
    if (!singleCanvas) return;

    const a4Canvas = document.createElement('canvas');
    // A4 dimensions at 300 DPI: 2480 x 3508
    a4Canvas.width = 2480;
    a4Canvas.height = 3508;
    const ctx = a4Canvas.getContext('2d');
    if (!ctx) return;

    // Fill white A4 background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2480, 3508);

    // Header Title on A4 Sheet
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('QuickLife Studio - Passport Size Print Sheet (Ready to Cut)', 150, 150);

    // Grid placement
    const cols = 4;
    const photoW = 450; // Passport width on sheet
    const photoH = 550; // Passport height on sheet
    const startX = 150;
    const startY = 240;
    const gapX = 80;
    const gapY = 80;

    for (let i = 0; i < photoCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (photoW + gapX);
      const y = startY + row * (photoH + gapY);

      // Draw photo
      ctx.drawImage(singleCanvas, x, y, photoW, photoH);

      // Draw faint cut marks
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, photoW + 4, photoH + 4);
    }

    a4Canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quicklife_a4_passport_sheet_${photoCount}photos.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="space-y-4 text-left pb-36 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              স্মার্ট ফটো ও সিগনেচার স্টুডিও
            </span>
            <h2 className="text-xl font-bold mt-1.5">পাসপোর্ট, সাইজ ও সিগনেচার মেকার</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              ৩০০×৩০০ চাকরি, ৩০০×৮০ স্বাক্ষর, ব্যাকগ্রাউন্ড ও বর্ডার কাস্টমাইজেশন
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            <Camera className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3">
        <label className="text-xs font-bold text-slate-200 block">
          ১. মাপ / প্রিসেট নির্বাচন করুন (Select Format):
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PHOTO_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-2.5 rounded-xl text-left border transition text-xs font-bold flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{preset.name}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{preset.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Width & Height inputs if custom preset selected */}
        {selectedPreset.id === 'custom' && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">প্রস্থ (Width in px):</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(50, parseInt(e.target.value) || 300))}
                className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">উচ্চতা (Height in px):</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(50, parseInt(e.target.value) || 300))}
                className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas & Editor Area */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">
            ২. ছবি এডিটর ও লাইভ প্রিভিউ:
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold bg-slate-900 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-800">
              📐 {actualDimensions.w} × {actualDimensions.h} px
            </span>
            {estimatedSizeKb !== null && (
              <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 px-2 py-0.5 rounded-lg border border-blue-800">
                ~{estimatedSizeKb} KB
              </span>
            )}
          </div>
        </div>

        {/* Upload Box / Canvas View */}
        {!imageSrc ? (
          <label className="border-2 border-solid border-slate-600 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">ছবি বা সিগনেচার আপলোড করুন</p>
              <p className="text-xs text-slate-400 mt-1">গ্যালারি থেকে ছবি সিলেক্ট করুন বা ক্যামেরা দিয়ে তুলুন</p>
            </div>
            <span className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold shadow-md">
              ফাইল সিলেক্ট করুন
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        ) : (
          <div className="space-y-4">
            {/* Interactive Canvas Viewport */}
            <div className="relative bg-slate-950 rounded-2xl border border-slate-700/80 flex items-center justify-center p-3 overflow-hidden min-h-[260px]">
              <canvas
                ref={previewCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`max-h-[340px] max-w-full rounded-lg shadow-2xl object-contain border border-slate-700 ${
                  activeTool === 'eraser' ? 'cursor-crosshair' : 'cursor-move'
                }`}
                style={{ touchAction: 'none' }}
              />

              <div className="absolute bottom-2 right-2 bg-black/80 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-sm pointer-events-none">
                {activeTool === 'eraser' ? '🖌️ ব্রাশ দিয়ে ক্লিক/টেনে ব্যাকগ্রাউন্ড মুছুন' : '👆 ড্র্যাগ করে ফ্রেমে পজিশন করুন'}
              </div>
            </div>

            {/* Tool Mode Selector: Pan vs Eraser */}
            {bgMode !== 'original' && (
              <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTool('pan')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    activeTool === 'pan' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>পজিশন মোড (Move/Drag)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('eraser')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    activeTool === 'eraser' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>ইরেজার ব্রাশ (Touch-up Brush)</span>
                </button>
              </div>
            )}

            {/* Quick Adjustment Controls: Zoom & Rotate & Brightness */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-700/70">
              {/* Zoom */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span>জুম (Zoom):</span>
                  <span className="text-blue-400 font-mono">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Rotation */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span>ঘোরান (Rotate):</span>
                  <span className="text-blue-400 font-mono">{rotation}°</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setRotation(r => (r - 90) % 360)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Rotate 90 Left"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setRotation(r => (r + 90) % 360)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Rotate 90 Right"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Brightness */}
              <div className="col-span-2 sm:col-span-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>উজ্জ্বলতা (Light):</span>
                  </span>
                  <span className="text-amber-400 font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Change Photo Button */}
            <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center justify-center space-x-1.5 py-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>অন্য ছবি আপলোড করুন</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        )}
      </div>

      {/* Customization Controls (Only visible when image is loaded) */}
      {imageSrc && (
        <div className="space-y-4">
          {/* CONTROL SECTION 1: Smart Edge-Connected Background Color Replacement */}
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                <span>ব্যাকগ্রাউন্ড কালার পরিবর্তন (Edge-Smart Background):</span>
              </label>
              {bgMode !== 'original' && (
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ✓ মুখ ও কাপড় সুরক্ষিত
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setBgMode('original')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  bgMode === 'original' ? 'bg-slate-700 text-white border-blue-400 shadow' : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                মূল ব্যাকগ্রাউন্ড
              </button>

              <button
                type="button"
                onClick={() => setBgMode('white')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  bgMode === 'white' ? 'bg-white text-slate-900 border-blue-500 shadow-md ring-2 ring-blue-500' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                ⚪ সাদা (White)
              </button>

              <button
                type="button"
                onClick={() => setBgMode('blue')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  bgMode === 'blue' ? 'bg-sky-300 text-slate-900 border-sky-400 shadow-md ring-2 ring-sky-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                🔵 নীল (Sky Blue)
              </button>

              <button
                type="button"
                onClick={() => setBgMode('grey')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  bgMode === 'grey' ? 'bg-slate-300 text-slate-900 border-slate-400 shadow-md ring-2 ring-slate-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                🔘 ধূসর (Grey)
              </button>

              <label className={`py-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer flex items-center justify-center space-x-1 ${
                bgMode === 'custom' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400' : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}>
                <span>🎨 কাস্টম</span>
                <input
                  type="color"
                  value={customBgColor}
                  onChange={(e) => {
                    setCustomBgColor(e.target.value);
                    setBgMode('custom');
                  }}
                  className="w-4 h-4 rounded border-none bg-transparent cursor-pointer"
                />
              </label>
            </div>

            {/* Sensitivity & Protection Controls */}
            {bgMode !== 'original' && (
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/60 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-blue-300 text-xs font-bold">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>ব্যাকগ্রাউন্ড কাটিং পাওয়ার:</span>
                  </div>
                  <span className="text-blue-400 font-mono text-xs font-bold">{bgSensitivity}%</span>
                </div>
                
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={bgSensitivity}
                  onChange={(e) => setBgSensitivity(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />

                {/* Face Protection Switch */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-[11px] text-slate-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>মুখ ও কাপড়ে কালার পড়া রোধ করুন (Face Guard):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setProtectCenterFace(!protectCenterFace)}
                    className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                      protectCenterFace ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {protectCenterFace ? 'সুরক্ষা চালু' : 'বন্ধ'}
                  </button>
                </div>

                {/* Eraser Size Slider (if eraser tool is active) */}
                {activeTool === 'eraser' && (
                  <div className="pt-1 border-t border-slate-800 space-y-1">
                    <div className="flex justify-between text-[11px] text-amber-300 font-semibold">
                      <span>ইরেজার ব্রাশ সাইজ:</span>
                      <span>{eraserSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={eraserSize}
                      onChange={(e) => setEraserSize(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CONTROL SECTION 2: Real Visible Border Stroke (User Specific Feature) */}
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Crop className="w-3.5 h-3.5 text-emerald-400" />
                <span>ছবির বর্ডার ও ফ্রেম (Photo Border & Stroke):</span>
              </label>
              <button
                type="button"
                onClick={() => setHasBorder(!hasBorder)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  hasBorder ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {hasBorder ? '✓ বর্ডার চালু' : 'বর্ডার বন্ধ'}
              </button>
            </div>

            {hasBorder && (
              <div className="space-y-3 pt-2 border-t border-slate-700/70 animate-fadeIn">
                {/* Border Width Selection */}
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    বর্ডার সাইজ / পুরুত্ব: ({borderWidth} পিক্সেল)
                  </label>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5, 8].map(px => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setBorderWidth(px)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                          borderWidth === px ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        {px}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Color Selection */}
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">বর্ডার কালার (Border Color):</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setBorderColor('#000000')}
                      className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                        borderColor === '#000000' ? 'bg-black text-white border-emerald-400 ring-2 ring-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-black border border-white inline-block"></span>
                      <span>কালো</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorderColor('#0f172a')}
                      className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                        borderColor === '#0f172a' ? 'bg-slate-900 text-white border-emerald-400 ring-2 ring-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-blue-400 inline-block"></span>
                      <span>নেভি ব্লু</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorderColor('#cbd5e1')}
                      className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                        borderColor === '#cbd5e1' ? 'bg-slate-200 text-slate-900 border-emerald-400 ring-2 ring-emerald-400' : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500 inline-block"></span>
                      <span>ধূসর</span>
                    </button>
                    <label className="py-2 rounded-xl text-xs font-bold border bg-slate-900 text-slate-300 border-slate-700 text-center cursor-pointer flex items-center justify-center space-x-1">
                      <span>🎨 কাস্টম</span>
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-4 h-4 rounded border-none bg-transparent cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTROL SECTION 3: Signature Enhancer Filter */}
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                <span>স্বাক্ষর ক্লিনার (Signature Enhancer):</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSignatureMode(!isSignatureMode)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  isSignatureMode ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {isSignatureMode ? '✓ সিগনেচার মোড চালু' : 'স্বাভাবিক মোড'}
              </button>
            </div>

            {isSignatureMode && (
              <div className="space-y-2 pt-2 border-t border-slate-700/70 animate-fadeIn">
                <p className="text-[11px] text-amber-300/90">
                  ⚡ কাগজের ব্যাকগ্রাউন্ড ধবধবে সাদা করবে এবং কলমের কালি গাঢ় কালো করবে।
                </p>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>কালির গাঢ়ত্ব (Ink Threshold):</span>
                    <span className="text-amber-400 font-mono">{signatureThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="220"
                    value={signatureThreshold}
                    onChange={(e) => setSignatureThreshold(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* CONTROL SECTION 4: File Size (KB Controller) & Quality */}
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3">
            <label className="text-xs font-bold text-slate-200 block">
              ৩. ফাইল সাইজ ও ফরম্যাট (File Size & Format):
            </label>

            {/* Preset Max KB */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">সর্বোচ্চ ফাইল সাইজ লিমিট (Target KB):</label>
              <div className="flex space-x-1.5">
                {[50, 60, 100, 150, 200].map(kb => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetKb(kb)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                      targetKb === kb ? 'bg-blue-600 text-white border-blue-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    &lt;{kb} KB
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setExportFormat('jpeg')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  exportFormat === 'jpeg' ? 'bg-slate-200 text-slate-900 border-white shadow' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                JPG ফরম্যাট (সরকারি ফরম ও Teletalk)
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('png')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  exportFormat === 'png' ? 'bg-slate-200 text-slate-900 border-white shadow' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                PNG ফরম্যাট (হাই রেজোলিউশন)
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS: Download Single & A4 Print Sheet */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownloadImage}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-blue-900/30 flex items-center justify-center space-x-2 active:scale-95 transition"
            >
              <Download className="w-4 h-4" />
              <span>ছবি ডাউনলোড করুন ({actualDimensions.w}×{actualDimensions.h} px)</span>
            </button>

            {/* A4 Sheet Generator for Passport Photos */}
            {selectedPreset.category === 'passport' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDownloadA4Sheet(4)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>A4 শিট (৪টি পাসপোর্ট ছবি)</span>
                </button>
                <button
                  onClick={() => handleDownloadA4Sheet(8)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>A4 শিট (৮টি পাসপোর্ট ছবি)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AdBanner title="প্রফেশনাল সাইজ ও রেজোলিউশন" subtitle="সরকারি চাকরি ও বিশ্ববিদ্যালয়ের সব ফরম পূরণ করুন নিমিষেই" />
    </div>
  );
};
