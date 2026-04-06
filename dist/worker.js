// src/worker.ts
import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
var MAX_EVENT_BUFFER = 50;
var WATCHED_STATUSES = ["in_review", "blocked", "done"];
var plugin = definePlugin({
  async setup(ctx) {
    const recentEvents = [];
    ctx.events.on("issue.updated", async (event) => {
      const status = event.payload?.status;
      if (!WATCHED_STATUSES.includes(status))
        return;
      const { eventType: _, ...detail } = event;
      recentEvents.push({
        type: "issue.updated",
        entityId: event.entityId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        detail
      });
      if (recentEvents.length > MAX_EVENT_BUFFER) {
        recentEvents.splice(0, recentEvents.length - MAX_EVENT_BUFFER);
      }
    });
    ctx.data.register("recent-events", async () => ({ events: recentEvents }));
    ctx.data.register("health", async () => ({ status: "ok" }));
  },
  async onHealth() {
    return { status: "ok" };
  }
});
var worker_default = plugin;
runWorker(plugin, import.meta.url);
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
