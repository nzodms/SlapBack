import Foundation

enum TriggerType: String, CaseIterable, Codable {
    case spaceKey = "space-key"
    case spamClick = "spam-click"
    case micTap = "mic-tap"
    case capsLock = "caps-lock"
}

struct Preset: Identifiable, Codable {
    let id: String
    let name: String
    let emoji: String
    let tagline: String
    let trigger: TriggerType
    let soundName: String
    let isRecommended: Bool
    let accentHex: String

    // Trigger-specific params
    let spamClickCount: Int    // clicks needed for spam-click
    let spamClickWindow: Double // seconds
    let micSensitivity: Double  // 0.0–1.0

    var accent: String { accentHex }
}

extension Preset {
    static let all: [Preset] = [
        Preset(
            id: "spacebar-scream",
            name: "Make my Spacebar scream",
            emoji: "⎵",
            tagline: "Every Space bar press triggers a scream.",
            trigger: .spaceKey,
            soundName: "scream",
            isRecommended: true,
            accentHex: "#ef4444",
            spamClickCount: 6,
            spamClickWindow: 2.0,
            micSensitivity: 0.65
        ),
        Preset(
            id: "spam-clicks",
            name: "My Mac hates spam clicks",
            emoji: "🖱️",
            tagline: "Click too much and it loses it.",
            trigger: .spamClick,
            soundName: "ouch",
            isRecommended: false,
            accentHex: "#facc15",
            spamClickCount: 8,
            spamClickWindow: 2.0,
            micSensitivity: 0.65
        ),
        Preset(
            id: "tap-desk",
            name: "Tap desk = scream",
            emoji: "🪵",
            tagline: "Tap your desk, your Mac screams back.",
            trigger: .micTap,
            soundName: "slap",
            isRecommended: false,
            accentHex: "#34d399",
            spamClickCount: 6,
            spamClickWindow: 2.0,
            micSensitivity: 0.55
        ),
        Preset(
            id: "caps-lock-demon",
            name: "Caps Lock demon",
            emoji: "😈",
            tagline: "Caps Lock summons the demon every time.",
            trigger: .capsLock,
            soundName: "demon",
            isRecommended: false,
            accentHex: "#a78bfa",
            spamClickCount: 6,
            spamClickWindow: 2.0,
            micSensitivity: 0.65
        ),
    ]

    static func find(_ id: String) -> Preset? {
        all.first { $0.id == id }
    }
}
