import SwiftUI

struct LiveTestView: View {
    @EnvironmentObject var coordinator: OnboardingCoordinator
    @State private var hitCount = 0
    @State private var impact: String? = nil
    @State private var impactKey = 0
    @State private var appeared = false

    var preset: Preset { coordinator.selectedPreset }

    let impacts = ["SLAP!", "OUCH!", "STOP IT!", "AGAIN?!", "REALLY?!"]
    let punchlines = ["Your Mac felt that.", "Again?", "Okay, unnecessary.", "It remembers.", "Violence noted."]

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 6) {
                Text("Try it now")
                    .font(.system(size: 24, weight: .black))
                    .foregroundColor(.white)
                Text(triggerPrompt)
                    .font(.system(size: 13))
                    .foregroundColor(Color.white.opacity(0.4))
            }
            .padding(.bottom, 24)
            .opacity(appeared ? 1 : 0)

            // Reaction stage
            ZStack {
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.white.opacity(0.04))
                    .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.white.opacity(0.08), lineWidth: 1))
                    .frame(height: 180)

                if let word = impact {
                    VStack(spacing: 8) {
                        Text(word)
                            .font(.system(size: 42, weight: .black))
                            .foregroundColor(Color(hex: preset.accentHex))
                            .id(impactKey)
                            .transition(.scale(scale: 0.5).combined(with: .opacity))

                        if hitCount > 0 {
                            Text(punchlines[min(hitCount - 1, punchlines.count - 1)])
                                .font(.system(size: 13))
                                .foregroundColor(Color.white.opacity(0.5))
                                .transition(.opacity)
                        }
                    }
                    .animation(.spring(response: 0.35, dampingFraction: 0.6), value: impactKey)
                } else {
                    VStack(spacing: 8) {
                        Text(preset.emoji)
                            .font(.system(size: 44))
                            .opacity(0.6)
                        Text(hitCount == 0 ? "Waiting for trigger…" : "Nice! Hit it again.")
                            .font(.system(size: 13))
                            .foregroundColor(Color.white.opacity(0.3))
                    }
                }
            }
            .padding(.horizontal, 52)
            .onTapGesture { if preset.trigger == .spamClick { simulateHit() } }

            if preset.trigger == .spamClick {
                Text("Tap this area 8 times fast")
                    .font(.system(size: 11))
                    .foregroundColor(Color.white.opacity(0.25))
                    .padding(.top, 8)
            }

            Spacer()

            VStack(spacing: 10) {
                if hitCount > 0 {
                    Text("🎉 It works! SlapBack will live in your menu bar.")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "#34d399"))
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                        .animation(.spring(response: 0.4), value: hitCount)
                }

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

                    Button(action: { coordinator.finish() }) {
                        Text(hitCount > 0 ? "Keep SlapBack in Dock →" : "Skip →")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(hitCount > 0 ? Color(hex: preset.accentHex) : Color.white.opacity(0.1))
                            .cornerRadius(12)
                    }
                    .buttonStyle(.plain)
                    .animation(.easeOut(duration: 0.2), value: hitCount)
                }
                .padding(.horizontal, 60)
            }
            .padding(.bottom, 36)
        }
        .padding(.top, 4)
        .onAppear {
            withAnimation(.easeOut(duration: 0.4).delay(0.05)) { appeared = true }
        }
    }

    var triggerPrompt: String {
        switch preset.trigger {
        case .spaceKey:   return "Press Space to feel it."
        case .capsLock:   return "Toggle Caps Lock."
        case .micTap:     return "Tap your desk."
        case .spamClick:  return "Spam-click the box below."
        }
    }

    func simulateHit() {
        coordinator.previewSound(preset.soundName)
        hitCount += 1
        let word = impacts[hitCount % impacts.count]
        withAnimation {
            impact = word
            impactKey += 1
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            withAnimation { impact = nil }
        }
    }
}
