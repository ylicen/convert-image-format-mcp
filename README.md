# 图像格式转换 MCP 服务器
这是一个通过 MCP (Model Context Protocol) 提供图像格式转换功能的服务器。  

##安装方法
```
{
  "mcpServers": {
    "convert-image-format-mcp": {
      "disabled": false,
      "timeout": 60,
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "convert-image-mcp"
      ]
    }
  }
}
```



## 功能列表

1. **PNG 转 SVG** (`png_to_svg`)
   - 将 PNG 图片转换为矢量 SVG 格式
   - 使用 `@neplex/vectorizer` 库进行转换

2. **PNG 转 ICO** (`png_to_ico`)
   - 将 PNG 图片转换为 Windows 图标格式
   - 使用 `png2icons` 库进行转换

3. **SVG 转 PNG** (`svg_to_png`)
   - 将 SVG 矢量图转换为 PNG 位图
   - 支持自定义输出尺寸（宽度和高度）
   - 使用 `sharp` 库进行转换

4. **PNG 转 WebP** (`png_to_webp`) - 新增功能
   - 将 PNG 图片转换为 WebP 格式
   - 支持质量设置（1-100，默认80）
   - 支持无损压缩选项（默认为有损压缩）
   - 使用 `sharp` 库进行转换

## PNG 转 WebP 工具使用说明

### 参数说明

- `input_image_path`: PNG 输入文件的路径（必需）
- `output_webp_path`: WebP 输出文件的路径（必需）
- `quality`: 图像质量（可选，1-100，默认80）
- `lossless`: 是否使用无损压缩（可选，布尔值，默认false）

### 使用示例

```javascript
// 基本用法 - 使用默认质量（80）和有损压缩
{
  "input_image_path": "C:/images/example.png",
  "output_webp_path": "C:/images/example.webp"
}

// 高质量转换
{
  "input_image_path": "C:/images/photo.png",
  "output_webp_path": "C:/images/photo_high_quality.webp",
  "quality": 95
}

// 无损压缩转换
{
  "input_image_path": "C:/images/logo.png",
  "output_webp_path": "C:/images/logo_lossless.webp",
  "lossless": true
}

// 低质量高压缩率转换（适合缩略图）
{
  "input_image_path": "C:/images/large_photo.png",
  "output_webp_path": "C:/images/thumbnail.webp",
  "quality": 50
}
```

## WebP 格式的优势

1. **更小的文件大小**: WebP 通常比 PNG 小 25-35%
2. **支持透明度**: 像 PNG 一样支持 alpha 通道
3. **支持动画**: 可以存储动画图像
4. **灵活的压缩选项**: 支持有损和无损压缩
5. **广泛的浏览器支持**: 现代浏览器都支持 WebP

## 安装依赖

```bash
npm install
```

## 启动服务器

```bash
node mcp_image_converter_server.js
```

## 注意事项

- 所有路径都支持绝对路径和相对路径
- 输出目录如果不存在会自动创建
- Sharp 库已经内置了对 WebP 格式的支持，无需额外安装依赖
