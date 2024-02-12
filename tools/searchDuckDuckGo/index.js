const DDG = require('duck-duck-scrape');
const searchDuckDuckGo = async (keyword) => {
  return await DDG.search(keyword, {
    safeSearch: DDG.SafeSearchType.OFF
  });
}

module.exports = {
  signature: "searchDuckDuckGo(keyword)",
  runner: searchDuckDuckGo
};
// DDG.stocks('aapl')
// DDG.currency('usd', 'eur', 1)
// DDG.dictionaryDefinition('happy')/**
