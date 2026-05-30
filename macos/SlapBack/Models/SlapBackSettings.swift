import Foundation
import Combine

class SlapBackSettings: ObservableObject {
    // Onboarding
    @Published var isOnboardingComplete: Bool {
        didSet { UserDefaults.standard.set(isOnboardingComplete, forKey: "isOnboardingComplete") }
    }

    // Active preset
    @Published var activePresetId: String {
        didSet { UserDefaults.standard.set(activePresetId, forKey: "activePresetId") }
    }

    // Playback
    @Published var isMuted: Bool {
        didSet { UserDefaults.standard.set(isMuted, forKey: "isMuted") }
    }

    @Published var volume: Double {
        didSet { UserDefaults.standard.set(volume, forKey: "volume") }
    }

    // Behavior
    @Published var cooldownSeconds: Double {
        didSet { UserDefaults.standard.set(cooldownSeconds, forKey: "cooldownSeconds") }
    }

    @Published var isQuietMode: Bool {
        didSet { UserDefaults.standard.set(isQuietMode, forKey: "isQuietMode") }
    }

    // Pause until
    @Published var pausedUntil: Date? {
        didSet {
            if let d = pausedUntil {
                UserDefaults.standard.set(d, forKey: "pausedUntil")
            } else {
                UserDefaults.standard.removeObject(forKey: "pausedUntil")
            }
        }
    }

    var isPaused: Bool {
        guard let until = pausedUntil else { return false }
        if Date() >= until { pausedUntil = nil; return false }
        return true
    }

    var activePreset: Preset {
        Preset.find(activePresetId) ?? Preset.all[0]
    }

    init() {
        let ud = UserDefaults.standard
        isOnboardingComplete = ud.bool(forKey: "isOnboardingComplete")
        activePresetId       = ud.string(forKey: "activePresetId") ?? Preset.all[0].id
        isMuted              = ud.bool(forKey: "isMuted")
        volume               = ud.object(forKey: "volume") as? Double ?? 1.0
        cooldownSeconds      = ud.object(forKey: "cooldownSeconds") as? Double ?? 0.7
        isQuietMode          = ud.bool(forKey: "isQuietMode")
        pausedUntil          = ud.object(forKey: "pausedUntil") as? Date
    }

    func pauseFor(_ minutes: Int) {
        pausedUntil = Date().addingTimeInterval(Double(minutes) * 60)
    }

    func resume() {
        pausedUntil = nil
    }
}
