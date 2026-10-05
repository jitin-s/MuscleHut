from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    # iPhone / Android mobile viewport: 390 x 844
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    file_url = 'file:///' + os.path.abspath('index.html').replace('\\', '/')
    page.goto(file_url, wait_until='domcontentloaded')
    page.wait_for_timeout(1000)

    os.makedirs('mobile_screenshots', exist_ok=True)
    page.screenshot(path='mobile_screenshots/01_mobile_top.png')
    
    # Check all elements with text JOIN
    join_elements = page.query_selector_all('*:has-text("JOIN")')
    for el in join_elements:
        try:
            txt = el.inner_text().strip()
            if 'JOIN' in txt and len(txt) < 40:
                box = el.bounding_box()
                tag = el.evaluate('e => e.tagName + "." + e.className')
                visible = el.is_visible()
                print(f"JOIN EL: {tag} | text={repr(txt)} | box={box} | visible={visible}")
        except Exception as e:
            pass

    browser.close()
