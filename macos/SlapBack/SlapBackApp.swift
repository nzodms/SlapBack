import SwiftUI
import AppKit

@main
struct SlapBackApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        Settings {
            SettingsView()
                .environmentObject(appDelegate.settings)
                .environmentObject(appDelegate.soundManager)
        }
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    var statusBarController: StatusBarController?
    let settings = SlapBackSettings()
    let soundManager = SoundManager()
    var onboardingWindow: NSWindow?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)

        soundManager.loadSounds()
        statusBarController = StatusBarController(settings: settings, soundManager: soundManager)

        if !settings.isOnboardingComplete {
            showOnboarding()
        }
    }

    func showOnboarding() {
        let coordinator = OnboardingCoordinator(settings: settings, soundManager: soundManager) {
            self.onboardingWindow?.close()
            self.onboardingWindow = nil
        }
        let view = OnboardingContainerView().environmentObject(coordinator)
        let hosting = NSHostingController(rootView: view)
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 640, height: 520),
            styleMask: [.titled, .closable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.isMovableByWindowBackground = true
        window.center()
        window.contentViewController = hosting
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        onboardingWindow = window
    }
}
