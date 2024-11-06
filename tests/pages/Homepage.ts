import { Page } from "@playwright/test";

export class Homepage {
  constructor(private page: Page) {}

  async launchApplication() {
    await this.page.goto("https://www.douglas.de/de", {waitUntil: 'load'});
  }

  async acceptCookies() {
      await this.page.getByTestId('uc-accept-all-button').click();
  }

  async navigateToProducts() {
    await this.page.getByTestId('header-component-item--navigation').getByRole('link', { name: 'PARFUM' }).click();
    await this.page.getByRole('link', { name: 'PARFUM', exact: true }).click();
    await this.page.locator(`//span[@data-testid='header-component-item--search']`).hover();
  }
}