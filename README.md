# Gayathri's Birthday Book

A flip-book website. Everything you edit is in **config.js**.

## Folder layout
```
index.html  style.css  script.js  config.js
assets/
  fonts/    (bundled fonts, leave as they are)
  photos/   cover.jpg (her photo for the cover), 01.jpg ... 10.jpg, video-cover.jpg
  videos/   memories.mp4
  music/    romantic.mp3
```
Until you add your own files, pages show "your photo goes here" placeholders.

## Editing
1. Open `config.js`, replace every `[placeholder]` text with your own words.
2. The lock question, hint and answer are in `lock` (currently "First movie watched in theatre?" / "Vaazha 2"). Capitals, spaces and small spelling variations are accepted.
3. Copy your photos into `assets/photos/` and match the file names in `config.js`.
4. Optional: give any page its own song with `music: "assets/music/page3.mp3"`.

## Tips for files
- Photos: resize to about 1200 px on the long side, 200-400 KB each (JPG).
- Video: MP4 (H.264), under 30 seconds, ideally under 15 MB.
- Music: an MP3 you have the right to use. Browsers only start music after her first tap, which the lock screen gives us.

## Preview on your computer
```
cd gayathri-book
python3 -m http.server 8000
```
Open http://localhost:8000

## Put it online with GitHub Pages
1. Create a new GitHub repository (for example `gayathri-25`).
2. Upload all the files and the `assets` folder to it.
3. Repository Settings > Pages > Source: "Deploy from a branch" > branch `main`, folder `/ (root)` > Save.
4. After about a minute your link appears: `https://<your-username>.github.io/gayathri-25/`

The page is public to anyone who has the link, and the date lock is only a light lock.
