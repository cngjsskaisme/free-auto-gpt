const axios = require('axios');
const cheerio = require('cheerio');
const fs = require("fs")

const searchGoogle = async (searchQuery) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  const selectRandom = () => {
    const userAgents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",]
    var randomNumber = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomNumber];
  }
  let user_agent = selectRandom();
  let header = {
    "User-Agent": `${user_agent}`
  }

  try {
    const response = await axios.get(url, { headers: header });
    const $ = cheerio.load(response.data);

    // console.log(response.data)

    fs.writeFileSync("./result.html", response.data)

    let searchResults = [];
    $($(".Gx5Zad").children().slice(3, 15)).each((index, element) => {
      console.log($(element).text())
      const titleDOM = $(element).find('h3');
      const title = titleDOM.text();
      const linkDOM = titleDOM.parent().parent().parent();
      const link = linkDOM.attr("href");
      const descriptionDOM = linkDOM.parent().parent().parent().siblings()[0];
      const description = descriptionDOM.text();

      searchResults.push({ title, link, description });
    });

    return searchResults;

  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  signature: "searchGoogle(keyword)",
  runner: searchGoogle
};
