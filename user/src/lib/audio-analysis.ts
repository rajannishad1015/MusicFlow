export interface AudioAnalysisResult {
    duration: number;
    sampleRate: number;
    numberOfChannels: number;
    peakLevel: number; // dB
    clippingDetected: boolean;
    silenceDetected: boolean; // True if silence > 5 seconds
    averageVolume: number; // RMS in dB
}

export class AudioAnalyzer {
    private audioContext: AudioContext;

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    async analyzeFile(file: File): Promise<AudioAnalysisResult> {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        return this.analyzeBuffer(audioBuffer);
    }

    analyzeBuffer(buffer: AudioBuffer): AudioAnalysisResult {
        const rawData = buffer.getChannelData(0); // Analyze first channel for now (or average)
        const sampleRate = buffer.sampleRate;
        const duration = buffer.duration;
        const numberOfChannels = buffer.numberOfChannels;

        let maxPeak = 0;
        let rmsSum = 0;
        let silenceStart = -1;
        let maxSilenceDuration = 0;
        
        const silenceThreshold = 0.001; // Approx -60dB
        const clippingThreshold = 0.99; // Near 0dB

        for (let i = 0; i < rawData.length; i++) {
            const sample = Math.abs(rawData[i]);

            // Peak Check
            if (sample > maxPeak) {
                maxPeak = sample;
            }

            // RMS
            rmsSum += sample * sample;

            // Silence Check
            if (sample < silenceThreshold) {
                if (silenceStart === -1) silenceStart = i;
            } else {
                if (silenceStart !== -1) {
                    const silenceDuration = (i - silenceStart) / sampleRate;
                    if (silenceDuration > maxSilenceDuration) maxSilenceDuration = silenceDuration;
                    silenceStart = -1;
                }
            }
        }

        // Final silence check (if ends with silence)
        if (silenceStart !== -1) {
            const silenceDuration = (rawData.length - silenceStart) / sampleRate;
            if (silenceDuration > maxSilenceDuration) maxSilenceDuration = silenceDuration;
        }

        const rms = Math.sqrt(rmsSum / rawData.length);
        const volumeDb = 20 * Math.log10(rms);
        const peakDb = 20 * Math.log10(maxPeak);

        return {
            duration,
            sampleRate,
            numberOfChannels,
            peakLevel: parseFloat(peakDb.toFixed(2)),
            clippingDetected: maxPeak >= clippingThreshold,
            silenceDetected: maxSilenceDuration > 5, // Flag if silence > 5s exists
            averageVolume: parseFloat(volumeDb.toFixed(2))
        };
    }
}
