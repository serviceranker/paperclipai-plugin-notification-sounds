const manifest = {
  id: "paperclipai.notification-sound",
  apiVersion: 1,
  version: "1.0.0",
  displayName: "Notification Sound",
  description: "Plays a notification sound when issues change to in_review, blocked, or done.",
  author: "Service Ranker",
  categories: ["ui"],
  capabilities: [
    "events.subscribe",
    "plugin.state.read",
    "plugin.state.write",
    "ui.action.register"
  ],
  entrypoints: {
    worker: "dist/worker.js",
    ui: "dist/ui"
  },
  ui: {
    slots: [
      {
        type: "globalToolbarButton",
        id: "notification-sound",
        displayName: "Notification Sound",
        exportName: "NotificationListener"
      }
    ]
  }
};
var manifest_default = manifest;
export {
  manifest_default as default
};
//# sourceMappingURL=paperclip-manifest.mjs.map
