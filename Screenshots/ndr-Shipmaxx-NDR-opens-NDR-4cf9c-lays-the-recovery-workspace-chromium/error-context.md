# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ndr.spec.ts >> Shipmaxx NDR >> opens NDR and displays the recovery workspace
- Location: tests\ndr.spec.ts:11:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Showing \d+[-–]\d+ of \d+ records/i).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText(/Showing \d+[-–]\d+ of \d+ records/i).first()

```

```yaml
- complementary:
  - text: "360"
  - navigation:
    - button "Home"
    - button "Orders"
    - button "Returns"
    - button "Products"
    - button "Wallet"
    - button "Channels"
    - button "NDR"
    - button "Weight Reconciliation"
    - button "COD Remittance"
    - button "VAS"
    - button "Pulse"
    - button "Settings"
    - button "Escalations"
- banner:
  - button "ShipMaxx ShipMaxx":
    - img "ShipMaxx"
    - text: ShipMaxx
  - textbox "Search items, AWB, Order No, Phone No,,"
  - button "Search"
  - button "Add an order"
  - button "Track Order"
  - button "Rate Calculator"
  - button "₹133333329590.48"
  - button "Refresh wallet balance"
  - button "0"
  - button "AY"
- button "Explore SellerPro — your business growth tool":
  - img "Grow Your Brand With SellerPro - Live Now!"
- button "Hide banner"
- main:
  - heading "Non-Delivery Recovery (NDR)" [level=1]
  - paragraph: Monitor failed delivery attempts and take quick actions to prevent RTO losses.
  - button "Bulk Upload"
  - button "NDR Reports"
  - button "Manage NDR"
  - button "14 Sep 26 - 14 Oct 26"
  - button "×"
  - textbox "AWB No. Search"
  - combobox:
    - option "Courier Partner" [selected]
    - option "BlueDart"
    - option "Delhivery"
    - option "Ekart"
    - option "XpressBees"
    - option "Shree Maruti"
    - option "Shadowfax"
  - combobox:
    - option "NDR Reason" [selected]
    - option "Address Incomplete/ Incorrect"
    - option "Future Delivery Requested"
    - option "Customer Refused to Accept"
    - option "COD Amount not Ready"
    - option "Customer Not Available"
    - option "Out of Delivery Area"
    - option "Customer Wants Open Delivery"
    - option "OTP Verified- Customer Refused to Accept"
    - option "Residence/ Office Closed"
    - option "Undelivered- Delivery Exception"
    - option "Incorrect Contact Number"
    - option "Self Collection Required"
    - option "Delivery Re-Scheduled"
    - option "Delivery Attempted"
    - option "Undeliverable - Delivery Exception"
    - option "Payment Not Ready"
    - option "OTP Not Available"
    - option "Bad Weather"
  - combobox:
    - option "NDR Attempt" [selected]
    - option "1st Attempt"
    - option "2nd Attempt"
    - option "3rd Attempt"
  - combobox:
    - option "Action Taken By" [selected]
    - option "Seller"
  - button "Clear all"
  - button "Action Required00"
  - button "Action Taken"
  - button "Delivered"
  - button "RTO"
  - button
  - combobox [disabled]:
    - option "Select Bulk Actions" [disabled] [selected]
    - option "Reattempt"
    - option "Initiate RTO"
    - option "Escalate"
  - table:
    - rowgroup:
      - row "Delivery Attempt Details Order Details Customer Details Action Taken By Shipment Details Action":
        - columnheader "Delivery Attempt Details":
          - checkbox
          - text: Delivery Attempt Details
        - columnheader "Order Details"
        - columnheader "Customer Details"
        - columnheader "Action Taken By"
        - columnheader "Shipment Details"
        - columnheader "Action"
    - rowgroup:
      - row "No shipments found":
        - cell "No shipments found"
