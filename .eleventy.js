const { EleventyRenderPlugin } = require("@11ty/eleventy");
const markdownIt = require("markdown-it");

const md = markdownIt({ html: true });

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Source markdown that should not render as pages
  eleventyConfig.ignores.add("src/content/**");
  eleventyConfig.ignores.add("src/images/**/*.md");

  // Pass-through copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/files");
  eleventyConfig.addPassthroughCopy("src/content/images");
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Writing posts (shown only as summaries in the #writing section)
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
  });

  // Filters
  eleventyConfig.addFilter("dateDisplay", function (date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });

  // Bold the site owner in an author list (input is escaped first)
  eleventyConfig.addFilter("boldMe", function (str) {
    if (!str) return "";
    const esc = String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.replace(/Barua, G\./g, "<strong>Barua, G.</strong>");
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
