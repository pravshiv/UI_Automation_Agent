/**
 * ModalHelper — universal dialog / modal interaction utilities.
 * Works with: browser dialogs, ARIA dialogs, Angular Material, Ant Design,
 * PrimeNG, jQuery UI, Bootstrap modals, and any [role="dialog"].
 */
import { Page, Locator, expect } from '@playwright/test'

export class ModalHelper {
  constructor(private page: Page) {}

  private modalSelectors = [
    '[role="dialog"]',
    '[role="alertdialog"]',
    '[aria-modal="true"]',
    '.mat-dialog-container',
    '.ant-modal-content',
    '.p-dialog-content',
    '.ui-dialog-content',
    '.k-dialog',
    '.modal-dialog',
  ].join(', ')

  /** Wait for any modal to appear */
  async waitForModal(customSelector?: string, timeout = 15_000): Promise<Locator> {
    const sel = customSelector ?? this.modalSelectors
    const modal = this.page.locator(sel).first()
    await modal.waitFor({ state: 'visible', timeout })
    return modal
  }

  /** Click a button inside a modal by text */
  async clickButton(buttonText: string, modalSelector?: string): Promise<void> {
    const container = modalSelector
      ? this.page.locator(modalSelector)
      : this.page.locator(this.modalSelectors).first()
    await container.getByRole('button', { name: buttonText }).click()
  }

  /** Dismiss / close any open modal */
  async dismiss(): Promise<void> {
    // Try Escape key first
    await this.page.keyboard.press('Escape')
    // If still visible, try close buttons
    for (const sel of ['[aria-label="Close"]', '[aria-label="close"]', '.close', '.btn-close', 'button:has-text("Cancel")', 'button:has-text("Close")']) {
      const btn = this.page.locator(sel).first()
      if (await btn.isVisible()) { await btn.click(); return }
    }
  }

  /** Assert a modal is visible */
  async assertVisible(customSelector?: string): Promise<void> {
    const sel = customSelector ?? this.modalSelectors
    await expect(this.page.locator(sel).first()).toBeVisible()
  }

  /** Assert a modal is not visible */
  async assertHidden(customSelector?: string): Promise<void> {
    const sel = customSelector ?? this.modalSelectors
    await expect(this.page.locator(sel).first()).not.toBeVisible()
  }

  /** Handle a native browser dialog (alert / confirm / prompt) */
  setupDialogHandler(action: 'accept' | 'dismiss' = 'accept', promptText?: string): void {
    this.page.on('dialog', async dialog => {
      if (action === 'accept') await dialog.accept(promptText)
      else await dialog.dismiss()
    })
  }
}
