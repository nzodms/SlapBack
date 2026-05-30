import AVFoundation
import AppKit

// Sounds live in Resources/Sounds/*.mp3
// File names: scream.mp3, ouch.mp3, slap.mp3, demon.mp3
class SoundManager: ObservableObject {
    private var players: [String: AVAudioPlayer] = [:]
    @Published var isMuted = false
    var volume: Double = 1.0 {
        didSet { players.values.forEach { $0.volume = Float(volume) } }
    }

    func loadSounds() {
        let names = ["scream", "ouch", "slap", "demon"]
        for name in names {
            guard let url = Bundle.main.url(forResource: name, withExtension: "mp3") else { continue }
            do {
                let player = try AVAudioPlayer(contentsOf: url)
                player.prepareToPlay()
                players[name] = player
            } catch {
                // No audio file yet — silent in dev, add MP3s to Resources/Sounds/
            }
        }
    }

    func play(soundName: String) {
        guard !isMuted else { return }
        guard let player = players[soundName] else {
            // Fallback: NSSound system beep so the trigger isn't silent during development
            NSSound.beep()
            return
        }
        if player.isPlaying { player.currentTime = 0 }
        player.volume = Float(volume)
        player.play()
    }

    func preview(soundName: String) {
        // Preview always audible regardless of mute
        guard let player = players[soundName] else { NSSound.beep(); return }
        if player.isPlaying { player.stop(); player.currentTime = 0 }
        player.volume = Float(volume)
        player.play()
    }

    func toggleMute() {
        isMuted.toggle()
    }
}
