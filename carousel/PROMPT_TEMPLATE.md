# Carousel Bulk Generation Prompt

Copy the prompt below and paste it to your coding assistant along with the transcript.

---

## Prompt

```
I have a podcast transcript below. Please analyze it and:

1. Identify 3-4 key takeaways that would make engaging carousel content
2. For each takeaway, select a ~30-60 second sequential segment from the transcript
3. Break each segment into 6-7 slides with sequential timestamps

Output a JSON file in this exact format for `carousel-bulk-config.json`:

{
  "transcriptName": "EPISODE_NAME",
  "videoId": "YOUTUBE_VIDEO_ID",
  "showLogo": false,
  "carousels": [
    {
      "name": "short-descriptive-name",
      "description": "Brief description of this takeaway",
      "slides": [
        {
          "topTimestamp": 123,
          "bottomTimestamp": 126,
          "topText": "First quote from speaker",
          "bottomText": "Second quote continuing the thought"
        }
        // ... 6-7 slides total
      ]
    }
    // ... 3-4 carousels total
  ]
}

Rules for slides:
- Timestamps must be SEQUENTIAL within each carousel (not jumping around)
- Each slide covers ~3-8 seconds of dialogue
- topText and bottomText should be punchy, quotable snippets
- Clean up filler words (um, uh, like) but keep the authentic voice
- Each carousel should tell a complete mini-story or make one clear point

Here's the transcript:

[PASTE YOUR TRANSCRIPT HERE]
```

---

## After Getting the JSON

1. Save the output as `carousel/carousel-bulk-config.json`
2. Update the `videoId` if the AI didn't fill it in correctly
3. Run: `npm run generate:bulk`
4. Find your carousels organized in `output/{transcriptName}-carousel-{n}/`

---

## Example Output Structure

For transcript `47-CTO.txt`, the output folder will look like:

```
output/
├── CTO-carousel-1/
│   ├── slide-1.png
│   ├── slide-2.png
│   ├── ...
│   └── CTO-carousel-1.pdf
├── CTO-carousel-2/
│   ├── slide-1.png
│   └── ...
├── CTO-carousel-3/
│   └── ...
└── CTO-carousel-4/
    └── ...
```
