# Apramey — portfolio

Plain static site (HTML + CSS + JS). No build step, no framework, no npm install.

## 1. Fill in your details
Open `assets/js/config.js` and fill in USN, roll number, batch, email, LinkedIn etc.
Anything left as `""` shows as an orange dashed spacer line on the site.

## 2. Add photos
See `images/README.md` for the exact file names (profile.jpg, ps3-meeting1.jpg, ...).
Drop a file with that name into `images/` and it replaces the placeholder. No code changes.

## 3. Deploy on Vercel
**Option A — drag & drop / CLI**
```
npm i -g vercel
cd apramey-portfolio
vercel          # first deploy (answer the prompts; framework: "Other", no build command, output dir ".")
vercel --prod   # production URL
```

**Option B — GitHub**
1. Create a new GitHub repository and upload the contents of this folder.
2. On vercel.com → Add New → Project → import the repo.
3. Framework preset: **Other**. Build command: *(leave empty)*. Output directory: `.` → Deploy.

`vercel.json` turns on clean URLs, so pages open as `/work/ps3` instead of `/work/ps3.html`.

## Pages
- `/` — home: hero, ID block (USN / roll no.), about, workshop sheets, gallery, contact
- `/work/ps1` … `/work/ps6` — one page per problem statement
