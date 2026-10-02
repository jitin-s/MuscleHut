import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})

        console_errors = []
        page.on("console", lambda msg: console_errors.append(f"{msg.type}: {msg.text}") if msg.type in ["error", "warning"] else None)
        page.on("pageerror", lambda err: console_errors.append(f"Page Error: {err}"))

        file_url = f"file:///{os.path.abspath('index.html').replace(os.sep, '/')}"
        print(f"Loading {file_url}...")
        await page.goto(file_url, wait_until="load")
        await page.wait_for_timeout(1000)

        title = await page.title()
        print("Page Title:", title)

        os.makedirs("test_screenshots", exist_ok=True)

        # 1. Hero Screenshot
        await page.screenshot(path="test_screenshots/01_hero.png")
        print("Saved 01_hero.png")

        # 2. Scroll to About & Stats
        await page.locator('#stats').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/02_stats_about.png")
        print("Saved 02_stats_about.png")

        # 3. Programs
        await page.locator('#programs').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/03_programs.png")
        print("Saved 03_programs.png")

        # 4. Schedule & BMI
        await page.locator('#schedule').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/04_schedule.png")
        print("Saved 04_schedule.png")

        # Test Schedule tab switch to Tuesday
        tue_btn = page.locator('button.schedule-tab-btn[data-day="tue"]')
        await tue_btn.click()
        await page.wait_for_timeout(300)

        # Test BMI calculation
        await page.locator('#bmi').scroll_into_view_if_needed()
        await page.locator('#bmiHeight').fill('180')
        await page.locator('#bmiWeight').fill('80')
        await page.locator('button:has-text("CALCULATE BMI")').click()
        await page.wait_for_timeout(300)
        await page.screenshot(path="test_screenshots/05_bmi_calc.png")
        print("Saved 05_bmi_calc.png")

        # Test 1RM tab
        await page.locator('#tabOnermToggle').click()
        await page.wait_for_timeout(300)
        await page.screenshot(path="test_screenshots/06_1rm_calc.png")
        print("Saved 06_1rm_calc.png")

        # 5. Pricing
        await page.locator('#pricing').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/07_pricing_monthly.png")
        # Toggle yearly
        await page.locator('#labelYearly').click()
        await page.wait_for_timeout(300)
        await page.screenshot(path="test_screenshots/08_pricing_yearly.png")
        print("Saved 08_pricing_yearly.png")

        # 6. Gallery & Before/After
        await page.locator('#gallery').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/09_gallery.png")
        print("Saved 09_gallery.png")

        # Test Lightbox on first photo
        first_photo = page.locator('.gallery-item').first
        await first_photo.click()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/10_lightbox.png")
        print("Saved 10_lightbox.png")
        # Close lightbox
        await page.locator('.lightbox-close-btn').click()
        await page.wait_for_timeout(300)

        # 7. Reviews & Contact
        await page.locator('#contact').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.screenshot(path="test_screenshots/11_contact.png")
        print("Saved 11_contact.png")

        # Check console errors
        print(f"\nTotal Console Warnings/Errors: {len(console_errors)}")
        for err in console_errors:
            print("CONSOLE:", err)

        await browser.close()
        print("\nAll browser verification tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
