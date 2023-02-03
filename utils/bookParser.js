const cheerio = require("cheerio");
const axios = require("axios");

async function parseBookHtml(url) {
    let result = {};
    await axios.get(url).then((res) => {
        let $ = cheerio.load(res.data);
        const description = removeNewlineAndPlus($("#desc").text());
        const author = $("td.t50 + td b").text();
        const publisher = $('td:contains("Publisher") + td b').text();
        const published = parseInt($('td:contains("Published") + td b').text());
        const pages = parseInt($('td:contains("Pages") + td b').text());
        const language = $('td:contains("Language") + td b').text();
        result = {
            description,
            author,
            publisher,
            published,
            pages,
            language,
        };
    });
    return result;
}

function removeNewlineAndPlus(str) {
    return str.replace(/(\n|\+)+/g, "");
}

module.exports = { parseBookHtml };
