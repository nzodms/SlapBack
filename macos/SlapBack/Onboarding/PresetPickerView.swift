import SwiftUI

struct PresetPickerView: View {
    @EnvironmentObject var coordinator: OnboardingCoordinator

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 6) {
                Text("Choose your preset")
                    .font(.system(size: 26, weight: .black))
                    .foregroundColor(.white)
                Text("Pick one to start. You can change it any time.")
                    .font(.system(size: 13))
                    .foregroundColor(Color.white.opacity(0.4))
            }
            .padding(.bottom, 24)

            VStack(spacing: 10) {
                ForEach(Preset.all) { preset in
                    PresetCard(
                        preset: preset,
                        isSelected: coordinator.selectedPreset.id == preset.id,
                        onSelect: { coordinator.selectPreset(preset) },
                        onPreview: { coordinator.previewSound(preset.soundName) }
                    )
                }
            }
            .padding(.horizontal, 48)

            Spacer()

            Button(action: { coordinator.next() }) {
                Text("Use \u{201C}\(coordinator.selectedPreset.name)\u{201D} →")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 15)
                    .background(Color(hex: coordinator.selectedPreset.accentHex))
                    .cornerRadius(14)
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 80)
            .padding(.bottom, 36)
        }
        .padding(.top, 4)
    }
}

struct PresetCard: View {
    let preset: Preset
    let isSelected: Bool
    let onSelect: () -> Void
    let onPreview: () -> Void

    var accentColor: Color { Color(hex: preset.accentHex) }

    var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 14) {
                Text(preset.emoji)
                    .font(.system(size: 28))
                    .frame(width: 44, height: 44)
                    .background(accentColor.opacity(0.12))
                    .cornerRadius(10)

                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text(preset.name)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                        if preset.isRecommended {
                            Text("RECOMMENDED")
                                .font(.system(size: 9, weight: .black))
                                .foregroundColor(accentColor)
                                .padding(.horizontal, 5)
                                .padding(.vertical, 2)
                                .background(accentColor.opacity(0.15))
                                .cornerRadius(4)
                        }
                    }
                    Text(preset.tagline)
                        .font(.system(size: 11))
                        .foregroundColor(Color.white.opacity(0.4))
                }

                Spacer()

                Button(action: onPreview) {
                    Text("▶")
                        .font(.system(size: 11))
                        .foregroundColor(Color.white.opacity(0.5))
                        .frame(width: 30, height: 30)
                        .background(Color.white.opacity(0.07))
                        .cornerRadius(8)
                }
                .buttonStyle(.plain)
                .help("Preview sound")

                Circle()
                    .strokeBorder(isSelected ? accentColor : Color.white.opacity(0.2), lineWidth: 2)
                    .background(
                        Circle().fill(isSelected ? accentColor : Color.clear)
                    )
                    .frame(width: 18, height: 18)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? accentColor.opacity(0.1) : Color.white.opacity(0.04))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(isSelected ? accentColor.opacity(0.5) : Color.white.opacity(0.08), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(.plain)
        .animation(.easeOut(duration: 0.15), value: isSelected)
    }
}
