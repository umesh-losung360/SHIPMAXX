# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orders.spec.ts >> Shipmaxx orders >> creates an order with customer, product, and package details
- Location: tests\orders.spec.ts:18:6

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeHidden() failed

Locator:  getByRole('heading', { name: /^Create Order$/i }).first()
Expected: hidden
Received: visible

Call log:
  - Expect "toBeHidden" with timeout 30000ms
  - waiting for getByRole('heading', { name: /^Create Order$/i }).first()
    49 × locator resolved to <h1 class="text-2xl font-semibold text-gray-900">Create Order</h1>
       - unexpected value "visible"
  - Test timeout of 30000ms exceeded.

```

```yaml
- heading "Create Order" [level=1]
```

# Test source

```ts
  17  | 	breadth: string;
  18  | 	height: string;
  19  | 	orderNumber: string;
  20  | 	paymentMethod?: 'COD' | 'Prepaid';
  21  | }
  22  | 
  23  | export class OrdersPage {
  24  | 	readonly page: Page;
  25  | 	readonly ordersLink: Locator;
  26  | 	readonly addOrderButton: Locator;
  27  | 	readonly ordersHeading: Locator;
  28  | 	readonly searchInput: Locator;
  29  | 	readonly statusFilter: Locator;
  30  | 	readonly createOrderHeading: Locator;
  31  | 	readonly mobileInputs: Locator;
  32  | 	readonly fullNameInputs: Locator;
  33  | 	readonly addressInputs: Locator;
  34  | 	readonly pincodeInputs: Locator;
  35  | 	readonly emailInputs: Locator;
  36  | 	readonly billingSameAsDeliveryCheckbox: Locator;
  37  | 	readonly paymentMethod: Locator;
  38  | 	readonly skuInput: Locator;
  39  | 	readonly productNameInput: Locator;
  40  | 	readonly productSpinbuttons: Locator;
  41  | 	readonly unitPriceInput: Locator;
  42  | 	readonly quantityInput: Locator;
  43  | 	readonly discountInput: Locator;
  44  | 	readonly taxRateInput: Locator;
  45  | 	readonly packageWeightInput: Locator;
  46  | 	readonly packageDimensionInputs: Locator;
  47  | 	readonly orderNumberInput: Locator;
  48  | 	readonly createOrderButton: Locator;
  49  | 
  50  | 	constructor(page: Page) {
  51  | 		this.page = page;
  52  | 		this.ordersLink = page.getByRole('button', { name: /^Orders$/i }).first();
  53  | 		this.addOrderButton = page.getByRole('button', { name: /Add an order/i }).first();
  54  | 		this.ordersHeading = page.getByRole('heading', { name: /orders/i }).first();
  55  | 		this.searchInput = page.locator('input[placeholder*="AWB" i], input[placeholder*="search" i]').first();
  56  | 		this.statusFilter = page.getByRole('button', { name: /all status/i }).first();
  57  | 		this.createOrderHeading = page.getByRole('heading', { name: /^Create Order$/i }).first();
  58  | 		this.mobileInputs = page.getByRole('textbox', { name: 'Mobile number' });
  59  | 		this.fullNameInputs = page.getByRole('textbox', { name: 'Full Name' });
  60  | 		this.addressInputs = page.getByRole('textbox', { name: 'Complete Address' });
  61  | 		this.pincodeInputs = page.getByRole('textbox', { name: 'Pincode' });
  62  | 		this.emailInputs = page.getByRole('textbox', { name: 'Email address' });
  63  | 		this.billingSameAsDeliveryCheckbox = page.getByRole('checkbox', { name: /Billing address same as delivery/i });
  64  | 		this.paymentMethod = page.getByText(/^Prepaid$/i).first();
  65  | 		this.skuInput = page.getByRole('textbox', { name: 'SKU' }).first();
  66  | 		this.productNameInput = page.getByRole('textbox', { name: 'Product Name' }).first();
  67  | 		this.productSpinbuttons = page.locator('input[name*="unitPrice" i], input[name*="quantity" i], input[name*="discount" i], input[name*="taxRate" i]');
  68  | 		this.unitPriceInput = page.locator('input[name*="unitPrice" i]').first();
  69  | 		this.quantityInput = page.locator('input[name*="quantity" i]').first();
  70  | 		this.discountInput = page.locator('input[name*="discount" i]').first();
  71  | 		this.taxRateInput = page.locator('input[name*="taxRate" i]').first();
  72  | 		this.packageWeightInput = page.getByRole('textbox', { name: 'Kg' }).first();
  73  | 		this.packageDimensionInputs = page.getByRole('textbox', { name: 'Cm' });
  74  | 		this.orderNumberInput = page.getByRole('textbox', { name: 'Order Number' });
  75  | 		this.createOrderButton = page.getByRole('button', { name: /^Create Order$/i });
  76  | 	}
  77  | 
  78  | 	async open() {
  79  | 		await this.ordersLink.waitFor({ state: 'visible', timeout: 15000 });
  80  | 		await this.ordersLink.click();
  81  | 		await this.waitForLoad();
  82  | 	}
  83  | 
  84  | 	async openCreateOrder() {
  85  | 		await this.addOrderButton.waitFor({ state: 'visible', timeout: 15000 });
  86  | 		await this.addOrderButton.click();
  87  | 		await expect(this.createOrderHeading).toBeVisible({ timeout: 30000 });
  88  | 	}
  89  | 
  90  | 	async createOrder(details: OrderDetails) {
  91  | 		await this.openCreateOrder();
  92  | 
  93  | 		await this.mobileInputs.first().fill(details.customerMobile);
  94  | 		await this.fullNameInputs.first().fill(details.customerName);
  95  | 		await this.addressInputs.first().fill(details.address);
  96  | 		await this.pincodeInputs.first().fill(details.pincode);
  97  | 		if (details.email) {
  98  | 			await this.emailInputs.first().fill(details.email);
  99  | 		}
  100 | 		await this.selectPaymentMethod(details.paymentMethod ?? 'COD');
  101 | 		await this.billingSameAsDeliveryCheckbox.check();
  102 | 
  103 | 		await this.skuInput.fill(details.sku);
  104 | 		await this.productNameInput.fill(details.productName);
  105 | 		await this.unitPriceInput.fill(details.unitPrice);
  106 | 		await this.quantityInput.fill(details.quantity);
  107 | 		await this.discountInput.fill(details.discount ?? '0');
  108 | 		await this.taxRateInput.fill(details.taxRate ?? '0');
  109 | 
  110 | 		await this.packageWeightInput.fill(details.deadWeight);
  111 | 		await this.packageDimensionInputs.nth(0).fill(details.length);
  112 | 		await this.packageDimensionInputs.nth(1).fill(details.breadth);
  113 | 		await this.packageDimensionInputs.nth(2).fill(details.height);
  114 | 		await this.orderNumberInput.fill(details.orderNumber);
  115 | 
  116 | 		await this.createOrderButton.click();
> 117 | 		await expect(this.createOrderHeading).toBeHidden({ timeout: 30000 });
      |                                         ^ Error: expect(locator).toBeHidden() failed
  118 | 	}
  119 | 
  120 | 	async selectPaymentMethod(paymentMethod: 'COD' | 'Prepaid') {
  121 | 		const paymentOption = this.page.locator('p').filter({ hasText: new RegExp(`^${paymentMethod}$`, 'i') }).last();
  122 | 
  123 | 		await paymentOption.waitFor({ state: 'visible', timeout: 15000 });
  124 | 		await paymentOption.click({ force: true });
  125 | 		await expect(this.page.getByText('Please select a payment method', { exact: true })).toBeHidden({ timeout: 5000 });
  126 | 	}
  127 | 
  128 | 	async createShipment() {
  129 | 		const shipButton = this.page.getByRole('button', { name: /^Ship$/i }).first();
  130 | 
  131 | 		await shipButton.waitFor({ state: 'visible', timeout: 15000 });
  132 | 		await shipButton.click();
  133 | 	}
  134 | 
  135 | 	async waitForLoad() {
  136 | 		await expect(this.ordersHeading).toBeVisible({ timeout: 30000 });
  137 | 	}
  138 | 
  139 | 	async searchByAwb(awb: string) {
  140 | 		await this.searchInput.fill(awb);
  141 | 	}
  142 | }
  143 | 
```