# Stealinglight Asset Inventory

## Source Location

All assets are located at:
```
/Users/Stealinglight/Desktop/StealingLight_Archive/
```

Inventory spreadsheet:
```
/Users/Stealinglight/Desktop/StealingLight_Asset_Inventory.xlsx
```

---

## Videos for Website

### Featured Reel (Hero/Main)
```
/Users/Stealinglight/Desktop/StealingLight_Archive/Reels/Drone/Drone Reel 2018_1.mp4
```

### Secondary Reel
```
/Users/Stealinglight/Desktop/StealingLight_Archive/Reels/Company/BLNK_2020-Reel.mp4
```

### Other Available Reels
| File | Path |
|------|------|
| CamOp Reel | `Reels/Personal/Chris_McMillon's_CamOp-Reel.mp4` |
| DP Reel 2018 | `Reels/Personal/DP Reel 2018.mp4` |
| DP Reel 2018 v2 | `Reels/Personal/DP Reel 2018v2.mp4` |
| BLNK 2019 | `Reels/Company/BLNK_REEL_2019.mp4` |
| STAB Reel | `Reels/Company/STAB_REEL.mp4` |

---

## Client Logos

### Available in Archive (SVG)
Location: `/Users/Stealinglight/Desktop/StealingLight_Archive/Website_Assets/Client_Logos/`

- audi.svg
- bosch.svg
- burton.svg
- calvin_klein.svg
- china_citic_bank.svg
- coach.svg
- huawei.svg
- intel.svg
- lenovo.svg
- monster_energy.svg
- niu.svg
- spin_expo.svg
- tencent.svg
- toyota.svg
- volkswagen.svg

### Target Client List for Website
- Tencent ✓ (in archive)
- Intel ✓ (in archive)
- Lenovo ✓ (in archive)
- Burton ✓ (in archive)
- Toyota ✓ (in archive)
- Volkswagen ✓ (in archive)
- Audi ✓ (in archive)
- Vogue ✗ (need to source)
- Puma ✗ (need to source)
- Converse ✗ (need to source)
- Coach ✓ (in archive)
- Calvin Klein ✓ (in archive)
- DJI ✗ (need to source)
- Aperture ✗ (need to source)
- Netflix ✗ (need to source)

### Logo Requirements
- All logos should be monochrome (single color)
- Consistent style across all logos
- SVG format preferred for scalability
- Should match the cinematic dark theme (white/light gray on dark background)

---

## Archive Structure

```
StealingLight_Archive/
├── BTS_Photos/
├── Business_Documents/
├── Commercials/
│   ├── Automotive/
│   ├── Fashion/
│   ├── Financial/
│   ├── Food_Beverage/
│   ├── Other/
│   └── Tech/
├── Documentaries/
├── Events/
├── Personal_Documents/
├── Project_Files/
├── Reels/
│   ├── Company/
│   ├── Drone/
│   └── Personal/
├── Reference_Materials/
├── Short_Films/
├── System_Backups/
└── Website_Assets/
    └── Client_Logos/
```

---

## Deployment Notes

When ready to deploy:
1. Copy selected videos to S3 bucket
2. Generate video thumbnails/posters
3. Compress videos for web (if needed)
4. Update component props with S3 URLs
