import { useState, useCallback, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { toast } from 'sonner';

export interface FFmpegOptions {
  onProgress?: (progress: number) => void;
  onLog?: (message: string) => void;
}

export interface AudioProcessingSettings {
  format: string;
  bitrate?: string;
  sampleRate?: string;
  normalize?: boolean;
  trimStart?: string; // HH:MM:SS or seconds
  trimEnd?: string;   // HH:MM:SS or seconds
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
  };
  coverArt?: Blob;
}

export const useFFmpeg = (onLog?: (msg: string) => void) => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const load = useCallback(async () => {
    if (loaded || loading) return;
    setLoading(true);
    try {
      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
      }
      const ffmpeg = ffmpegRef.current;
      
      ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg:', message);
        onLog?.(message);
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setLoaded(true);
    } catch (err) {
      console.error('FFmpeg Load Error:', err);
      toast.error('Failed to load Audio Engine');
    } finally {
      setLoading(false);
    }
  }, [loaded, loading, onLog]);

  const convert = useCallback(async (
    inputFile: File, 
    settings: AudioProcessingSettings,
    onProgress?: (p: number) => void
  ): Promise<Blob> => {
    if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
    }
    const ffmpeg = ffmpegRef.current;
    if (!loaded) await load();

    const inputName = `input_${Date.now()}${inputFile.name.substring(inputFile.name.lastIndexOf('.'))}`;
    const outputName = `output_${Date.now()}.${settings.format}`;
    const coverName = 'cover.jpg';

    const progressHandler = ({ progress }: { progress: number }) => {
      onProgress?.(progress);
    };

    ffmpeg.on('progress', progressHandler);

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
      
      const args = ['-i', inputName];

      if (settings.coverArt) {
        await ffmpeg.writeFile(coverName, await fetchFile(settings.coverArt));
        args.push('-i', coverName);
      }

      // Filters
      const filters: string[] = [];
      if (settings.normalize) {
        filters.push('loudnorm');
      }

      if (filters.length > 0) {
        args.push('-af', filters.join(','));
      }

      // Accurate seek (after -i)
      if (settings.trimStart) args.push('-ss', settings.trimStart);
      if (settings.trimEnd) args.push('-to', settings.trimEnd);

      // Audio Codec
      if (settings.format === 'mp3') {
        args.push('-c:a', 'libmp3lame');
      } else if (settings.format === 'ogg') {
        args.push('-c:a', 'libvorbis');
      } else if (settings.format === 'wav') {
        args.push('-c:a', 'pcm_s16le');
      } else if (settings.format === 'm4a') {
        args.push('-c:a', 'aac');
      }
      
      if (settings.bitrate && settings.format !== 'wav') {
        args.push('-b:a', settings.bitrate);
      }

      // Metadata
      if (settings.metadata) {
        if (settings.metadata.title) args.push('-metadata', `title=${settings.metadata.title}`);
        if (settings.metadata.artist) args.push('-metadata', `artist=${settings.metadata.artist}`);
        if (settings.metadata.album) args.push('-metadata', `album=${settings.metadata.album}`);
      }

      // Map audio and cover art safely
      if (settings.coverArt && settings.format !== 'wav') {
        args.push(
          '-map', '0:a?', 
          '-map', '1:0', 
          '-disposition:v:0', 'attached_pic',
          '-id3v2_version', '3', 
          '-metadata:s:v', 'title="Album cover"', 
          '-metadata:s:v', 'comment="Cover (front)"'
        );
        if (settings.format === 'mp3') {
           args.push('-c:v', 'mjpeg');
        } else {
           args.push('-c:v', 'copy');
        }
      } else {
        args.push('-map', '0:a?');
      }

      args.push(outputName);

      const exitCode = await ffmpeg.exec(args);
      if (exitCode !== 0) {
        throw new Error(`Engine crashed or failed (Code ${exitCode}). Check logs.`);
      }

      const data = await ffmpeg.readFile(outputName);
      const mimeType = {
        mp3: 'audio/mpeg',
        ogg: 'audio/ogg',
        wav: 'audio/wav',
        m4a: 'audio/mp4'
      }[settings.format] || 'audio/mpeg';

      return new Blob([data as any], { type: mimeType });
    } finally {
      ffmpeg.off('progress', progressHandler);
      try { await ffmpeg.deleteFile(inputName); } catch (e) {}
      try { await ffmpeg.deleteFile(outputName); } catch (e) {}
      if (settings.coverArt) try { await ffmpeg.deleteFile(coverName); } catch (e) {}
    }
  }, [loaded, load]);

  const cancel = useCallback(() => {
    try {
        if (ffmpegRef.current) {
            ffmpegRef.current.terminate();
        }
        setLoaded(false);
        setLoading(false);
        // Force re-initialization next time load is called
        ffmpegRef.current = null;
    } catch (err) {
        console.error('Error terminating FFmpeg:', err);
    }
  }, []);

  return { load, convert, cancel, loaded, loading };
};


