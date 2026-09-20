const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const assets = path.join(__dirname, "..", "src", "assets");
const sources = fs.readdirSync(assets).filter((file) => /^krg-\d+\.jpg$/i.test(file));

Promise.all(
  sources.map((source) => {
    const destination = source.replace(/\.jpg$/i, ".webp");
    return sharp(path.join(assets, source))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 76, effort: 4 })
      .toFile(path.join(assets, destination));
  }),
)
  .then(() => console.log(`Optimized ${sources.length} workshop images.`))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
