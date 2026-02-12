# ragTech Carousel Generator

Automated tool to generate Instagram/TikTok/LinkedIn carousel images from YouTube video timestamps with text overlays.

## Features

- 🎬 Captures YouTube video frames at specific timestamps
- 📝 Adds text overlays with professional styling
- 🎨 Generates 1080x1080 images optimized for social media
- 🔄 Batch processes multiple slides
- 🏷️ Adds ragTech branding automatically

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
cd carousel
npm install
```

## Configuration

### 1. Create or Edit `carousel-config.json`

```json
{
  "name": "carousel-name",
  "videoId": "YOUTUBE_VIDEO_ID",
  "showLogo": true,
  "slides": [
    {
      "timestamp": 180,
      "text": "Your text overlay here",
      "speaker": "Speaker Name"
    }
  ]
}
```

**Fields:**
- `name`: Output filename prefix
- `videoId`: YouTube video ID (from URL: `youtube.com/watch?v=VIDEO_ID`)
- `showLogo`: Whether to add ragTech logo overlay (default: `true`, set to `false` if video already has logo)
- `slides`: Array of slide configurations
  - `timestamp`: Time in seconds where to capture frame
  - `text`: Text to overlay on the image
  - `speaker`: Speaker name (for reference)

### 2. Find Timestamps

**Manual**

To find the right timestamps:
1. Open your YouTube video
2. Navigate to the moment you want to capture
3. Note the time (convert to seconds: 3:20 = 200 seconds)
4. Add to config with your text overlay

**AI-generated**
1. Make sure you have a timestamped transcript of the episode you want to get the timestamps from. You can use [youtube-transcript.io](https://www.youtube-transcript.io/), then save the output to `episodes/transcripts/`
2. Prompt your coding assistant to generate a config file based on a certain segment in the transcript. 

## Usage

### Generate Carousel (Default Config)

```bash
npm run generate
```

This uses `carousel-config.json` by default.

### Generate Specific Carousel

To use a different config file, modify the script or rename your config to `carousel-config.json`.

### Output

Generated images and pdf will be saved to `carousel/output/` directory:
- `{name}-slide-1.png`
- `{name}-slide-2.png`
- `{name}-slide-3.png`
- etc.

## Customization

### Text Styling

Edit `generate-carousel.js` to customize:
- Font size: `fontSize` variable (default: 56)
- Font family: `font-family` attribute
- Text position: `textY` calculation
- Text color: `fill` attribute
- Shadow/stroke: `stroke` and `filter` attributes

### Image Size

Currently optimized for 1080x1080. To change:
1. Update viewport size in `captureYouTubeFrame()`
2. Update SVG dimensions in `generateSVG()`
3. Update sharp resize in `generateSlide()`

### Branding

Edit the ragTech branding text in `generateSVG()`:
```javascript
<!-- ragTech branding (bottom right corner) -->
<text 
  x="${width - padding}" 
  y="${height - 20}" 
  ...
>ragTech</text>
```

## Troubleshooting

### "carousel-config.json not found"
- Make sure you're in the `carousel` directory
- Create or rename a config file to `carousel-config.json`

### Video not loading
- Check that the video ID is correct
- Ensure the video is public (not private/unlisted)
- Try increasing timeout in `waitForSelector()`

### Text too long
- Text automatically wraps based on width
- Consider breaking into multiple slides
- Adjust `fontSize` for longer text

### Poor quality screenshots
- Increase viewport size in `setViewport()`
- Ensure video quality is set to highest on YouTube
- Check internet connection speed

## Tips

1. **Timestamp Accuracy**: Add/subtract 1-2 seconds if frame isn't perfect
2. **Text Length**: Keep text concise (1-2 lines works best)
3. **Batch Processing**: Generate all slides at once for consistency
4. **Preview**: Check output images before posting
5. **Backup Configs**: Save different carousel configs for reuse

## Bulk Generation (Multiple Carousels)

Generate 3-4 carousels from a single transcript, each with 6-7 sequential slides.

### Workflow

1. **Copy the prompt** from [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md)
2. **Paste your transcript** into the prompt and send to your AI assistant
3. **Save the JSON output** as `carousel-bulk-config.json`
4. **Run bulk generation:**

```bash
npm run generate:bulk
```

### Output Structure

Carousels are organized by transcript name:

```
output/
├── CTO-carousel-1/
│   ├── slide-1.png
│   ├── slide-2.png
│   ├── ...
│   └── CTO-carousel-1.pdf
├── CTO-carousel-2/
│   └── ...
└── CTO-carousel-3/
    └── ...
```

### Bulk Config Format

```json
{
  "transcriptName": "CTO",
  "videoId": "YOUR_VIDEO_ID",
  "showLogo": false,
  "carousels": [
    {
      "name": "descriptive-name",
      "description": "What this carousel is about",
      "slides": [ ... ]
    }
  ]
}
```

## File Structure

```
carousel/
├── generate-carousel.js       # Main generator script
├── package.json               # Dependencies
├── carousel-config.json       # Single carousel config
├── carousel-bulk-config.json  # Bulk carousel config
├── PROMPT_TEMPLATE.md         # AI prompt for bulk generation
├── output/                    # Generated images
└── README.md                  # This file
```

## Next Steps

After generating your carousel:
1. Review images and pdf in `output/` folder
2. Upload images to Instagram/TikTok/YouTube with the CTA in `assets`, and upload the pdf to LinkedIn
3. Use the caption from your carousel markdown files
4. Tag relevant people and use hashtags

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments in `generate-carousel.js`
- Adjust timestamps and text as needed

---

**Note:** This tool requires an active internet connection to access YouTube videos. Generated images are saved locally and not uploaded automatically.
