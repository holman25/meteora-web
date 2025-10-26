import 'happy-dom'
// @ts-ignore
globalThis.matchMedia = globalThis.matchMedia || (() => ({
  matches: false, addListener: () => {}, removeListener: () => {},
  addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
}))

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
globalThis.ResizeObserver = globalThis.ResizeObserver || MockResizeObserver

if (!('fetch' in globalThis)) {
  // @ts-ignore
  globalThis.fetch = async () => ({ ok: true, json: async () => ({}) })
}
