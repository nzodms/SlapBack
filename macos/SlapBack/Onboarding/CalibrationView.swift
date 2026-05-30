import SwiftUI

struct CalibrationView: View {
    @EnvironmentObject var coordinator: OnboardingCoordinator
    @State private var appeared = false

    var preset: Preset { coordinator.selectedPreset }

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 6) {
                Text(preset.emoji)
                    .font(.system(size: 44))
                Text("Set up \u{201C}\(preset.name)\u{201D}")
                    .font(.system(size: 24, weight: .black))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
            }
            .padding(.bottom, 28)
            .opacity(appeared ? 1 : 0)
            .offset(y: appeared ? 0 : 10)

            calibrationContent
                .padding(.horizontal, 60)
                .opacity(appeared ? 1 : 0)

            Spacer()

            HStack(spacing: 12) {
                Button(action: { coordinator.back() }) {
                    Text("← Back")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color.white.opacity(0.4))
                        .frame(width: 90)
                        .padding(.vertical, 14)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(12)
                }
                .buttonStyle(.plain)

                Button(action: { coordinator.next() }) {
                    Text("Looks good →")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color(hex: preset.accentHex))
                        .cornerRadius(12)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 60)
            .padding(.bottom, 36)
        }
        .padding(.top, 4)
        .onAppear {
            withAnimation(.easeOut(duration: 0.4).delay(0.05)) { appeared = true }
        }
    }

    @ViewBuilder
    var calibrationContent: some View {
        switch preset.trigger {
        case .micTap:
            MicCalibrationCard()
        case .spamClick:
            InfoCard(
                icon: "🖱️",
                title: "Spam click detection",
                body: "SlapBack reacts after \(Int(preset.spamClickCount)) clicks in \(Int(preset.spamClickWindow)) seconds. Works system-wide — in any app."
            )
        case .spaceKey:
            InfoCard(
                icon: "⎵",
                title: "Space key detection",
                body: "SlapBack listens for the Space key system-wide using macOS Accessibility. It will ask for permission next."
            )
        case .capsLock:
            InfoCard(
                icon: "😈",
                title: "Caps Lock detection",
                body: "Every time you hit Caps Lock, the demon awakens. System-wide via Accessibility permission."
            )
        }
    }
}

struct InfoCard: View {
    let icon: String
    let title: String
    let body: String

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            Text(icon)
                .font(.system(size: 28))
            VStack(alignment: .leading, spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                Text(body)
                    .font(.system(size: 13))
                    .foregroundColor(Color.white.opacity(0.5))
                    .lineSpacing(3)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(18)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.05))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.white.opacity(0.1), lineWidth: 1))
        )
    }
}

struct MicCalibrationCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Text("🎤")
                    .font(.system(size: 24))
                Text("Microphone detection")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
            }
            Text("SlapBack listens for sharp volume spikes — like a desk tap. It never records, stores, or sends audio. Detection is local and instant.")
                .font(.system(size: 13))
                .foregroundColor(Color.white.opacity(0.5))
                .lineSpacing(3)

            VStack(spacing: 8) {
                PrivacyRow(icon: "🚫", text: "Never records audio")
                PrivacyRow(icon: "💾", text: "Never stores audio")
                PrivacyRow(icon: "📡", text: "Never sends audio to a server")
                PrivacyRow(icon: "🔒", text: "100% local detection")
            }
            .padding(.top, 4)
        }
        .padding(18)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.05))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.white.opacity(0.1), lineWidth: 1))
        )
    }
}

struct PrivacyRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 8) {
            Text(icon)
                .font(.system(size: 13))
            Text(text)
                .font(.system(size: 12))
                .foregroundColor(Color.white.opacity(0.5))
            Spacer()
        }
    }
}
