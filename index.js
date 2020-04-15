const request = require("request-promise");
const cheerio = require("cheerio");

async function main() {
 const result = await request.get("https://www.icicibank.com/nri-banking/money_transfer/money-transfer-rates.page");
 const $ = cheerio.load(result);
 const icici_data = $("#main > div.middleContainer.main-content.clearfix > div > div.mobile-only > div > div > table > tbody").map((index, element) => {
   return $(element).text();
 });

//  const iob_result = await request.get('https://www.iob.in/iob_Forex-rates.aspx');
//  const $_iob = cheerio.load(iob_result);
//  const iob_data = $_iob("#ctl00_ContentPlaceHolder1_gv > tbody").map((index, element) => {
//      return $_iob(element).text()
//  })

//  const iob_mod_data = iob_data['0'].split('\t');
//  console.log(iob_mod_data);

const canara_result = await request.get('https://canarabank.com/english/online-services/forex-card-rates/');
const $_canara = cheerio.load(canara_result);;
const canara_data = $_canara("body > div.container.loanproduct > div > div.col-md-9.col-sm-9.pl0.pr0.rightpanel-product.ul-list-style > div > div > div > div > table > tbody > tr").map((index, element) => {
    return $_canara(element).text();
})

let canara_table_data = []

for (let i = 3; i< 15; i+=1) {
    canara_table_data.push(canara_data[`${i}`].split('\n'));
}

let exchange_rate_canara = []

for(let i = 0; i< canara_table_data.length; i+=1) {
    exchange_rate_canara.push({
        country: canara_table_data[i][1],
        selling_rate_tt: canara_table_data[i][3],
        selling_rate_bills: canara_table_data[i][4],
        buying_rate_tt: canara_table_data[i][7],
        buying_rate_bills: canara_table_data[i][8],
    })
}

 const mod_data = icici_data['0'].split('\n');

 const countries = ['USA', 'Canada', 'UK', 'Australia', 'Singapore', 'UAE']
 const table_data = mod_data.filter(data => data !== '');
 let exchange_rate_icici = []
 for (let i = 0; i<table_data.length-1; i+=1) {
     if (countries.includes(table_data[i])) {
         exchange_rate_icici.push({
             country: table_data[i],
             exchange_rate: table_data[i+1]
         })
     }
 }

 console.log('For ICIC Bank: ', exchange_rate_icici);
 console.log('For Canara Bank: ', exchange_rate_canara);

}

 
main();