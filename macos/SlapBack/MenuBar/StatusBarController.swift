import AppKit
import SwiftUI

class StatusBarController {
    private var statusItem: NSStatusItem
    private var popover: NSPopover
    private let settings: SlapBackSettings
    private let soundManager: SoundManager
    private var triggerEngine: TriggerEngine?
    private var overlayWindow: OverlayWindow?

    init(settings: SlapBackSettings, soundManager: SoundManager) {
        self.settings = settings
        self.soundManager = soundManager

        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        popover = NSPopover()
        popover.behavior = .transient

        setupStatusButton()
        setupPopover()
        setupTriggerEngine()
        setupOverlay()
    }

    private func setupStatusButton() {
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: "waveform", accessibilityDescription: "SlapBack")
            button.image?.isTemplate = true
            button.action = #selector(togglePopover)
            button.target = self
        }
    }

    private func setupPopover() {
        let view = MenuBarPopoverView(
            settings: settings,
            soundManager: soundManager,
            onTest: { [weak self] in self?.fireReaction() },
            onQuit: { NSApp.terminate(nil) }
        )
        .environmentObject(settings)
        .environmentObject(soundManager)

        let hosting = NSHostingController(rootView: view)
        hosting.view.frame = NSRect(x: 0, y: 0, width: 260, height: 300)
        popover.contentViewController = hosting
    }

    private func setupTriggerEngine() {
        triggerEngine = TriggerEngine(settings: settings) { [weak self] in
            self?.fireReaction()
        }
        triggerEngine?.start()
    }

    private func setupOverlay() {
        overlayWindow = OverlayWindow()
    }

    func fireReaction() {
        guard !settings.isPaused && !settings.isMuted else { return }
        soundManager.play(soundName: settings.activePreset.soundName)
        overlayWindow?.show(preset: settings.activePreset)
    }

    @objc func togglePopover() {
        guard let button = statusItem.button else { return }
        if popover.isShown {
            popover.performClose(nil)
        } else {
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
        }
    }
}
