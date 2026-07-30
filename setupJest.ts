import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register({ url: 'http://localhost/' })

// @ts-expect-error jest-dom is a side-effect import with ambient-only types.
await import('@testing-library/jest-dom')
const { cleanup } = await import('@testing-library/react')

afterEach(() => {
  cleanup()
})

class ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            width: 800,
            height: 400,
          },
        } as ResizeObserverEntry,
      ],
      this as unknown as globalThis.ResizeObserver,
    )
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
