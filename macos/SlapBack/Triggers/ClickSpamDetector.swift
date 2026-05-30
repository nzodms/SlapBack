import AppKit

// Fires when the user clicks `count` times within `window` seconds.
// Uses a global CGEvent tap — detects clicks in any application.
// Never records cursor position history or content.
class ClickSpamDetector {
    private let count: Int
    private let window: Double
    private let onSpam: () -> Void
    private var timestamps: [Date] = []
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?

    init(count: Int, window: Double, onSpam: @escaping () -> Void) {
        self.count = count
        self.window = window
        self.onSpam = onSpam
    }

    func start() {
        let mask = CGEventMask(1 << CGEventType.leftMouseDown.rawValue)

        let callback: CGEventTapCallBack = { proxy, type, event, refcon in
            guard let refcon = refcon else { return Unmanaged.passRetained(event) }
            Unmanaged<ClickSpamDetector>.fromOpaque(refcon).takeUnretainedValue().handleClick()
            return Unmanaged.passRetained(event)
        }

        let selfPtr = Unmanaged.passUnretained(self).toOpaque()
        eventTap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .listenOnly,
            eventsOfInterest: mask,
            callback: callback,
            userInfo: selfPtr
        )

        guard let tap = eventTap else { return }
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        if let source = runLoopSource {
            CFRunLoopAddSource(CFRunLoopGetMain(), source, .commonModes)
        }
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    func stop() {
        if let tap = eventTap { CGEvent.tapEnable(tap: tap, enable: false) }
        if let source = runLoopSource { CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes) }
        eventTap = nil
        runLoopSource = nil
        timestamps.removeAll()
    }

    private func handleClick() {
        let now = Date()
        timestamps.append(now)
        timestamps = timestamps.filter { now.timeIntervalSince($0) <= window }
        if timestamps.count >= count {
            timestamps.removeAll()
            onSpam()
        }
    }
}
