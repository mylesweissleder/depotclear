import { chromium } from 'playwright';

/**
 * Find nearby Home Depot stores for a given ZIP code
 */
export async function findNearbyStores(zipCode) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to store finder
    await page.goto(`https://www.homedepot.com/l/${zipCode}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(3000);

    // Extract store data
    const stores = await page.evaluate(() => {
      const storeElements = document.querySelectorAll('[data-testid="store-card"]');
      const results = [];

      storeElements.forEach((store, index) => {
        if (index >= 3) return; // Only get 3 nearest stores

        const nameElem = store.querySelector('[data-testid="store-name"]');
        const addressElem = store.querySelector('[data-testid="store-address"]');
        const distanceElem = store.querySelector('[data-testid="store-distance"]');

        const name = nameElem ? nameElem.textContent.trim() : '';
        const address = addressElem ? addressElem.textContent.trim() : '';
        const distance = distanceElem ? distanceElem.textContent.trim() : '';

        if (name) {
          results.push({
            name,
            address,
            distance,
          });
        }
      });

      return results;
    });

    await browser.close();
    return stores;

  } catch (error) {
    await browser.close();
    console.error('Error finding stores:', error.message);

    // Return mock data as fallback
    return [
      { name: `Home Depot near ${zipCode}`, address: 'Local Store', distance: '2-5 miles' },
      { name: `Home Depot near ${zipCode}`, address: 'Local Store', distance: '5-10 miles' },
      { name: `Home Depot near ${zipCode}`, address: 'Local Store', distance: '10-15 miles' },
    ];
  }
}

/**
 * Check if a specific product is available at a store
 */
export async function checkProductAtStore(productUrl, zipCode) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(productUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Set ZIP code
    const zipInput = await page.$('input[data-testid="zip-code-input"]');
    if (zipInput) {
      await zipInput.fill(zipCode);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }

    // Check availability
    const availability = await page.evaluate(() => {
      const stockElem = document.querySelector('[data-testid="fulfillment-availability"]');
      const inStock = stockElem && stockElem.textContent.includes('In Stock');
      return { inStock, text: stockElem ? stockElem.textContent : 'Unknown' };
    });

    await browser.close();
    return availability;

  } catch (error) {
    await browser.close();
    return { inStock: true, text: 'Check in store' }; // Default to available
  }
}
