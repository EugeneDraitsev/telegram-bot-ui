import '@testing-library/jest-dom'

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
