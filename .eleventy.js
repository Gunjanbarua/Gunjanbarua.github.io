const { EleventyRenderPlugin } = require("@11ty/eleventy");
const markdownIt = require("markdown-it");

const md = markdownIt({ html: true });

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Pass-through copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/content/images");
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // NOTE: Collections using individual markdown files have been replaced by
  // _data/*.js loaders that read from single consolidated markdown files.
  // The collections below are kept for backward compatibility but are empty
  // since the individual files have been removed.

  // Gallery still uses individual files
  eleventyConfig.addCollection("gallery", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/gallery/*.md");
  });

  // Filters
  eleventyConfig.addFilter("dateDisplay", function (date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(0, limit);
  });

  // Markdown filter for rendering markdown strings in templates
  eleventyConfig.addFilter("markdownify", function (str) {
    if (!str) return "";
    return md.render(String(str));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
