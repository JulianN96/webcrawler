function printReport(pages, baseURL){
  console.log('****************************************************************')
  console.log('**********************Initializing report...********************')
  console.log('****************************************************************')
  console.log(`ANASLYSING: ${baseURL}`)
  console.log('****************************************************************')
  console.log('****************************************************************')
  console.log('****************************************************************')
  for(const page in pages){
    console.log(`Found: ${pages[page]} internal links to ${page}`)
  }
  console.log('****************************************************************')
  console.log('**************************END REPORT***************************')
  console.log('****************************************************************')
}

export {printReport}