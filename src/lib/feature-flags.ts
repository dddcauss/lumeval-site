// ============================================================
// LUMEVAL — Feature Flags
// ============================================================
// Toggle product surfaces on/off without removing code.
// To enable the AI Vendor (Lumeval Standard) surface, set to true.
// ============================================================

export const FEATURE_FLAGS = {
  // The Lumeval Standard — AI MSK Certification surface.
  // OFF for now: the certification methodology + test set + pipeline
  // need to be built before this can be a public promise.
  // Flip to true when ready to start the AI vendor conversation.
  aiVendorEnabled: false,
} as const

export type FeatureFlags = typeof FEATURE_FLAGS
