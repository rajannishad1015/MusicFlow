import pica from 'pica';

let picaInstance: any = null;

export interface ImageResizeOptions {
  width: number;
  height: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  cropToSquare?: boolean;
}

export async function processImage(file: File, options: ImageResizeOptions): Promise<Blob> {
  if (typeof window === 'undefined') {
      throw new Error('Image processing can only run in the browser');
  }

  if (!picaInstance) {
      picaInstance = pica();
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      // 1. Calculate Source Dimensions (Crop?)
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (options.cropToSquare) {
        const size = Math.min(img.width, img.height);
        sourceX = (img.width - size) / 2;
        sourceY = (img.height - size) / 2;
        sourceWidth = size;
        sourceHeight = size;
      }

      // 2. Determine Target Dimensions
      // If width/height are 0 or not provided, keep original (or cropped) size
      const targetWidth = (options.width && options.width > 0) ? options.width : sourceWidth;
      const targetHeight = (options.height && options.height > 0) ? options.height : sourceHeight;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 3. Prepare Source Canvas
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = sourceWidth;
      offscreenCanvas.height = sourceHeight;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get 2D context'));
      
      // Draw the source (potentially cropped) onto the intermediate canvas
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

      // 4. Resize Logic
      // Try Pica for high quality, fallback to canvas for reliability
      try {
        const picaPromise = picaInstance.resize(offscreenCanvas, canvas);
        
        // Timeout for Pica (3 seconds)
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Pica timeout')), 3000)
        );

        await Promise.race([picaPromise, timeoutPromise]);
        
        // Quality mapping: 0-100 -> 0-1
        const quality = options.quality ? Math.max(0, Math.min(1, options.quality / 100)) : 0.9;
        const blob = await picaInstance.toBlob(canvas, options.format || 'image/jpeg', quality);
        resolve(blob);

      } catch (err) {
        console.warn('Pica failed or timed out, falling back to standard canvas:', err);
        
        // Fallback: Standard Canvas Resize
        const ctxTarget = canvas.getContext('2d');
        if (!ctxTarget) {
            reject(new Error('Failed to get target canvas context'));
            return;
        }

        // High quality standard scaling
        ctxTarget.imageSmoothingEnabled = true;
        ctxTarget.imageSmoothingQuality = 'high';
        ctxTarget.drawImage(offscreenCanvas, 0, 0, targetWidth, targetHeight);
        
        const quality = options.quality ? Math.max(0, Math.min(1, options.quality / 100)) : 0.9;
        
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
        }, options.format || 'image/jpeg', quality);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
