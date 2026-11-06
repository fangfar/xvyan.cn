"""Update the public GitHub stars snapshot without changing it on failure."""
import json
import os
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from build import validate_stars

TARGET = Path(__file__).resolve().parent / "content/stars.json"


def sync(target=TARGET):
    headers = {"User-Agent": "xvyan-site", "Accept": "application/vnd.github+json"}
    if os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    repositories = []
    page = 1
    while True:
        request = Request(f"https://api.github.com/users/fangfar/starred?per_page=100&page={page}", headers=headers)
        with urlopen(request, timeout=30) as response:
            batch = json.load(response)
        if not isinstance(batch, list):
            raise ValueError("GitHub returned an invalid stars list")
        repositories.extend({"name": repo["full_name"], "description": repo["description"] or ""} for repo in batch)
        if len(batch) < 100:
            break
        page += 1
    data = {"updated": datetime.now(timezone(timedelta(hours=8))).date().isoformat(), "repositories": repositories}
    validate_stars(data)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=target.parent, delete=False) as temp:
        name = temp.name
        try:
            json.dump(data, temp, ensure_ascii=False, indent=2)
            temp.write("\n")
        except BaseException:
            temp.close()
            Path(name).unlink(missing_ok=True)
            raise
    try:
        Path(name).replace(target)
    finally:
        Path(name).unlink(missing_ok=True)
    print(f"Synced {len(repositories)} GitHub stars")


if __name__ == "__main__":
    sync()
