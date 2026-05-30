import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var settings: SlapBackSettings
    @EnvironmentObject var soundManager: SoundManager

    var body: some View {
        TabView {
            GeneralSettingsTab()
                .tabItem { Label("General", systemImage: "gearshape") }
        }
        .frame(width: 400, height: 340)
        .background(Color(hex: "#111111"))
    }
}

struct GeneralSettingsTab: View {
    @EnvironmentObject var settings: SlapBackSettings
    @EnvironmentObject var soundManager: SoundManager

    var body: some View {
        Form {
            Section("Preset") {
                Picker("Active preset", selection: $settings.activePresetId) {
                    ForEach(Preset.all) { preset in
                        Text("\(preset.emoji) \(preset.name)").tag(preset.id)
                    }
                }
                .pickerStyle(.menu)
            }

            Section("Sound") {
                Toggle("Mute", isOn: Binding(
                    get: { soundManager.isMuted },
                    set: { soundManager.isMuted = $0; settings.isMuted = $0 }
                ))

                HStack {
                    Text("Volume")
                    Slider(value: Binding(
                        get: { soundManager.volume },
                        set: { soundManager.volume = $0; settings.volume = $0 }
                    ), in: 0...1)
                }
            }

            Section("Behavior") {
                HStack {
                    Text("Cooldown")
                    Spacer()
                    Text("\(settings.cooldownSeconds, specifier: "%.1f")s")
                        .foregroundColor(.secondary)
                    Slider(value: $settings.cooldownSeconds, in: 0.2...3.0, step: 0.1)
                        .frame(width: 120)
                }

                Toggle("Quiet mode (no overlay flash)", isOn: $settings.isQuietMode)
            }

            Section("Pause") {
                if settings.isPaused {
                    HStack {
                        Text("Paused until \(settings.pausedUntil.map { timeFormatter.string(from: $0) } ?? "—")")
                            .foregroundColor(.secondary)
                        Spacer()
                        Button("Resume") { settings.resume() }
                    }
                } else {
                    HStack(spacing: 10) {
                        Button("Pause 30 min") { settings.pauseFor(30) }
                        Button("Pause 1 hour") { settings.pauseFor(60) }
                    }
                }
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    private var timeFormatter: DateFormatter = {
        let f = DateFormatter()
        f.timeStyle = .short
        return f
    }()
}
