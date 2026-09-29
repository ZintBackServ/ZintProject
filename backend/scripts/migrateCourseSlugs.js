const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const Course = require("../src/models/courseModel");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

async function runMigration() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DB_URL;
  if (!mongoUri) {
    console.error("No MONGO_URI found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for slug migration...");

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to evaluate.`);

    let updated = 0;

    for (const course of courses) {
      if (!course.slug || course.slug.trim() === "") {
        let baseSlug = slugify(course.courseName) || "course";
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await Course.findOne({ slug: uniqueSlug, _id: { $ne: course._id } })) {
          uniqueSlug = `${baseSlug}-${counter++}`;
        }

        course.slug = uniqueSlug;
        await course.save();
        console.log(`[SLUG MIGRATED] "${course.courseName}" -> "${uniqueSlug}"`);
        updated++;
      } else {
        console.log(`[SLUG EXISTS] "${course.courseName}" -> "${course.slug}"`);
      }
    }

    console.log(`\nMigration completed successfully. ${updated} courses updated with slugs.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

runMigration();
