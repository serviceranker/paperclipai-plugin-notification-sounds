import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import type { SoundEvent } from "./types.js";

const MAX_EVENT_BUFFER = 50;
const WATCHED_STATUSES = ["in_review", "blocked", "done"];

const plugin = definePlugin({
  async setup(ctx) {
    const recentEvents: SoundEvent[] = [];

    ctx.events.on("issue.updated", async (event) => {
      const status = (event as any).payload?.status;
      if (!WATCHED_STATUSES.includes(status)) return;

      const { eventType: _, ...detail } = event as any;
      recentEvents.push({
        type: "issue.updated",
        entityId: event.entityId,
        timestamp: new Date().toISOString(),
        detail,
      });

      if (recentEvents.length > MAX_EVENT_BUFFER) {
        recentEvents.splice(0, recentEvents.length - MAX_EVENT_BUFFER);
      }
    });

    ctx.data.register("recent-events", async () => ({ events: recentEvents }));
    ctx.data.register("health", async () => ({ status: "ok" }));
  },

  async onHealth() {
    return { status: "ok" as const };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
