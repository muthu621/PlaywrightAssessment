import { test, expect, Page } from "@playwright/test";
import { Homepage } from "../pages/Homepage";
import { Perfumepage } from "../pages/PerfumePage";
import { filterData } from "../utils/data";

filterData.forEach((data) => {
  test(`Perfume filter test - Criteria: ${data.criteria}, Brand: ${data.marke}`, async ({ page }) => {
    const homePage = new Homepage(page);
    const perfumePage = new Perfumepage(page);

    // Step 1: Navigate to https://www.douglas.de/de
    await homePage.launchApplication();

    // Step 2: Handle the cookie consent
    //await homePage.acceptCookies();

    // Step 3: Click on "Parfum"
    await homePage.navigateToProducts();

    // Step 4: Apply filters based on data
    await perfumePage.selectCriteria(data.criteria);
    await perfumePage.selectBrand(data.marke);
    
    // vaidate brand details
    await perfumePage.getFilteredProductsByBrand(data.marke);

    // filter by classification
    await perfumePage.selectclassification(data.produktart);

    // vaidate classification details
    await perfumePage.getFilteredProductsByClassification(data.produktart);

    // Apply filters based on data
    await perfumePage.selectOccasion(data.geschenkFur);
    await perfumePage.selectGender(data.furWen);

    // validate all matched products
    await perfumePage.verifyProductDisplay(data.product);

  });
});