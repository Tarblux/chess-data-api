from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import re
import time
import os

def get_chesscom_stats(username, modes):
    stats = {}

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    chrome_bin = os.getenv("CHROME_BIN", "/usr/bin/google-chrome")
    options.binary_location = chrome_bin

    service = Service()
    driver = webdriver.Chrome(service=service, options=options)

    for mode in modes:
        url = f"https://www.chess.com/member/{username}/stats/{mode}"
        driver.get(url)
        time.sleep(3) # Fi make sure e load

        soup = BeautifulSoup(driver.page_source, "html.parser")
        percentile = None
        rank = None

        for block in soup.find_all("div", class_="icon-block-small-content"):
            text = block.get_text(strip=True)

            if not percentile:
                match = re.search(r"\d{1,3}(\.\d+)?%", text)
                if match:
                    percentile = match.group()

            if not rank:
                match = re.search(r"#\d{5,}", text)
                if match:
                    rank = match.group()

        stats[mode] = {
            "percentile": percentile or "Not found",
            "rank": rank or "Not found"
        }

    driver.quit()
    return stats

username = "blunderrasta"
modes = ["bullet", "blitz", "rapid"]

results = get_chesscom_stats(username, modes)

for mode, data in results.items():
    print(f"Mode: {mode}")
    print("  Percentile:", data["percentile"])
    print("  Rank:", data["rank"])