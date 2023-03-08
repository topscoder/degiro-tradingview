import fs from 'fs';
import process from 'process'

import accounts from './.accounts.json'
import fetchPositionsAndOrders from './functions/fetchPositionsAndOrders';

process.removeAllListeners('warning')

// TODO Overview box with all positions

let PORTO_LABEL = "DEGIRO PORTO";
let porto_tickers = [];
let content = "";

(async () => {

    const now = new Date()

    // TradingView Indicator Header
    content += "// @version=5 \n"
    content += `indicator("${PORTO_LABEL}", "", true) \n`
    content += `// Generated at ${now.toLocaleString()} \n`
    content += `// Add to Pine Editor, click Add to Chart\n`
    content += `// Ensure "Indicator and financials name labels" is enabled\n`
    content += `// AVG = Average share price\n`
    content += `\n`

    for (let account of accounts) {
        let obj = await fetchPositionsAndOrders(account)
        porto_tickers.push(...obj.porto_tickers)
        content += obj.content
    }

    content += `\n\nimport MA_PT/easytable/1\n`
    content += `var string json_porto = '[`
    content += `{"ticker": "", "value": "", "PNL": "x %"}, `
    for (let tick of porto_tickers) {
        content += `{"ticker": "${tick}", "value": "", "PNL": "x %"}, `
    }
    content += `]'\n`
    content += `var tbl = easytable.json_to_table(json_porto)`

    fs.writeFileSync('./porto.pine', content);

    console.log('[>] porto.pine written.')

})()