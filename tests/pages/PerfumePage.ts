import { Page, expect } from "@playwright/test";
import { timeout } from "../../playwright.config";

export class Perfumepage {
  constructor(private page: Page) {}


  async getFilteredProductsByBrand(expectedBrand: string) {
    const mismatchedProducts: { brand: string }[] = [];
    
    // Use XPath with contains to allow partial matching of brand text
    const brandProducts = await this.page.$$(`//div[contains(text(),'${expectedBrand}')]`);

    // Extract details of each product and validate brand
    for (const brandProduct of brandProducts) {
        try {
            const brand = await brandProduct.$eval('brand-selector', (el) => el.textContent?.trim() ?? '');

            if (brand !== expectedBrand) {
                mismatchedProducts.push({ brand });
            }
        } catch (error) {
            console.error(`Error retrieving brand for a product:`, error);
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

async getFilteredProductsByClassification(expectedClassification) {
  const mismatchedProducts: { classification: string }[] = [];

  // Find products with classification containing the expected text
  const products = await this.page.locator(`//div[contains(@class, 'product-classification')]`).elementHandles();

  // Loop over each product and verify classification
  for (const product of products) {
      try {
          // Get the text content of the classification element within each product
          const classification = await product.evaluate(el => el.textContent?.trim() || '');

          if (classification !== expectedClassification) {
              mismatchedProducts.push({ classification });
          }
      } catch (error) {
          console.error(`Error retrieving classification for a product:`, error);
      }
  }

  // Output mismatched products if any are found
  if (mismatchedProducts.length === 0) {
      console.log(`All products match the classification filter: ${expectedClassification}`);
  } else {
      console.error(`Some products do not match the classification filter: ${expectedClassification}`);
      console.table(mismatchedProducts);
  }
}

  async selectCriteria(criteria: string) {
    await this.page.waitForLoadState('load');
    await this.page.getByTestId('flags').click();
    await this.page.getByRole('checkbox', { name: `${criteria}` }).click();
  }

  async selectBrand(brand: string) {
    await this.page.getByTestId('brand').click();
    await this.page.getByPlaceholder('Marke suchen').click();
    await this.page.getByPlaceholder('Marke suchen').fill(brand);
    await this.page.getByRole('checkbox', { name: `${brand}` }).click();
  }

  async selectGender(gender: string) {
    await this.page.getByTestId('gender').click();
    await this.page.getByRole('checkbox', { name: `${gender}` }).click();
    
  }

  async selectclassification(classification: string) {
    await this.page.getByTestId('classificationClassName').click();
    await this.page.getByRole('checkbox', { name: `${classification}` }).click();
  }

  async selectOccasion(occasion: string) {
    await this.page.getByTestId('Geschenk für').click();
    await this.page.getByPlaceholder('Geschenk für suchen').fill(occasion);
    await this.page.getByRole('checkbox', { name: `${occasion}` }).click();
  }
  
  async verifyProductDisplay(expectedProductText: string) {
    const productDetail = await this.page.getByTestId('details-link');
    await expect(productDetail).toContainText(expectedProductText);
  }
}