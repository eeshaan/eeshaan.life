if (!process.env.VERCEL) {
  require("dotenv").config({ path: ".env.local" });
}

const { list } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");
const https = require("https");

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download file: ${response.statusCode} ${response.statusMessage}`
            )
          );
          return;
        }
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });
      })
      .on("error", reject);
  });
}

async function downloadFonts() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set");
    }

    const { blobs } = await list();

    if (!fs.existsSync(FONT_DIR)) {
      fs.mkdirSync(FONT_DIR, { recursive: true });
    }

    // download each font file
    for (const blob of blobs) {
      const fontName = path.basename(blob.pathname);
      const fontPath = path.join(FONT_DIR, fontName);

      console.log(`Downloading ${fontName}...`);

      await downloadFile(blob.url, fontPath);

      console.log(`Downloaded ${fontName} successfully.`);
    }

    console.log("All fonts downloaded successfully!");
  } catch (error) {
    console.error("Error downloading fonts:", error);
    process.exit(1);
  }
}

downloadFonts().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
