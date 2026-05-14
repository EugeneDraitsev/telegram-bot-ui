import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

// @ts-expect-error jest-dom is a side-effect import with ambient-only types.
await import('@testing-library/jest-dom')
const { cleanup } = await import('@testing-library/react')

afterEach(() => {
  cleanup()
})

class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}
// @ts-ignore
window.ResizeObserver = ResizeObserver
