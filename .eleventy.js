module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/admin/*");
    // eleventyConfig.addPassthroughCopy("src/admin/index.html");
    // eleventyConfig.addPassthroughCopy("src/admin/config.yml");
    eleventyConfig.addPassthroughCopy("src/uploads")

    // You can return your Config object (optional).
    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
};
