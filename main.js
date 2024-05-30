import { crawlURL } from "./crawl.js"
import { printReport } from "./report.js" 

console.log('Initializing application...');

async function main() {
  let baseURL = ''
  if (process.argv.length > 3){
    console.log('Error: Too many arguments sent. Please only submit 1 link at a time.');
  } else if(process.argv.length < 3){
    console.log('Error: no arguments detectet. Please submit a link with the command.');
  } else if(process.argv.length == 3){
    baseURL = new URL(process.argv[2])
    let crawlContent = await crawlURL(baseURL)
    printReport(crawlContent, baseURL)
  }
}

main();