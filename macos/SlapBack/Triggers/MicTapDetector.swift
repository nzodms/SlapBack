import AVFoundation

// Detects sharp volume spikes in real-time using AVAudioEngine.
// PRIVACY GUARANTEES (enforced in code):
//   - Audio buffers are read for amplitude only; no samples are stored
//   - No recording, no file writing, no network calls
//   - Engine stops immediately when stop() is called
class MicTapDetector {
    private let sensitivity: Double   // 0.0–1.0, higher = more sensitive
    private let onTap: () -> Void
    private var cooldown: Double = 0.7

    private var engine: AVAudioEngine?
    private var baseline: Float = 0.02
    private var lastFired: Date = .distantPast

    init(sensitivity: Double, onTap: @escaping () -> Void, cooldown: Double = 0.7) {
        self.sensitivity = sensitivity
        self.onTap = onTap
        self.cooldown = cooldown
    }

    func start() {
        AVCaptureDevice.requestAccess(for: .audio) { [weak self] granted in
            guard granted else { return }
            DispatchQueue.main.async { self?.startEngine() }
        }
    }

    private func startEngine() {
        let engine = AVAudioEngine()
        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)

        // Threshold: maps sensitivity [0,1] to a spike threshold [0.5, 0.04]
        // Higher sensitivity → lower threshold → fires more easily
        let threshold: Float = Float(0.5 - sensitivity * 0.46)

        input.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] buffer, _ in
            guard let self = self else { return }
            // Compute RMS (root mean square) amplitude — no audio stored
            guard let channelData = buffer.floatChannelData?[0] else { return }
            let frameCount = Int(buffer.frameLength)
            var sumSquares: Float = 0
            for i in 0..<frameCount { sumSquares += channelData[i] * channelData[i] }
            let rms = sqrtf(sumSquares / Float(frameCount))

            // Adaptive baseline: slow-follow ambient level
            self.baseline = self.baseline * 0.97 + rms * 0.03

            let spike = rms - self.baseline
            if spike > threshold {
                let now = Date()
                if now.timeIntervalSince(self.lastFired) >= self.cooldown {
                    self.lastFired = now
                    DispatchQueue.main.async { self.onTap() }
                }
            }
        }

        do {
            try engine.start()
            self.engine = engine
        } catch {
            // Microphone unavailable — fail silently
        }
    }

    func stop() {
        engine?.inputNode.removeTap(onBus: 0)
        engine?.stop()
        engine = nil
        baseline = 0.02
    }
}
