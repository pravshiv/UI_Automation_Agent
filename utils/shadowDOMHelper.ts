/**
 * ShadowDOMHelper — Playwright auto-pierces shadow roots with its built-in
 * locator engine. This helper provides convenience methods and documents
 * the patterns for shadow DOM interaction.
 */
import { Page, Locator } from '@playwright/test'

export class ShadowDOMHelper {
  constructor(private page: Page) {}

  /**
   * Playwright automatically pierces open shadow roots.
   * Use standard locators — they will traverse shadow boundaries:
   *   this.page.locator('my-button >> css=button')
   *   this.page.getByRole('button', { name: 'Submit' })
   */
  locator(selector: string): Locator {
    return this.page.locator(selector)
  }

  /** Shadow-piercing getByRole */
  getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options)
  }

  /**
   * Evaluate JavaScript inside a shadow root.
   * @param hostSelector - CSS selector for the shadow host element
   * @param script       - JS string to evaluate, receives the shadow root
   */
  async evalInShadowRoot<T>(hostSelector: string, script: string): Promise<T> {
    return this.page.evaluate(
      ([sel, fn]: [string, string]) => {
        const host = document.querySelector(sel)
        if (!host || !host.shadowRoot) throw new Error('Shadow root not found for: ' + sel)
        return new Function('shadowRoot', fn)(host.shadowRoot)
      },
      [hostSelector, script] as [string, string],
    )
  }
}
