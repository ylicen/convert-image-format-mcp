const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const { convertPngToSvg, convertPngToIco, convertSvgToPng, convertPngToWebp } = require("./image_converter_logic.js");
const path = require('path'); // Not strictly needed here but good for consistency

async function main() {
  // Create an MCP server
  const server = new McpServer({
    name: "image-format-converter-mcp",
    version: "1.0.0",
    description: "A server that provides tools to convert between image formats: PNG to SVG/ICO/WebP and SVG to PNG.",
    // It's good practice to also define the publisher if known
    // publisher: "MyOrgOrName", 
  });

  // Define PNG to SVG tool
  server.tool(
    "png_to_svg",
    {
      input_image_path: z.string().describe("Absolute or relative path to the input PNG image."),
      output_svg_path: z.string().describe("Absolute or relative path to save the output SVG image.")
    },
    async ({ input_image_path, output_svg_path }) => {
      console.log(`[MCP Server] Received png_to_svg request: Input: ${input_image_path}, Output: ${output_svg_path}`);
      // Resolve paths if they are relative to the server's CWD
      // For simplicity, assuming absolute paths or paths relative to where the server is run
      const result = await convertPngToSvg(input_image_path, output_svg_path);
      if (result.success) {
        return {
          content: [{ type: "text", text: `SVG conversion successful. Output: ${result.path}` }]
        };
      } else {
        return {
          content: [{ type: "text", text: `SVG conversion failed. Error: ${result.error}` }]
        };
      }
    }
  );

  // Define PNG to ICO tool
  server.tool(
    "png_to_ico",
    {
      input_image_path: z.string().describe("Absolute or relative path to the input PNG image."),
      output_ico_path: z.string().describe("Absolute or relative path to save the output ICO image.")
    },
    async ({ input_image_path, output_ico_path }) => {
      console.log(`[MCP Server] Received png_to_ico request: Input: ${input_image_path}, Output: ${output_ico_path}`);
      const result = await convertPngToIco(input_image_path, output_ico_path);
      if (result.success) {
        return {
          content: [{ type: "text", text: `ICO conversion successful. Output: ${result.path}` }]
        };
      } else {
        return {
          content: [{ type: "text", text: `ICO conversion failed. Error: ${result.error}` }]
        };
      }
    }
  );

  // Define SVG to PNG tool
  server.tool(
    "svg_to_png",
    {
      input_svg_path: z.string().describe("Absolute or relative path to the input SVG image."),
      output_png_path: z.string().describe("Absolute or relative path to save the output PNG image."),
      width: z.number().optional().describe("Optional width for the output PNG (maintains aspect ratio if only width is set)."),
      height: z.number().optional().describe("Optional height for the output PNG (maintains aspect ratio if only height is set).")
    },
    async ({ input_svg_path, output_png_path, width, height }) => {
      console.log(`[MCP Server] Received svg_to_png request: Input: ${input_svg_path}, Output: ${output_png_path}, Width: ${width || 'auto'}, Height: ${height || 'auto'}`);
      
      const options = {
        width: width || null,
        height: height || null
      };
      
      const result = await convertSvgToPng(input_svg_path, output_png_path, options);
      
      if (result.success) {
        return {
          content: [{ type: "text", text: `PNG conversion successful. Output: ${result.path}` }]
        };
      } else {
        return {
          content: [{ type: "text", text: `PNG conversion failed. Error: ${result.error}` }]
        };
      }
    }
  );

  // Define PNG to WebP tool
  server.tool(
    "png_to_webp",
    {
      input_image_path: z.string().describe("Absolute or relative path to the input PNG image."),
      output_webp_path: z.string().describe("Absolute or relative path to save the output WebP image."),
      quality: z.number().min(1).max(100).optional().describe("Optional quality for the output WebP (1-100, default: 80)."),
      lossless: z.boolean().optional().describe("Optional lossless compression (default: false).")
    },
    async ({ input_image_path, output_webp_path, quality, lossless }) => {
      console.log(`[MCP Server] Received png_to_webp request: Input: ${input_image_path}, Output: ${output_webp_path}, Quality: ${quality || 80}, Lossless: ${lossless || false}`);
      
      const options = {
        quality: quality || 80,
        lossless: lossless || false
      };
      
      const result = await convertPngToWebp(input_image_path, output_webp_path, options);
      
      if (result.success) {
        return {
          content: [{ type: "text", text: `WebP conversion successful. Output: ${result.path}` }]
        };
      } else {
        return {
          content: [{ type: "text", text: `WebP conversion failed. Error: ${result.error}` }]
        };
      }
    }
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("[MCP Server] Image Format Converter Server is running and connected via stdio.");
  console.log("[MCP Server] Available tools: png_to_svg, png_to_ico, svg_to_png, png_to_webp");
}

main().catch(error => {
  console.error("[MCP Server] Failed to start the server:", error);
  process.exit(1);
});
