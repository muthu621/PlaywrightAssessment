import { Page, expect } from "@playwright/test";

export class Perfumepage {
  constructor(private page: Page) {}


  async getFilteredProductsByBrand(expectedBrand: string) {
    const mismatchedProducts: { brand: string }[] = [];
    const products = await this.page.$$(`//div[text()='${expectedBrand}']`);

    // Extract details of each product and validate brand
    for (const product of products) {
        const brand = await product.$eval('brand-selector', (el) => el.textContent?.trim() ?? '');

        if (brand !== expectedBrand) {
            mismatchedProducts.push({ brand });
        }
    }

    // Validate that there are no mismatches
    if (mismatchedProducts.length === 0) {
        console.log(`All products match the brand filter: ${expectedBrand}`);
    } else {
        console.error(`Some products do not match the brand filter: ${expectedBrand}`);
        console.table(mismatchedProducts);
    }
  }

  async getFilteredProductsByClassification(expectedClassification: string) {
    await this.page.waitForLoadState('load');
    const mismatchedProducts: { classification: string }[] = [];
    const products = await this.page.$$(`//div[text()='${expectedClassification}']`);

    // Extract details of each product and validate brand
    for (const product of products) {
        const classification = await product.$eval('classification-selector', (el) => el.textContent?.trim() ?? '');

        if (classification !== expectedClassification) {
            mismatchedProducts.push({ classification });
        }
    }

    // Validate that there are no mismatches
    if (mismatchedProducts.length === 0) {
        console.log(`All products match the classification filter: ${expectedClassification}`);
    } else {
        console.error(`Some products do not match the classification filter: ${expectedClassification}`);
        console.table(mismatchedProducts);
    }
  }

  async selectCriteria(criteria: string) {
    await this.page.getByTestId('flags').click();
    await this.page.waitForLoadState();
    await this.page.getByRole('checkbox', { name: `${criteria}` }).click();
  }

  async selectBrand(brand: string) {
    await this.page.waitForTimeout(2000);
    await this.page.getByTestId('brand').click();
    await this.page.getByPlaceholder('Marke suchen').click();
    await this.page.getByPlaceholder('Marke suchen').fill(brand);
    await this.page.getByRole('checkbox', { name: `${brand}` }).click();
    await this.page.waitForLoadState('load');
  }

  async selectGender(gender: string) {
    await this.page.waitForTimeout(2000);
    await this.page.getByTestId('gender').click();
    await this.page.getByRole('checkbox', { name: `${gender}` }).check();
  }

  async selectclassification(classification: string) {
    await this.page.getByTestId('classificationClassName').click();
    await this.page.getByRole('checkbox', { name: `${classification}` }).click();
  }

  async selectOccasion(occasion: string) {
    await this.page.waitForTimeout(2000);
    await this.page.getByTestId('Geschenk für').click();
    await this.page.waitForLoadState('load');
    await this.page.getByRole('checkbox', { name: `${occasion}` }).click();
  }
  
  async verifyProductDisplay(expectedProductText: string) {
    await this.page.waitForLoadState('load');
    const productDetail = await this.page.getByTestId('details-link');
    await expect(productDetail).toContainText(expectedProductText);
  }
}