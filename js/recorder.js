class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioBlob = null;
        this.audioUrl = null;
        this.stream = null;
    }

    async setupStream() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw new Error('Tidak dapat mengakses perangkat audio');
        }
    }

    async startRecording() {
        if (!this.stream) {
            await this.setupStream();
        }

        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream);

        return new Promise((resolve, reject) => {
            try {
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.audioChunks.push(event.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.audioUrl = URL.createObjectURL(this.audioBlob);
                    resolve(this.audioUrl);
                };

                this.mediaRecorder.onerror = (event) => {
                    reject(event.error);
                };

                this.mediaRecorder.start();
            } catch (error) {
                reject(error);
            }
        });
    }

    stopRecording() {
        return new Promise((resolve, reject) => {
            try {
                if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                    this.mediaRecorder.stop();
                    this.stream.getTracks().forEach(track => track.stop());
                    resolve(this.audioUrl);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async getAudioBlob() {
        return this.audioBlob;
    }

    async convertToMp3(audioBlob) {
        try {
            // Convert audio blob to MP3 format
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Create offline context for rendering
            const offlineContext = new OfflineAudioContext(
                audioBuffer.numberOfChannels,
                audioBuffer.length,
                audioBuffer.sampleRate
            );

            // Create buffer source
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start();

            // Render audio
            const renderedBuffer = await offlineContext.startRendering();

            // Convert to WAV format first
            const wavBlob = this.bufferToWav(renderedBuffer);

            // Here you would typically convert WAV to MP3
            // For now, we'll return the WAV blob since client-side MP3 encoding is complex
            // and would require additional libraries
            return wavBlob;
        } catch (error) {
            console.error('Error converting audio:', error);
            throw new Error('Gagal mengkonversi audio ke format MP3');
        }
    }

    bufferToWav(buffer) {
        const interleaved = this.interleaveChannels(buffer);
        const dataView = this.createWavDataView(interleaved, buffer.sampleRate);
        return new Blob([dataView], { type: 'audio/wav' });
    }

    interleaveChannels(buffer) {
        const channels = [];
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        const length = channels[0].length;
        const interleaved = new Float32Array(length * channels.length);

        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < channels.length; channel++) {
                interleaved[i * channels.length + channel] = channels[channel][i];
            }
        }

        return interleaved;
    }

    createWavDataView(interleaved, sampleRate) {
        const buffer = new ArrayBuffer(44 + interleaved.length * 2);
        const view = new DataView(buffer);

        // Write WAV header
        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(view, 0, 'RIFF');                    // RIFF identifier
        view.setUint32(4, 36 + interleaved.length * 2, true); // File length
        writeString(view, 8, 'WAVE');                    // WAVE identifier
        writeString(view, 12, 'fmt ');                   // Format chunk identifier
        view.setUint32(16, 16, true);                   // Format chunk length
        view.setUint16(20, 1, true);                    // Sample format (raw)
        view.setUint16(22, 1, true);                    // Channel count
        view.setUint32(24, sampleRate, true);           // Sample rate
        view.setUint32(28, sampleRate * 2, true);       // Byte rate
        view.setUint16(32, 2, true);                    // Block align
        view.setUint16(34, 16, true);                   // Bits per sample
        writeString(view, 36, 'data');                  // Data chunk identifier
        view.setUint32(40, interleaved.length * 2, true); // Data chunk length

        // Write audio data
        const volume = 1;
        let offset = 44;
        for (let i = 0; i < interleaved.length; i++) {
            view.setInt16(offset, interleaved[i] * (0x7FFF * volume), true);
            offset += 2;
        }

        return view;
    }

    cleanup() {
        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioBlob = null;
        this.audioUrl = null;
        this.stream = null;
    }
}

// Export the class
window.AudioRecorder = AudioRecorder;
