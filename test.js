const searchDDG = require("./tools/searchDuckDuckGo");

(async () => {
  const result = await searchDDG("starcraft")
  
  console.log(result)
})()