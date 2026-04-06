export interface SoundEvent {
  type: string;
  entityId?: string;
  timestamp: string;
  detail?: Record<string, unknown>;
}
