const fs = require('fs').promises;
const path = require('path');
const { vectorize } = require('@neplex/vectorizer');
const png2icons = require('png2icons');
const sharp = require('sharp');

// Ensure output directory exists utility
const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error(`Error creating directory ${dirPath}:`, err);
      throw err;
    }
  }
};

async function convertPngToSvg(inputPngPath, outputSvgPath) {
  try {
    const outputDir = path.dirname(outputSvgPath);
    await ensureDir(outputDir);
    const pngBuffer = await fs.readFile(inputPngPath);
    const svgContent = await vectorize(pngBuffer);
    await fs.writeFile(outputSvgPath, svgContent);
    console.log(`Successfully converted ${inputPngPath} to ${outputSvgPath}`);
    return { success: true, path: outputSvgPath };
  } catch (error) {
    console.error(`Error converting PNG to SVG (input: ${inputPngPath}, output: ${outputSvgPath}):`, error);
    return { success: false, error: error.message };
  }
}

async function convertPngToIco(inputPngPath, outputIcoPath) {
  try {
    const outputDir = path.dirname(outputIcoPath);
    await ensureDir(outputDir);
    const pngBuffer = await fs.readFile(inputPngPath);
    // Assuming BILINEAR, no transparency keying, not for cursors, default sizes
    const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BILINEAR, 0, false); 
    await fs.writeFile(outputIcoPath, icoBuffer);
    console.log(`Successfully converted ${inputPngPath} to ${outputIcoPath}`);
    return { success: true, path: outputIcoPath };
  } catch (error) {
    console.error(`Error converting PNG to ICO (input: ${inputPngPath}, output: ${outputIcoPath}):`, error);
    return { success: false, error: error.message };
  }
}

async function convertSvgToPng(inputSvgPath, outputPngPath, options = { width: null, height: null }) {
  try {
    const outputDir = path.dirname(outputPngPath);
    await ensureDir(outputDir);
    
    const svgBuffer = await fs.readFile(inputSvgPath);
    
    let sharpInstance = sharp(svgBuffer);
    
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize({
        width: options.width || undefined,
        height: options.height || undefined,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      });
    }
    
    await sharpInstance.png().toFile(outputPngPath);
    
    console.log(`Successfully converted ${inputSvgPath} to ${outputPngPath}`);
    return { success: true, path: outputPngPath };
  } catch (error) {
    console.error(`Error converting SVG to PNG (input: ${inputSvgPath}, output: ${outputPngPath}):`, error);
    return { success: false, error: error.message };
  }
}

async function convertPngToWebp(inputPngPath, outputWebpPath, options = { quality: 80, lossless: false }) {
  try {
    const outputDir = path.dirname(outputWebpPath);
    await ensureDir(outputDir);
    
    const pngBuffer = await fs.readFile(inputPngPath);
    
    let sharpInstance = sharp(pngBuffer);
    
    // 配置WebP转换选项
    const webpOptions = {
      quality: options.quality || 80,
      lossless: options.lossless || false,
      effort: 4 // 压缩努力程度，0-6，数值越高压缩越好但速度越慢
    };
    
    await sharpInstance.webp(webpOptions).toFile(outputWebpPath);
    
    console.log(`Successfully converted ${inputPngPath} to ${outputWebpPath} (quality: ${webpOptions.quality}, lossless: ${webpOptions.lossless})`);
    return { success: true, path: outputWebpPath };
  } catch (error) {
    console.error(`Error converting PNG to WebP (input: ${inputPngPath}, output: ${outputWebpPath}):`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  convertPngToSvg,
  convertPngToIco,
  convertSvgToPng,
  convertPngToWebp,
  ensureDir
};
