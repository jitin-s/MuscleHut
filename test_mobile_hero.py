from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    file_url = 'file:///' + os.path.abspath('index.html').replace('\\', '/')
    page.goto(file_url, wait_until='domcontentloaded')
    page.wait_for_timeout(1000)

    # Scroll down slightly to see full hero CTA group
    page.screenshot(path='mobile_screenshots/02_mobile_hero_full.png', full_page=False)
    
    # Scroll by 300px
    page.mouse.wheel(0, 300)
    page.wait_for_timeout(300)
    page.screenshot(path='mobile_screenshots/03_mobile_hero_scrolled.png')

    browser.close()
