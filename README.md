# paperclip-plugin-notification-sound

A [Paperclip](https://github.com/paperclipai/paperclip) plugin that plays a notification sound when issues change status.

## What it does

Plays a Glass notification sound when an issue moves to:
- **in_review** — agent needs your attention
- **blocked** — agent hit a blocker
- **done** — agent finished the work

A mute/unmute toggle appears in the global toolbar. Mute state persists across page reloads.

## Install

In the Paperclip UI, go to **Plugins → Install from npm** and enter:

```
paperclip-plugin-notification-sound
```

## Browser setup

For sounds to play without clicking the page first, allow auto-play audio for your Paperclip instance:

**Chrome:** Click the lock/tune icon in the address bar → Sound → Allow

## How it works

- The worker subscribes to `issue.updated` events and filters for status changes to `in_review`, `blocked`, or `done`
- The UI polls the worker every 800ms for new events
- When a new event is detected, the Glass sound plays
- Events are logged to the browser console: `[NotificationSound] SER-155 → done (agent)`

## Capabilities

| Capability | Why |
|---|---|
| `events.subscribe` | Listen for issue status changes |
| `plugin.state.read` | Read event buffer |
| `plugin.state.write` | Write event buffer |
| `ui.action.register` | Required for globalToolbarButton slot |

## License

MIT
