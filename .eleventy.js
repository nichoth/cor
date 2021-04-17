module.exports = function (eleventyConfig) {
    // Add a filter using the Config API
    // eleventyConfig.addFilter( "myFilter", function () {

    // });

    // eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("src/admin/index.html");
    eleventyConfig.addPassthroughCopy("src/admin/config.yml");

    // eleventyConfig.addPassthroughCopy("src/admin");
  
    // You can return your Config object (optional).
    return {
        dir: {
            input: "src",
            output: "public"
        }
    };

};
