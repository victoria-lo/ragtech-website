const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * ragTech Carousel Generator
 * Automates creation of Instagram/TikTok/LinkedIn carousel images
 * from YouTube video timestamps with text overlays
 */

class CarouselGenerator {
  constructor(config) {
    this.config = config;
    this.outputDir = path.join(__dirname, 'output');
    this.browser = null;
  }

  async init() {
    await fs.ensureDir(this.outputDir);
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-device-scale-factor=1',
        '--high-dpi-support=1',
        '--start-maximized',
        '--disable-notifications'
      ],
      protocolTimeout: 60000,
      defaultViewport: null
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Seek video to timestamp and extract frame (for reusing same page)
   */
  async seekAndExtractFrame(page, timestamp) {
    console.log(`  Seeking to ${timestamp}s...`);
    
    // Seek to timestamp and pause
    await page.evaluate((ts) => {
      const video = document.querySelector('video');
      if (video) {
        video.currentTime = ts;
        video.pause();
      }
    }, timestamp);

    // Wait for video to seek
    await new Promise(resolve => setTimeout(resolve, 3000));

    // CRITICAL: Force pause multiple times to ensure video stops
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.pause();
        video.removeAttribute('autoplay');
        video.playbackRate = 0;
      }
    });

    // Wait and verify video is paused
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Final verification and pause
    const isPaused = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.pause();
        return video.paused;
      }
      return false;
    });

    console.log(`  Video paused: ${isPaused}`);

    // Wait for frame to stabilize after pause
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract actual video frame using canvas
    console.log('  Extracting video frame...');
    const frameDataUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (!video) {
        throw new Error('Video element not found');
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      return canvas.toDataURL('image/png');
    });

    const base64Data = frameDataUrl.replace(/^data:image\/png;base64,/, '');
    const screenshot = Buffer.from(base64Data, 'base64');

    console.log('  Frame extracted successfully');
    return screenshot;
  }

  /**
   * Capture YouTube video frame at specific timestamp
   */
  async captureYouTubeFrame(videoId, timestamp) {
    const page = await this.browser.newPage();
    
    // Set realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport to 1920x1080 for high quality
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Navigate to YouTube video at specific timestamp with HD quality parameter
    const url = `https://www.youtube.com/watch?v=${videoId}&t=${timestamp}s&vq=hd1080`;
    console.log(`  Loading: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for video element to be present
    await page.waitForSelector('video', { timeout: 15000 });
    
    // Wait for video to load and buffer at high quality
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Click play button if visible, then pause at the right moment
    try {
      const playButton = await page.$('.ytp-large-play-button');
      if (playButton) {
        await playButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.log('  Play button not found, video may be auto-playing');
    }

    // Manually set quality to highest via settings menu
    try {
      // Click settings button
      await page.click('.ytp-settings-button');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Click quality menu item
      const qualityMenuItems = await page.$$('.ytp-menuitem');
      for (const item of qualityMenuItems) {
        const text = await page.evaluate(el => el.textContent, item);
        if (text && text.includes('Quality')) {
          await item.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      }
      
      // Select highest quality (usually last in list)
      const qualityOptions = await page.$$('.ytp-quality-menu .ytp-menuitem');
      if (qualityOptions.length > 0) {
        // Click the first option (highest quality)
        await qualityOptions[0].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('  Set to highest quality');
      }
    } catch (e) {
      console.log('  Could not manually set quality via menu');
    }

    // Set video quality to highest available and seek to timestamp
    await page.evaluate((ts) => {
      const video = document.querySelector('video');
      const player = document.querySelector('.html5-video-player');
      
      // Try to set quality to highest (1080p or higher)
      if (player && player.setPlaybackQualityRange) {
        try {
          player.setPlaybackQualityRange('hd1080', 'highres');
        } catch (e) {
          console.log('Could not set quality range');
        }
      }
      
      if (video) {
        video.currentTime = ts;
        video.pause();
      }
    }, timestamp);

    // Wait for video to seek
    await new Promise(resolve => setTimeout(resolve, 3000));

    // CRITICAL: Force pause multiple times to ensure video stops
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.pause();
        // Remove autoplay attribute if present
        video.removeAttribute('autoplay');
        // Set playback rate to 0 as extra measure
        video.playbackRate = 0;
      }
    });

    // Wait and verify video is paused
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Final verification and pause
    const isPaused = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.pause();
        return video.paused;
      }
      return false;
    });

    console.log(`  Video paused: ${isPaused}`);

    // Wait for frame to stabilize after pause
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Disable captions/subtitles
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        // Turn off captions via the player
        const player = document.querySelector('.html5-video-player');
        if (player && player.getOption) {
          try {
            player.setOption('captions', 'track', {});
          } catch (e) {
            // Ignore if method doesn't exist
          }
        }
        // Hide text tracks
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].mode = 'hidden';
        }
      }
    });

    // Wait for captions to hide
    await new Promise(resolve => setTimeout(resolve, 500));

    // Hide YouTube UI elements for cleaner screenshot
    await page.evaluate(() => {
      const elementsToHide = [
        '.ytp-chrome-top',
        '.ytp-chrome-bottom',
        '.ytp-gradient-top',
        '.ytp-gradient-bottom',
        '.ytp-title',
        '.ytp-watermark',
        '.ytp-pause-overlay'
      ];
      
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el) el.style.display = 'none';
        });
      });
    });

    // Wait a moment for UI to hide
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract actual video frame using canvas (much sharper than screenshot)
    console.log('  Extracting video frame...');
    const frameDataUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (!video) {
        throw new Error('Video element not found');
      }

      // Create canvas with video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Export as PNG data URL
      return canvas.toDataURL('image/png');
    });

    // Convert data URL to buffer
    const base64Data = frameDataUrl.replace(/^data:image\/png;base64,/, '');
    const screenshot = Buffer.from(base64Data, 'base64');

    console.log('  Frame extracted successfully');
    await page.close();
    return screenshot;
  }

  /**
   * Word wrap text helper
   */
  wordWrapText(text, maxWidth, fontSize) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length * (fontSize * 0.6) > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    return lines;
  }

  /**
   * Load and convert logo to base64
   */
  async loadLogo() {
    const logoPath = path.join(__dirname, '..', 'public', 'assets', 'logo', 'ragtech-logo.png');
    const logoBuffer = await fs.readFile(logoPath);
    return logoBuffer.toString('base64');
  }

  /**
   * Load and convert Nunito font to base64
   */
  async loadNunitoFont() {
    const fontPath = path.join(__dirname, '..', 'public', 'assets', 'Nunito', 'static', 'Nunito-Bold.ttf');
    const fontBuffer = await fs.readFile(fontPath);
    return fontBuffer.toString('base64');
  }

  /**
   * Generate SVG with dual screenshots stacked vertically
   */
  async generateSVG(width, height, topText, bottomText, topImageData, bottomImageData, logoData, fontData, showLogo = true) {
    const fontSize = 36;
    const padding = 30;
    const textBottomMargin = 20;
    const lineHeight = fontSize * 1.2;
    const halfHeight = height / 2;
    
    // Word wrap both texts
    const topLines = this.wordWrapText(topText, width - (padding * 2), fontSize);
    const bottomLines = this.wordWrapText(bottomText, width - (padding * 2), fontSize);
    
    // Calculate text positions (closer to bottom of each half)
    const topTextY = halfHeight - (topLines.length * lineHeight) - textBottomMargin;
    const bottomTextY = height - (bottomLines.length * lineHeight) - textBottomMargin;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style type="text/css"><![CDATA[
            @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 700;
              src: url(data:font/truetype;charset=utf-8;base64,${fontData}) format('truetype');
            }
            text {
              font-family: 'Nunito', Arial, sans-serif;
            }
          ]]></style>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.8"/>
          </filter>
        </defs>
        
        <!-- Top screenshot -->
        <image href="data:image/png;base64,${topImageData}" x="0" y="0" width="${width}" height="${halfHeight}" preserveAspectRatio="xMidYMid slice"/>
        
        <!-- Top text overlay with shadow -->
        <g filter="url(#shadow)">
          ${topLines.map((line, i) => `
            <text 
              x="${width / 2}" 
              y="${topTextY + (i * lineHeight)}" 
              font-family="Nunito, Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="700" 
              fill="white" 
              text-anchor="middle"
              stroke="#000000"
              stroke-width="3"
              paint-order="stroke"
              letter-spacing="0.5"
              text-rendering="geometricPrecision"
            >${this.escapeXml(line)}</text>
          `).join('')}
        </g>
        
        <!-- Bottom screenshot -->
        <image href="data:image/png;base64,${bottomImageData}" x="0" y="${halfHeight}" width="${width}" height="${halfHeight}" preserveAspectRatio="xMidYMid slice"/>
        
        <!-- Bottom text overlay with shadow -->
        <g filter="url(#shadow)">
          ${bottomLines.map((line, i) => `
            <text 
              x="${width / 2}" 
              y="${bottomTextY + (i * lineHeight)}" 
              font-family="Nunito, Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="700" 
              fill="white" 
              text-anchor="middle"
              stroke="#000000"
              stroke-width="3"
              paint-order="stroke"
              letter-spacing="0.5"
              text-rendering="geometricPrecision"
            >${this.escapeXml(line)}</text>
          `).join('')}
        </g>
        
        ${showLogo ? `<!-- Logo overlay (top right corner) -->
        <image 
          href="data:image/png;base64,${logoData}" 
          x="${width - 120}" 
          y="20" 
          width="100" 
          height="100" 
          opacity="0.9"
        />` : ''}
      </svg>
    `;

    return svg;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generate a single carousel slide
   */
  async generateSlide(slideConfig, slideNumber, page) {
    console.log(`Generating slide ${slideNumber}`);
    console.log(`  Top: ${slideConfig.topText}`);
    console.log(`  Bottom: ${slideConfig.bottomText}`);

    // Capture top screenshot at first timestamp
    const topScreenshot = await this.seekAndExtractFrame(page, slideConfig.topTimestamp);

    // Capture bottom screenshot at second timestamp (reusing same page)
    const bottomScreenshot = await this.seekAndExtractFrame(page, slideConfig.bottomTimestamp);

    // Convert screenshots to base64
    const topImageData = topScreenshot.toString('base64');
    const bottomImageData = bottomScreenshot.toString('base64');

    // Load logo and font
    const logoData = await this.loadLogo();
    const fontData = await this.loadNunitoFont();

    // Generate SVG with dual images and text overlays
    const showLogo = this.config.showLogo !== false; // default true
    const svg = await this.generateSVG(
      1080, 
      1080, 
      slideConfig.topText, 
      slideConfig.bottomText, 
      topImageData, 
      bottomImageData,
      logoData,
      fontData,
      showLogo
    );

    // Convert SVG to PNG using Puppeteer
    const outputPath = path.join(
      this.outputDir,
      `${this.config.name}-slide-${slideNumber}.png`
    );

    // Use Puppeteer to render SVG to PNG (supports embedded fonts)
    const svgPage = await this.browser.newPage();
    await svgPage.setViewport({ width: 1080, height: 1080 });
    
    // Set SVG content
    await svgPage.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
            svg { display: block; }
          </style>
        </head>
        <body>${svg}</body>
      </html>
    `, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take screenshot
    await svgPage.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1080 }
    });

    await svgPage.close();

    console.log(`✓ Saved: ${outputPath}`);
    return outputPath;
  }

  /**
   * Generate PDF from carousel slides
   */
  async generatePDF(slidePaths) {
    const pdfPath = path.join(this.outputDir, `${this.config.name}.pdf`);
    const ctaPath = path.join(__dirname, '..', 'public', 'content', 'carousel-cta.png');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [1080, 1080],
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // Add each slide as a page
      slidePaths.forEach((slidePath, index) => {
        if (index > 0) doc.addPage();
        doc.image(slidePath, 0, 0, { width: 1080, height: 1080 });
      });

      // Add CTA page as final page
      doc.addPage();
      doc.image(ctaPath, 0, 0, { width: 1080, height: 1080 });

      doc.end();

      stream.on('finish', () => {
        console.log(`\n📄 PDF generated: ${pdfPath}`);
        resolve(pdfPath);
      });

      stream.on('error', reject);
    });
  }

  /**
   * Generate all slides for a carousel
   */
  async generateCarousel() {
    console.log(`\n🎬 Generating carousel: ${this.config.name}`);
    console.log(`Total slides: ${this.config.slides.length}\n`);

    const outputPaths = [];

    // Open YouTube video ONCE for all slides
    const page = await this.browser.newPage();
    
    // Set realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport to 1920x1080 for high quality
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Navigate to YouTube video (use first slide's timestamp as starting point)
    const firstTimestamp = this.config.slides[0].topTimestamp;
    const url = `https://www.youtube.com/watch?v=${this.config.videoId}&t=${firstTimestamp}s&vq=hd1080`;
    console.log(`Opening video: ${url}\n`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for video element
    await page.waitForSelector('video', { timeout: 15000 });
    
    // Wait for video to load and buffer at high quality
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Click play button if visible
    try {
      const playButton = await page.$('.ytp-large-play-button');
      if (playButton) {
        await playButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.log('Play button not found, video may be auto-playing');
    }

    // Set quality to highest via settings menu (only once for all slides)
    try {
      await page.click('.ytp-settings-button');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const qualityMenuItems = await page.$$('.ytp-menuitem');
      for (const item of qualityMenuItems) {
        const text = await page.evaluate(el => el.textContent, item);
        if (text && text.includes('Quality')) {
          await item.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          break;
        }
      }
      
      const qualityOptions = await page.$$('.ytp-quality-menu .ytp-menuitem');
      if (qualityOptions.length > 0) {
        await qualityOptions[0].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Set to highest quality\n');
      }
    } catch (e) {
      console.log('Could not manually set quality via menu\n');
    }

    // Disable captions/subtitles (only once for all slides)
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        const player = document.querySelector('.html5-video-player');
        if (player && player.getOption) {
          try {
            player.setOption('captions', 'track', {});
          } catch (e) {}
        }
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].mode = 'hidden';
        }
      }
    });

    // Hide YouTube UI elements (only once for all slides)
    await page.evaluate(() => {
      const elementsToHide = [
        '.ytp-chrome-top',
        '.ytp-chrome-bottom',
        '.ytp-gradient-top',
        '.ytp-gradient-bottom',
        '.ytp-title',
        '.ytp-watermark',
        '.ytp-pause-overlay'
      ];
      
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el) el.style.display = 'none';
        });
      });
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate all slides using the same page
    for (let i = 0; i < this.config.slides.length; i++) {
      const slide = this.config.slides[i];
      const outputPath = await this.generateSlide(slide, i + 1, page);
      outputPaths.push(outputPath);
      
      // Small delay between slides
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Close the page after all slides are generated
    await page.close();

    console.log(`\n✅ Carousel complete! Generated ${outputPaths.length} slides`);
    console.log(`Output directory: ${this.outputDir}\n`);

    // Generate PDF with all slides + CTA
    await this.generatePDF(outputPaths);

    return outputPaths;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const isBulk = args.includes('--bulk');

  if (isBulk) {
    // Bulk mode: process multiple carousels from carousel-bulk-config.json
    const bulkConfigPath = path.join(__dirname, 'carousel-bulk-config.json');

    if (!fs.existsSync(bulkConfigPath)) {
      console.error('❌ Error: carousel-bulk-config.json not found');
      console.log('Please create a carousel-bulk-config.json file. See PROMPT_TEMPLATE.md for instructions.');
      process.exit(1);
    }

    const bulkConfig = await fs.readJson(bulkConfigPath);
    const { transcriptName, videoId, carousels, showLogo } = bulkConfig;

    console.log(`\\n🎬 Bulk generating ${carousels.length} carousels from transcript: ${transcriptName}\\n`);

    for (let i = 0; i < carousels.length; i++) {
      const carousel = carousels[i];
      const carouselFolderName = `${transcriptName}-carousel-${i + 1}`;
      
      // Create config for this carousel
      const config = {
        name: carouselFolderName,
        videoId: videoId,
        slides: carousel.slides,
        showLogo: showLogo !== false // default true
      };

      const generator = new CarouselGenerator(config);
      // Override output directory to be a subfolder
      generator.outputDir = path.join(__dirname, 'output', carouselFolderName);

      try {
        console.log(`\n📁 Carousel ${i + 1}/${carousels.length}: ${carousel.name}`);
        console.log(`   ${carousel.description}`);
        await generator.init();
        await generator.generateCarousel();
      } catch (error) {
        console.error(`❌ Error generating carousel ${i + 1}:`, error);
      } finally {
        await generator.close();
      }
    }

    console.log(`\n✅ Bulk generation complete! Check output/ for ${carousels.length} carousel folders.\n`);

  } else {
    // Single mode: use carousel-config.json
    const configPath = path.join(__dirname, 'carousel-config.json');

    if (!fs.existsSync(configPath)) {
      console.error('❌ Error: carousel-config.json not found');
      console.log('Please create a carousel-config.json file with your carousel configuration.');
      process.exit(1);
    }

    const config = await fs.readJson(configPath);

    const generator = new CarouselGenerator(config);

    try {
      await generator.init();
      await generator.generateCarousel();
    } catch (error) {
      console.error('❌ Error generating carousel:', error);
      process.exit(1);
    } finally {
      await generator.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = CarouselGenerator;
