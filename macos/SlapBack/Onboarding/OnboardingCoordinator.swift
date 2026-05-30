import SwiftUI
import Combine

enum OnboardingStep: Int, CaseIterable {
    case welcome = 0
    case presetPicker
    case calibration
    case permissions
    case liveTest
    case done
}

class OnboardingCoordinator: ObservableObject {
    @Published var step: OnboardingStep = .welcome
    @Published var selectedPreset: Preset = Preset.all[0]

    private let settings: SlapBackSettings
    private let soundManager: SoundManager
    private let onComplete: () -> Void

    init(settings: SlapBackSettings, soundManager: SoundManager, onComplete: @escaping () -> Void) {
        self.settings = settings
        self.soundManager = soundManager
        self.onComplete = onComplete
    }

    func next() {
        switch step {
        case .welcome:      step = .presetPicker
        case .presetPicker: step = .calibration
        case .calibration:  step = .permissions
        case .permissions:  step = .liveTest
        case .liveTest:     finish()
        case .done:         break
        }
    }

    func back() {
        guard let prev = OnboardingStep(rawValue: step.rawValue - 1) else { return }
        step = prev
    }

    func selectPreset(_ preset: Preset) {
        selectedPreset = preset
    }

    func previewSound(_ name: String) {
        soundManager.preview(soundName: name)
    }

    func finish() {
        settings.activePresetId = selectedPreset.id
        settings.isOnboardingComplete = true
        step = .done
        onComplete()
    }
}
