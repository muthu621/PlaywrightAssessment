import { Page, expect } from "@playwright/test";

export class Perfumepage {
  constructor(private page: Page) {}


  async getFilteredProductsByBrand(expectedBrand: string) {
    const mismatchedProducts: { brand: string }[] = [];
    
    // Locate products by flexible locator instead of XPath
    const products = await this.page.locator('.product-card').elementHandles();

    for (const product of products) {
        try {
            // Fetch the brand text from within each product element
            const brand = await product.$eval('.brand-selector', (el) => el.textContent?.trim() ?? '');

            if (!brand.includes(expectedBrand)) {  // Allow partial matching
                mismatchedProducts.push({ brand });
            }
        } catch (error) {
            console.error(`Error retrieving brand for a product:`, error);
        }
    }

    if (mismatchedProducts.length === 0) {
        console.log(`All products match the brand filter: ${expectedBrand}`);
    } else {
        console.error(`Some products do not match the brand filter: ${expectedBrand}`);
        console.table(mismatchedProducts);
    }
}

async getFilteredProductsByClassification(expectedClassification: string) {
    const mismatchedProducts: { classification: string }[] = [];

    // Locate products by a more flexible class-based locator
    const products = await this.page.locator('.product-card').elementHandles();

    for (const product of products) {
        try {
            // Get the text content of the classification within each product element
            const classification = await product.$eval('.classification-selector', el => el.textContent?.trim() ?? '');

            if (!classification.includes(expectedClassification)) {  // Allow partial matching
                mismatchedProducts.push({ classification });
            }
        } catch (error) {
            console.error(`Error retrieving classification for a product:`, error);
        }
    }

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
    await this.page.getByTestId('brand').click();
    await this.page.getByPlaceholder('Marke suchen').click();
    await this.page.getByPlaceholder('Marke suchen').fill(brand);
    await this.page.getByRole('checkbox', { name: `${brand}` }).click();
    await this.page.waitForLoadState('load');
  }

  async selectGender(gender: string) {
    await this.page.getByTestId('gender').click();
    await this.page.getByRole('checkbox', { name: `${gender}` }).click();
  }

  async selectclassification(classification: string) {
    await this.page.waitForLoadState('load');
    await this.page.getByTestId('classificationClassName').click();
    await this.page.getByRole('checkbox', { name: `${classification}` }).click();
  }

  async selectOccasion(occasion: string) {
    await this.page.waitForLoadState('load');
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