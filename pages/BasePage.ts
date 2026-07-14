/**
 * BasePage — base class for all Page Object Model classes.
 * Provides common navigation, wait, and assertion utilities.
 */
import { Page, Locator, expect } from '@playwright/test'
import { IframeHelper }    from '../utils/iframeHelper'
import { ShadowDOMHelper } from '../utils/shadowDOMHelper'
import { GridHelper }      from '../utils/gridHelper'
import { ModalHelper }     from '../utils/modalHelper'
import { withRetry, clickAndWaitForNetwork } from '../utils/retryHelper'
import { config } from '../utils/envConfig'

export abstract class BasePage {
  protected readonly iframe:     IframeHelper
  protected readonly shadowDOM:  ShadowDOMHelper
  protected readonly modal:      ModalHelper
  protected readonly grid:       GridHelper

  constructor(protected readonly page: Page) {
    this.iframe    = new IframeHelper(page)
    this.shadowDOM = new ShadowDOMHelper(page)
    this.modal     = new ModalHelper(page)
    this.grid      = new GridHelper(page)
  }

  /** Navigate to a path relative to BASE_URL */
  async goto(path: string = ''): Promise<void> {
    await this.page.goto(config.baseUrl + path)
    await this.page.waitForLoadState('networkidle')
  }

  /** Wait for the page to be fully loaded */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  /** Take a screenshot with a descriptive name */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true })
  }

  /** Retry an action (wrapper around retryHelper) */
  protected async retry<T>(action: () => Promise<T>, label?: string): Promise<T> {
    return withRetry(action, { label })
  }

  /** Click a locator and wait for network idle */
  protected async clickAndWait(locator: Locator): Promise<void> {
    await clickAndWaitForNetwork(this.page, locator)
  }

  /** Assert page title */
  async assertTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title)
  }

  /** Assert current URL */
  async assertUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url)
  }
}
