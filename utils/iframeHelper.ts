/**
 * IframeHelper — universal iframe locator and interaction utilities.
 * Works with any enterprise app that embeds iframes (Oracle ADF, WMS dashboards, etc.)
 */
import { Page, FrameLocator, Locator } from '@playwright/test'

export class IframeHelper {
  constructor(private page: Page) {}

  /** Get a frame locator by any stable attribute */
  frame(selector: string): FrameLocator {
    return this.page.frameLocator(selector)
  }

  /** Wait for an iframe to be attached and its content loaded */
  async waitForFrame(selector: string, timeout = 30_000): Promise<FrameLocator> {
    await this.page.locator(selector).waitFor({ state: 'attached', timeout })
    return this.frame(selector)
  }

  /** Get a locator inside a specific iframe */
  locatorInFrame(iframeSelector: string, elementSelector: string): Locator {
    return this.frame(iframeSelector).locator(elementSelector)
  }

  /** Click inside an iframe */
  async clickInFrame(iframeSelector: string, elementSelector: string): Promise<void> {
    await this.locatorInFrame(iframeSelector, elementSelector).click()
  }

  /** Fill a field inside an iframe */
  async fillInFrame(iframeSelector: string, elementSelector: string, value: string): Promise<void> {
    await this.locatorInFrame(iframeSelector, elementSelector).fill(value)
  }

  /** Get text content from an iframe element */
  async getTextInFrame(iframeSelector: string, elementSelector: string): Promise<string> {
    return (await this.locatorInFrame(iframeSelector, elementSelector).textContent()) ?? ''
  }
}
