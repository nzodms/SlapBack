import SwiftUI
import AVFoundation

struct PermissionsView: View {
    @EnvironmentObject var coordinator: OnboardingCoordinator
    @State private var accessibilityGranted = false
    @State private var micGranted = false
    @State private var appeared = false

    var preset: Preset { coordinator.selectedPreset }
    var needsMic: Bool { preset.trigger == .micTap }
    var needsAccessibility: Bool { preset.trigger != .micTap }

    var canContinue: Bool {
        if needsMic { return micGranted }
        return accessibilityGranted
    }

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 6) {
                Text("One-time permissions")
                    .font(.system(size: 24, weight: .black))
                    .foregroundColor(.white)
                Text("SlapBack needs one permission to detect your trigger.")
                    .font(.system(size: 13))
                    .foregroundColor(Color.white.opacity(0.4))
            }
            .padding(.bottom, 24)
            .opacity(appeared ? 1 : 0)

            VStack(spacing: 12) {
                if needsAccessibility {
                    PermissionCard(
                        icon: "⌨️",
                        title: "Accessibility",
                        body: "Lets SlapBack detect your trigger key system-wide. It only listens for the key you configured — nothing else is read or stored.",
                        isGranted: accessibilityGranted,
                        buttonLabel: "Open Accessibility Settings",
                        onGrant: { openAccessibilityPrefs() }
                    )
                }

                if needsMic {
                    PermissionCard(
                        icon: "🎤",
                        title: "Microphone",
                        body: "Lets SlapBack detect desk taps via volume spikes. No audio is recorded or sent anywhere.",
                        isGranted: micGranted,
                        buttonLabel: "Allow Microphone",
                        onGrant: { requestMicPermission() }
                    )
                }
            }
            .padding(.horizontal, 52)
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
                    Text(canContinue ? "Continue →" : "Skip for now →")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(canContinue ? Color(hex: preset.accentHex) : Color.white.opacity(0.1))
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
            checkCurrentPermissions()
        }
    }

    private func checkCurrentPermissions() {
        // Accessibility: check if already trusted
        let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: false] as CFDictionary
        accessibilityGranted = AXIsProcessTrustedWithOptions(opts)

        // Microphone
        switch AVCaptureDevice.authorizationStatus(for: .audio) {
        case .authorized:   micGranted = true
        case .denied, .restricted: micGranted = false
        default: micGranted = false
        }
    }

    private func openAccessibilityPrefs() {
        // Prompt the system dialog (first time) or open System Settings
        let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
        let trusted = AXIsProcessTrustedWithOptions(opts)
        accessibilityGranted = trusted

        if !trusted {
            if let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility") {
                NSWorkspace.shared.open(url)
            }
        }

        // Poll for a few seconds in case user grants it
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            let opts2 = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: false] as CFDictionary
            accessibilityGranted = AXIsProcessTrustedWithOptions(opts2)
        }
    }

    private func requestMicPermission() {
        AVCaptureDevice.requestAccess(for: .audio) { granted in
            DispatchQueue.main.async { micGranted = granted }
        }
    }
}

struct PermissionCard: View {
    let icon: String
    let title: String
    let body: String
    let isGranted: Bool
    let buttonLabel: String
    let onGrant: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Text(icon)
                    .font(.system(size: 22))
                Text(title)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
                if isGranted {
                    Label("Granted", systemImage: "checkmark.circle.fill")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(hex: "#34d399"))
                        .labelStyle(.titleAndIcon)
                }
            }

            Text(body)
                .font(.system(size: 12))
                .foregroundColor(Color.white.opacity(0.45))
                .lineSpacing(3)

            if !isGranted {
                Button(action: onGrant) {
                    Text(buttonLabel)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.white.opacity(0.1))
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color.white.opacity(0.15), lineWidth: 1)
                        )
                        .cornerRadius(10)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.05))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(
                    isGranted ? Color(hex: "#34d399").opacity(0.4) : Color.white.opacity(0.1),
                    lineWidth: 1
                ))
        )
    }
}
