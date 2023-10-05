import fs from 'fs';
import process from 'process'

import accountsData from './.accounts.bitvavo.json'
import validateAccounts from './helpers/validateAccountsBitvavo';
import { StockPosition } from './types/StockPosition'; // Assuming StockPosition type is defined in a separate file
import fetchPositionsAndOrders from './functions/bitvavo/fetchPositionsAndOrders';

process.removeAllListeners('warning')

let PORTO_LABEL = "BITVAVO PORTO";
let OUTPUT_FILE = "porto.bitvavo.pine";
let porto_positions: StockPosition[] = [];
let content = "";
let account = validateAccounts(accountsData);

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

    let obj = await fetchPositionsAndOrders(account.APIKEY, account.APISECRET)
    porto_positions.push(...obj.porto_positions)
    content += obj.content

    content += `\n\nimport MA_PT/easytable/1\n`
    content += `var string json_porto = '[`
    for (let pos of porto_positions) {
        let posPnl = pos.pnlPercentage > 0 ? "+" + pos.pnlPercentage : pos.pnlPercentage
        content += `{"ticker": "${pos.tickerId}", "value": "${pos.totalValue}_${pos.currency}", "PNL": "${posPnl}%"}, `
    }
    content += `]'\n`
    content += `var tbl = easytable.json_to_table(json_porto)\n`
    content += `easytable.change_table_style(tbl, 3, ${porto_positions.length + 1}, 3)\n`

    fs.writeFileSync('./' + OUTPUT_FILE, content);

    console.log(`[>] ${OUTPUT_FILE} written.\n`)
    console.log(`[>] Now open ${OUTPUT_FILE} in: TradingView > Pine Editor, Click "Add to Chart" and open one of your positions.`)

    process.exit(0);
})()
