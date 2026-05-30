import SwiftUI

struct OnboardingContainerView: View {
    @EnvironmentObject var coordinator: OnboardingCoordinator

    var body: some View {
        ZStack {
            Color(hex: "#0a0a0a").ignoresSafeArea()

            VStack(spacing: 0) {
                // Step dots header
                StepDotsView(current: coordinator.step.rawValue, total: 5)
                    .padding(.top, 28)
                    .padding(.bottom, 24)

                // Step content
                Group {
                    switch coordinator.step {
                    case .welcome:
                        WelcomeView()
                    case .presetPicker:
                        PresetPickerView()
                    case .calibration:
                        CalibrationView()
                    case .permissions:
                        PermissionsView()
                    case .liveTest:
                        LiveTestView()
                    case .done:
                        EmptyView()
                    }
                }
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
                .animation(.spring(response: 0.4, dampingFraction: 0.85), value: coordinator.step)
            }
        }
        .frame(width: 640, height: 520)
    }
}

struct StepDotsView: View {
    let current: Int
    let total: Int

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<total, id: \.self) { i in
                RoundedRectangle(cornerRadius: 3)
                    .fill(i == current ? Color(hex: "#ef4444") : Color.white.opacity(0.15))
                    .frame(width: i == current ? 20 : 6, height: 6)
                    .animation(.spring(response: 0.3), value: current)
            }
        }
    }
}

// MARK: - Color helper
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8) & 0xFF) / 255
        let b = Double(int & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
