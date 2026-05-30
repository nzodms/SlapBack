import SwiftUI

struct MenuBarPopoverView: View {
    @ObservedObject var settings: SlapBackSettings
    @ObservedObject var soundManager: SoundManager
    let onTest: () -> Void
    let onQuit: () -> Void

    @State private var showSettings = false

    var preset: Preset { settings.activePreset }
    var statusColor: Color { settings.isPaused ? Color(hex: "#facc15") : Color(hex: "#34d399") }
    var statusLabel: String { settings.isPaused ? "Paused" : "Active" }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(statusColor)
                            .frame(width: 7, height: 7)
                        Text(statusLabel)
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(statusColor)
                    }
                    Text(preset.name)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.white)
                }
                Spacer()
                Text(preset.emoji)
                    .font(.system(size: 24))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)

            Divider()
                .background(Color.white.opacity(0.1))

            // Controls
            VStack(spacing: 2) {
                PopoverButton(icon: "🔔", label: soundManager.isMuted ? "Unmute" : "Mute", action: {
                    soundManager.toggleMute()
                    settings.isMuted = soundManager.isMuted
                })

                if settings.isPaused {
                    PopoverButton(icon: "▶", label: "Resume", action: { settings.resume() })
                } else {
                    PopoverButton(icon: "⏸", label: "Pause 30 min", action: { settings.pauseFor(30) })
                    PopoverButton(icon: "⏸", label: "Pause 1 hour", action: { settings.pauseFor(60) })
                }

                PopoverButton(icon: "⚡", label: "Test reaction", action: { onTest() })

                PopoverButton(icon: "⚙️", label: "Settings…", action: {
                    NSApp.sendAction(Selector(("showSettingsWindow:")), to: nil, from: nil)
                })
            }
            .padding(.vertical, 6)

            Divider()
                .background(Color.white.opacity(0.1))

            PopoverButton(icon: "✕", label: "Quit SlapBack", action: { onQuit() })
                .padding(.vertical, 4)
        }
        .background(Color(hex: "#111111"))
        .frame(width: 260)
    }
}

struct PopoverButton: View {
    let icon: String
    let label: String
    let action: () -> Void
    @State private var hovering = false

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                Text(icon)
                    .font(.system(size: 14))
                    .frame(width: 20)
                Text(label)
                    .font(.system(size: 13))
                    .foregroundColor(.white)
                Spacer()
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 9)
            .background(hovering ? Color.white.opacity(0.07) : Color.clear)
            .cornerRadius(8)
        }
        .buttonStyle(.plain)
        .onHover { hovering = $0 }
        .padding(.horizontal, 8)
    }
}
