const path = require('path');
const svgtofont = require("svgtofont");
const pkg = require('./package.json');
const fs = require('fs');

const rootPath = path.resolve(process.cwd(), "src", "assets");

const fontName = 'iconfont';
svgtofont({
  src: path.resolve(rootPath, "svgIcons"), // svg path
  dist: path.resolve(rootPath, "svgIconFonts"), // output path
  emptyDist: true, // Clear output directory contents
  fontName: fontName, // font name
  css: true, // Create CSS files.
  startNumber: 20000, // unicode start number
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true
  },
  // website = null, no demo html files
  website: {
    // Add a Github corner to your website
    // Like: https://github.com/uiwjs/react-github-corners
    corners: {
      url: 'https://github.com/jaywcjlove/svgtofont',
      width: 62, // default: 60
      height: 62, // default: 60
      bgColor: '#dc3545' // default: '#151513'
    },
    index: "unicode", // Enum{"font-class", "unicode", "symbol"}
    title: "svgtofont",
    favicon: path.resolve(rootPath, "favicon.png"),
    // Must be a .svg format image.
    logo: path.resolve(rootPath, "svg", "git.svg"),
    version: pkg.version,
    meta: {
      description: "Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.",
      keywords: "svgtofont,TTF,EOT,WOFF,WOFF2,SVG"
    },
    description: ``,
    links: [
      {
        title: "GitHub",
        url: "https://github.com/jaywcjlove/svgtofont"
      },
      {
        title: "Feedback",
        url: "https://github.com/jaywcjlove/svgtofont/issues"
      },
      {
        title: "Font Class Demo",
        url: "font-class.html"
      },
      {
        title: "Symbol Demo",
        url: "symbol.html"
      },
      {
        title: "Unicode Demo",
        url: "index.html"
      }
    ],
    footerInfo: `Licensed under MIT. (Yes it's free and <a target="_blank" href="https://github.com/jaywcjlove/svgtofont">open-sourced</a>)`
  }
})
.then(() => {
  const scssPath = path.join(rootPath, `svgIconFonts/${fontName}.scss`);
  let iconfontScss = fs.readFileSync(scssPath).toString();
  const fontSizeReg = /\s+font-size: 16px;/;
  iconfontScss = iconfontScss.replace(fontSizeReg, '');
  const reg = /^@font-face\s\{[^}]+\}/;
  fs.writeFileSync(scssPath, iconfontScss.replace(reg, `@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1677307441152'); /* IE9*/
  src: url('iconfont.eot?t=1677307441152#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url("iconfont.woff2?t=1677307441152") format("woff2"),
  url("iconfont.woff?t=1677307441152") format("woff"),
  url('iconfont.ttf?t=1677307441152') format('truetype');
}
  `));
});
