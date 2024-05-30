import { JSDOM } from 'jsdom';

function normalizeURL(url){
  let temp_url = new URL(url);
  let normalizedURL = temp_url.hostname + temp_url.pathname;
  return normalizedURL;
};

function getURLsFromHTML(htmlBody, baseURL){
  try{
    const dom = new JSDOM(htmlBody)
    const anchorArray = dom.window.document.querySelectorAll('a')
    let linksArray = []
    anchorArray.forEach(atag => {
      let updatedLink = ''
      if(isRelativeLink(atag.href)){
        updatedLink = new URL(atag.getAttribute('href'), baseURL).href;
      } else if(!isRelativeLink(atag.href)){
        updatedLink = atag.href;
      }
      linksArray.push(updatedLink)
    })
    return linksArray
  } catch(err) {
    console.log('Error at GETURLSFROMHTML: ' + err)
  }
}

function isRelativeLink(href) {
  try{
    new URL(href);
    return false;
  } catch(_) {
    return true
  }
}


async function crawlPage(url){
  // console.log(`CRAWLING: ${url}`)
  try{
    let response = await fetch(url, {
      'method' : 'GET'
    })
    if (response.status >= 400 && response.status < 500){
      console.log('WARN: 4XX Status detected. Error loading webpage: ' + url)
      return null;
    }
    if (!response.headers.get('Content-Type').includes('text/html')){
      console.log('ERROR: Website is not in HTML format.')
      console.log(response.headers.get('Content-Type'))
      return null;
    }
    else{
      let data = await response.text()
      return data;
    }
  } catch(error){
    console.log('CRITICAL ERROR Running command: ' + error)
    console.log('Shutting down gracefully')
    return null;
  }
}

async function crawlURL(baseURL, currentURL = baseURL, pages = {}){
  
  if(typeof baseURL === 'string'){
    baseURL = new URL(baseURL);
  }
  
  if(typeof currentURL === 'string'){
    currentURL = new URL(currentURL)
  }
  if(currentURL.hostname !== baseURL.hostname){
    // console.log('ORIGIN DIFFERENT FROM BASEURL... SKIPPING...')
    return pages;
  } 

  const normalizedCurrentURL = normalizeURL(currentURL.href)

  if(pages.hasOwnProperty(normalizedCurrentURL)){
    // console.log('PAGE PRESENT, UPDATING LIST')
    pages[normalizedCurrentURL] += 1;
    return pages;
  } else if (!pages.hasOwnProperty(normalizedCurrentURL)){
    // console.log('NEW PAGE DETECTED: CRAWLING...')
    pages[normalizedCurrentURL] = 1
    const newPageHTML = await crawlPage(currentURL.href)
    const urlList = getURLsFromHTML(newPageHTML, baseURL.href)
    for (const url of urlList) {
      const normalizedURL = normalizeURL(url);
      const newURL = new URL(normalizedURL, baseURL.href);
      pages = await crawlURL(baseURL, newURL, pages); // Ensure async call is awaited
    }
    return pages;
  }
}

export {normalizeURL, getURLsFromHTML, crawlURL};