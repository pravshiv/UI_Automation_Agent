/**
 * GridHelper — universal enterprise grid / table interaction utilities.
 * Supports ag-Grid, Kendo Grid, PrimeNG DataTable, generic HTML tables,
 * and any ARIA grid/treegrid.
 */
import { Page, Locator, expect } from '@playwright/test'

export class GridHelper {
  constructor(
    private page:     Page,
    /** Root selector of the grid — e.g. '.ag-root-wrapper', '[role="grid"]', 'table' */
    private gridRoot: string = '[role="grid"], .ag-root-wrapper, table',
  ) {}

  private get root(): Locator {
    return this.page.locator(this.gridRoot).first()
  }

  /** Wait for the grid to finish loading */
  async waitForGridLoad(timeout = 30_000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout })
    // ag-Grid loading overlay
    const overlay = this.page.locator('.ag-overlay-loading-center')
    if (await overlay.isVisible()) {
      await overlay.waitFor({ state: 'hidden', timeout })
    }
  }

  /** Get all rows */
  rows(): Locator {
    return this.root.locator('[role="row"]:not([role="columnheader"]), tbody tr')
  }

  /** Get a specific row by 0-based index */
  row(index: number): Locator {
    return this.rows().nth(index)
  }

  /** Get a cell value by row index and column header text */
  async getCellValue(rowIndex: number, columnHeader: string): Promise<string> {
    const headers = this.root.locator('[role="columnheader"], thead th')
    const allHeaders = await headers.allTextContents()
    const colIndex = allHeaders.findIndex(h => h.trim() === columnHeader)
    if (colIndex < 0) throw new Error(`Column "${columnHeader}" not found`)

    const cell = this.row(rowIndex).locator('[role="gridcell"], td').nth(colIndex)
    return (await cell.textContent())?.trim() ?? ''
  }

  /** Click a cell by row index and column header text */
  async clickCell(rowIndex: number, columnHeader: string): Promise<void> {
    const headers = this.root.locator('[role="columnheader"], thead th')
    const allHeaders = await headers.allTextContents()
    const colIndex = allHeaders.findIndex(h => h.trim() === columnHeader)
    if (colIndex < 0) throw new Error(`Column "${columnHeader}" not found`)
    await this.row(rowIndex).locator('[role="gridcell"], td').nth(colIndex).click()
  }

  /** Sort a column by clicking its header */
  async sortBy(columnHeader: string): Promise<void> {
    await this.root.locator('[role="columnheader"], thead th')
      .filter({ hasText: columnHeader })
      .click()
    await this.page.waitForLoadState('networkidle')
  }

  /** Count total rows */
  async rowCount(): Promise<number> {
    return this.rows().count()
  }

  /** Assert a cell value */
  async assertCellValue(rowIndex: number, columnHeader: string, expected: string): Promise<void> {
    const val = await this.getCellValue(rowIndex, columnHeader)
    expect(val).toBe(expected)
  }
}
