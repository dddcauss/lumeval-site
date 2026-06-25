import { create } from 'zustand'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

// 'ai-vendor' is kept in the type so existing code compiles, but it's only
// reachable when FEATURE_FLAGS.aiVendorEnabled is true.
export type View = 'employer' | 'worker' | 'ai-vendor'

// The active set of views, filtered by feature flags.
export const ACTIVE_VIEWS: View[] = FEATURE_FLAGS.aiVendorEnabled
  ? ['employer', 'worker', 'ai-vendor']
  : ['employer', 'worker']

interface ViewState {
  view: View
  setView: (v: View) => void
}

export const useViewStore = create<ViewState>((set, get) => ({
  // Default to employer; fall back to first active view if ai-vendor is disabled
  view: ACTIVE_VIEWS.includes('employer') ? 'employer' : ACTIVE_VIEWS[0],
  setView: (view) => {
    // Guard: don't allow switching to a disabled view
    if (!ACTIVE_VIEWS.includes(view)) return
    set({ view })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
}))
