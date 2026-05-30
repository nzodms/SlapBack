import AppKit
import SwiftUI

// Transparent full-screen panel that shows the impact word on top of everything.
// NSPanel with .nonactivatingPanel so it never steals focus.
class OverlayWindow {
    private var panel: NSPanel?
    private var hostingView: NSHostingView<OverlayView>?
    private var model = OverlayModel()

    init() {
        guard let screen = NSScreen.main else { return }
        let panel = NSPanel(
            contentRect: screen.frame,
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        panel.level = .screenSaver
        panel.backgroundColor = .clear
        panel.isOpaque = false
        panel.hasShadow = false
        panel.ignoresMouseEvents = true
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]

        let view = OverlayView(model: model)
        let hosting = NSHostingView(rootView: view)
        hosting.frame = screen.frame
        panel.contentView = hosting

        self.panel = panel
        self.hostingView = hosting
    }

    func show(preset: Preset) {
        guard let panel = panel else { return }
        let words = ["SLAP!", "OUCH!", "STOP IT!", "AGAIN?!", "NOPE!"]
        model.impact = words[Int.random(in: 0..<words.count)]
        model.accentHex = preset.accentHex
        model.triggerKey = UUID()

        panel.orderFrontRegardless()

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) { [weak self] in
            self?.model.impact = nil
        }
    }
}

class OverlayModel: ObservableObject {
    @Published var impact: String? = nil
    @Published var accentHex: String = "#ef4444"
    @Published var triggerKey: UUID = UUID()
}

struct OverlayView: View {
    @ObservedObject var model: OverlayModel

    var body: some View {
        ZStack {
            if model.impact != nil {
                Color(hex: model.accentHex).opacity(0.08)
                    .ignoresSafeArea()
                    .transition(.opacity)
            }

            if let word = model.impact {
                Text(word)
                    .font(.system(size: 96, weight: .black, design: .rounded))
                    .foregroundColor(Color(hex: model.accentHex))
                    .shadow(color: Color(hex: model.accentHex).opacity(0.6), radius: 40)
                    .id(model.triggerKey)
                    .transition(.asymmetric(
                        insertion: .scale(scale: 0.5).combined(with: .opacity),
                        removal: .scale(scale: 1.2).combined(with: .opacity)
                    ))
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.6), value: model.triggerKey)
        .animation(.easeOut(duration: 0.3), value: model.impact != nil)
    }
}
