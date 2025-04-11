document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const textInput = document.getElementById('text-input');
    const convertBtn = document.getElementById('convert-btn');
    const stopBtn = document.getElementById('stop-btn');
    const status = document.getElementById('status');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    const speedControl = document.getElementById('speed');
    const volumeControl = document.getElementById('volume');
    const speedValue = document.getElementById('speed-value');
    const volumeValue = document.getElementById('volume-value');

    // Setup controls
    speedControl.addEventListener('input', (e) => {
        speedValue.textContent = parseFloat(e.target.value).toFixed(1);
    });

    volumeControl.addEventListener('input', (e) => {
        volumeValue.textContent = Math.round(e.target.value * 100);
    });

    // Check browser support
    if (!('speechSynthesis' in window)) {
        showError('Browser Anda tidak mendukung Text-to-Speech');
        convertBtn.disabled = true;
        return;
    }

    let speaking = false;

    // Setup convert button
    convertBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (!text) {
            showError('Silakan masukkan teks terlebih dahulu');
            return;
        }

        try {
            if (speaking) {
                window.speechSynthesis.cancel();
                speaking = false;
                resetUI();
                return;
            }

            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Basic configuration
            utterance.lang = 'id-ID';
            utterance.rate = parseFloat(speedControl.value);
            utterance.volume = parseFloat(volumeControl.value);

            // Setup handlers
            utterance.onstart = () => {
                speaking = true;
                status.classList.remove('hidden');
                convertBtn.disabled = true;
                stopBtn.classList.remove('hidden');
            };

            utterance.onend = () => {
                speaking = false;
                resetUI();
            };

            utterance.onerror = () => {
                speaking = false;
                showError('Terjadi kesalahan saat konversi suara');
                resetUI();
            };

            // Start speaking
            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error('Error:', error);
            showError('Terjadi kesalahan saat konversi teks ke suara');
            resetUI();
        }
    });

    // Setup stop button
    stopBtn.addEventListener('click', () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            speaking = false;
        }
        resetUI();
    });

    function resetUI() {
        status.classList.add('hidden');
        convertBtn.disabled = false;
        stopBtn.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        error.classList.remove('hidden');
        setTimeout(() => {
            error.classList.add('hidden');
        }, 5000);
    }

    // Ensure speech synthesis is ready
    window.speechSynthesis.cancel();
});
