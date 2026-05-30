import Foundation
import AppKit

// Coordinates all active trigger monitors based on the selected preset.
class TriggerEngine {
    private let settings: SlapBackSettings
    private let onFire: () -> Void

    private var keyMonitor: GlobalKeyMonitor?
    private var clickMonitor: ClickSpamDetector?
    private var micDetector: MicTapDetector?

    // Cooldown tracking
    private var lastFired: Date = .distantPast
    private var cooldown: Double { settings.cooldownSeconds }

    init(settings: SlapBackSettings, onFire: @escaping () -> Void) {
        self.settings = settings
        self.onFire = onFire
    }

    func start() {
        stop()
        let preset = settings.activePreset

        switch preset.trigger {
        case .spaceKey, .capsLock:
            keyMonitor = GlobalKeyMonitor(
                trigger: preset.trigger,
                onTrigger: { [weak self] in self?.fire() }
            )
            keyMonitor?.start()

        case .spamClick:
            clickMonitor = ClickSpamDetector(
                count: preset.spamClickCount,
                window: preset.spamClickWindow,
                onSpam: { [weak self] in self?.fire() }
            )
            clickMonitor?.start()

        case .micTap:
            micDetector = MicTapDetector(
                sensitivity: preset.micSensitivity,
                onTap: { [weak self] in self?.fire() }
            )
            micDetector?.start()
        }
    }

    func stop() {
        keyMonitor?.stop()
        clickMonitor?.stop()
        micDetector?.stop()
        keyMonitor = nil
        clickMonitor = nil
        micDetector = nil
    }

    private func fire() {
        guard !settings.isPaused else { return }
        let now = Date()
        guard now.timeIntervalSince(lastFired) >= cooldown else { return }
        lastFired = now
        DispatchQueue.main.async { self.onFire() }
    }
}