- region "Notifications alt+T"
```

# Test source

```ts
  1   | import { expect, Locator, Page } from '@playwright/test';
  2   | 
  3   | export type NDRMainTab = 'NDR Reports' | 'Manage NDR';
  4   | export type NDRStatusTab = 'Action Required' | 'Action Taken' | 'Delivered' | 'RTO';
  5   | 
  6   | export class NDRPage {
  7   |   readonly page: Page;
  8   |   readonly ndrNavButton: Locator;
  9   |   readonly heading: Locator;
  10  |   readonly bulkUploadButton: Locator;
  11  |   readonly dateRangeButton: Locator;
  12  |   readonly searchInput: Locator;
  13  |   readonly courierPartnerFilter: Locator;
  14  |   readonly ndrReasonFilter: Locator;
  15  |   readonly ndrAttemptFilter: Locator;
  16  |   readonly actionTakenByFilter: Locator;
  17  |   readonly clearFiltersButton: Locator;
  18  |   readonly recordsTable: Locator;
  19  |   readonly nextPageButton: Locator;
  20  |   readonly previousPageButton: Locator;
  21  | 
  22  |   constructor(page: Page) {
  23  |     this.page = page;
  24  |     this.ndrNavButton = page.getByRole('button', { name: /^NDR$/i }).first();
  25  |     this.heading = page.getByText(/Non-Delivery Recovery|NDR/i).first();
  26  |     this.bulkUploadButton = page.getByRole('button', { name: /Bulk Upload/i }).first();
  27  |     this.dateRangeButton = page.locator('button').filter({ hasText: /\d{1,2} \w{3}.*\d{1,2} \w{3}/i }).first();
  28  |     this.searchInput = page.getByPlaceholder(/AWB No\. Search/i).first();
  29  |     this.courierPartnerFilter = page.getByRole('button', { name: /Courier Partner/i }).first();
  30  |     this.ndrReasonFilter = page.getByRole('button', { name: /NDR Reason/i }).first();
  31  |     this.ndrAttemptFilter = page.getByRole('button', { name: /NDR Attempt/i }).first();
  32  |     this.actionTakenByFilter = page.getByRole('button', { name: /Action Taken By/i }).first();
  33  |     this.clearFiltersButton = page.getByText('Clear all', { exact: true }).first();
  34  |     this.recordsTable = page.locator('main').first();
  35  |     this.nextPageButton = page.getByRole('button', { name: /Next/i }).last();
  36  |     this.previousPageButton = page.getByRole('button', { name: /Prev/i }).last();
  37  |   }
  38  | 
  39  |   async open() {
  40  |     await this.page.goto('/ndr?page=1&limit=20', {
  41  |       waitUntil: 'domcontentloaded',
  42  |       timeout: 60000,
  43  |     });
  44  |     await this.waitForLoad();
  45  |   }
  46  | 
  47  |   async waitForLoad() {
  48  |     await expect(this.page).toHaveURL(/\/ndr/i, { timeout: 30000 });
  49  |     await expect.poll(async () => {
  50  |       const headingVisible = await this.heading.isVisible().catch(() => false);
  51  |       const tableVisible = await this.page.locator('table').first().isVisible().catch(() => false);
  52  |       const manageVisible = await this.page.getByText('Manage NDR', { exact: true }).first().isVisible().catch(() => false);
  53  |       const recordsVisible = await this.page.getByText(/Showing .* of .* records/i).first().isVisible().catch(() => false);
  54  |       return headingVisible || tableVisible || manageVisible || recordsVisible;
  55  |     }, {
  56  |       timeout: 30000,
  57  |       message: 'Expected the NDR workspace to finish loading.',
  58  |     }).toBeTruthy();
  59  |   }
  60  | 
  61  |   async selectMainTab(tab: NDRMainTab) {
  62  |     const tabLocator = this.page.getByText(tab, { exact: true }).first();
  63  |     if (await tabLocator.isVisible().catch(() => false)) {
  64  |       await tabLocator.click();
  65  |       return;
  66  |     }
  67  |   }
  68  | 
  69  |   async selectStatusTab(tab: NDRStatusTab) {
  70  |     const tabLocator = this.page.getByRole('button', { name: new RegExp(`^${tab}(?:\\d+)?$`, 'i') }).first();
  71  |     if (await tabLocator.isVisible().catch(() => false)) {
  72  |       await tabLocator.click();
  73  |       return;
  74  |     }
  75  |   }
  76  | 
  77  |   async searchByAwb(value: string) {
  78  |     await this.searchInput.fill(value);
  79  |   }
  80  | 
  81  |   async clearSearch() {
  82  |     await this.searchInput.fill('');
  83  |   }
  84  | 
  85  |   async clearFilters() {
  86  |     await this.clearFiltersButton.waitFor({ state: 'visible', timeout: 15000 });
  87  |     await this.clearFiltersButton.click();
  88  |   }
  89  | 
  90  |   async expectStatusTabsVisible() {
  91  |     for (const tab of ['Action Required', 'Action Taken', 'Delivered', 'RTO'] as NDRStatusTab[]) {
  92  |       const buttonVisible = await this.page.getByRole('button', { name: new RegExp(`^${tab}(?:\\d+)?$`, 'i') }).first().isVisible().catch(() => false);
  93  |       const textVisible = await this.page.getByText(new RegExp(tab, 'i')).first().isVisible().catch(() => false);
  94  |       if (buttonVisible || textVisible) {
  95  |         continue;
  96  |       }
  97  |     }
  98  |   }
  99  | 
  100 |   async expectPaginationVisible() {
> 101 |     await expect(this.page.getByText(/Showing \d+[-–]\d+ of \d+ records/i).first()).toBeVisible({ timeout: 15000 });
      |                                                                                     ^ Error: expect(locator).toBeVisible() failed
  102 |   }
  103 | }
  104 | 
```