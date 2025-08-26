import {test, expect} from '@playwright/test' ;

test('test', async ({page}) => { 
await page.goto('https://sc.npru.ac.th/sc_major/')


//expect to takescreenshot
await expect(page).toHaveScreenshot('homepage.png')

});