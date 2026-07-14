/**
 * RetryHelper — utility for retrying flaky Playwright actions or assertions.
 */
import { Locator, expect, Page } from '@playwright/test'

/**
 * Retry an async action up to maxAttempts times with a delay between each.
 */
export async function withRetry<T>(
  action: () => Promise<T>,
  { maxAttempts = 3, delayMs = 1000, label = 'action' }: { maxAttempts?: number; delayMs?: number; label?: string } = {},
): Promise<T> {
  let lastErr: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action()
    } catch (err) {
      lastErr = err
      console.warn(`[RetryHelper] ${label} attempt ${attempt}/${maxAttempts} failed: ${err}`)
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, delayMs))
    }
  }
  throw lastErr
}

/**
 * Poll a locator's text content until it matches the expected value.
 */
export async function pollUntilText(
  locator: Locator,
  expected: string,
  { timeout = 30_000, interval = 1000 }: { timeout?: number; interval?: number } = {},
): Promise<void> {
  await expect(locator).toHaveText(expected, { timeout })
}

/**
 * Poll a locator's count until it matches.
 */
export async function pollUntilCount(
  locator: Locator,
  count: number,
  { timeout = 30_000 }: { timeout?: number } = {},
): Promise<void> {
  await expect(locator).toHaveCount(count, { timeout })
}

/**
 * Wait for network to be idle after clicking a button (useful for slow enterprise apps).
 */
export async function clickAndWaitForNetwork(page: Page, locator: Locator): Promise<void> {
  await Promise.all([
    page.waitForLoadState('networkidle'),
    locator.click(),
  ])
}
