import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject var coordinator: OnboardingCoordinator
    @State private var emojiScale: CGFloat = 1.0
    @State private var appeared = false

    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            // Ambient glow
            ZStack {
                Circle()
                    .fill(Color(hex: "#ef4444").opacity(0.12))
                    .frame(width: 280, height: 280)
                    .blur(radius: 60)

                Text("👋")
                    .font(.system(size: 72))
                    .scaleEffect(emojiScale)
                    .onAppear {
                        withAnimation(
                            .spring(response: 0.5, dampingFraction: 0.4)
                            .repeatForever(autoreverses: true)
                            .delay(0.3)
                        ) {
                            emojiScale = 1.08
                        }
                    }
            }
            .padding(.bottom, 32)

            VStack(spacing: 12) {
                Text("Welcome to SlapBack")
                    .font(.system(size: 32, weight: .black, design: .default))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)

                Text("Your Mac is about to get a personality.\nLoud, reactive, and zero chill.")
                    .font(.system(size: 15))
                    .foregroundColor(Color.white.opacity(0.5))
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }
            .opacity(appeared ? 1 : 0)
            .offset(y: appeared ? 0 : 12)

            Spacer()

            Button(action: { coordinator.next() }) {
                Text("Let\u{2019}s go →")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color(hex: "#ef4444"))
                    .cornerRadius(16)
            }
            .buttonStyle(.plain)
            .padding(.horizontal, 80)
            .padding(.bottom, 40)
            .opacity(appeared ? 1 : 0)
            .offset(y: appeared ? 0 : 8)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.5).delay(0.1)) {
                appeared = true
            }
        }
    }
}
