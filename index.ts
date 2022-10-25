const fs = require('fs');
import DeGiro, { DeGiroEnums, DeGiroTypes } from 'degiro-api'
import process from 'process'
import accounts from './.accounts.json'

process.removeAllListeners('warning')

// TODO Overview box with all positions

let PORTO_LABEL = "PORTO"

type DeGiroAccount = {
  pwd: string,
  user: string
}

let content = ""

let getSymbol = async (degiro: DeGiro, name: string) => {
    const result = await degiro.searchProduct({
        text: name,
        // type: DeGiroProducTypes.shares,
        limit: 1,
    })

    if (result && result.length > 0) {
        if (result[0]["symbol"] != "") {
            return result[0]["symbol"]
        }
    }

    return ""
}

/**
 * fetchPositionsAndOrders
 *
 * @param account : DeGiroAccount
 */
let fetchPositionsAndOrders = async (account : DeGiroAccount) => {

    // DeGiro Login
    const degiro: DeGiro = new DeGiro({
        username: account.user,
        pwd: account.pwd,
    })

    await degiro.login()

    // Get Portfolio
    const portfolio = await degiro.getPortfolio({
        type: DeGiroEnums.PORTFOLIO_POSITIONS_TYPE_ENUM.OPEN,
        getProductDetails: true
    })

    portfolio.forEach( function(value) {
        // Print pine script to draw GAK line
        let label = `${account.user}: GAK`
        const { tickerlabel, ticker } = getTicker(value.productData.vwdId, value.productData.symbol)
        content += `// ${value.productData.name}\n`
        content += printOrder(value.breakEvenPrice, label, tickerlabel, ticker, 'color.white')
    })

    // Get Orders
    const { orders, lastTransactions } = await degiro.getOrders({
        active: true,
        lastTransactions: false
    })

    // Check if there are open buy/sell orders
    orders.forEach( async (order, index) => {
        let name = orders[index]['product']
        let symbol = await getSymbol(degiro, name)
        const { tickerlabel, ticker } = getTicker("", symbol)

        let price = orders[index]['price']
        let label = orders[index]['buysell'] == 'S' ? 'TP' : 'BUY'
        let color = orders[index]['buysell'] == 'S' ? 'color.green' : 'color.orange'

        content += `// ${name}\n`
        content += printOrder(price, `${account.user}: ${label}`, tickerlabel, ticker, color)
    })

    await degiro.logout()

    return Promise.resolve(content)
}

/**
 *
 * @param vwdId
 * @param symbol
 * @returns
 */
let getTicker = (vwdId: string, symbol: string) => {
    let vwd = vwdId.toString().match(/^(.*?)\.(.*?)\,(.*?)$/)  // "vwdId": "MSFT.NASDAQ,E",

    let tickerlabel = ""
    let ticker = ""

    if ( vwd != null ) {
        tickerlabel = "syminfo.tickerid"
        ticker = `${vwd[2]}:${vwd[1]}` // NASDAQ:MSFT
    } else {
        tickerlabel = "syminfo.ticker"
        ticker = `${symbol}` // MSFT
    }

    // Fix Japan Tobacco ticker
    if ( ticker == "2914" )
        ticker = "JAT"

    // Fix Japan Tobacco ticker
    if ( ticker == "TRADEGATE:JP3726800000" )
        ticker = "TRADEGATE:JAT"

    // Fix Tradegate ticker
    ticker = ticker.replace("TRADE:", "TRADEGATE:")

    return { tickerlabel, ticker }
}

/**
 *
 */
let printOrder = (price: number, label: string, tickerlabel: string, ticker: string, color: string) => {
    return `plot( (${tickerlabel} == "${ticker}")? ${price}: na, "${label}", color = ${color}, linewidth = 1, style = plot.style_line, trackprice = true, join = true, display = display.all)\n`
}

(async () => {

    // TradingView Indicator Header
    content += "//@version=5 \n"
    content += `indicator("${PORTO_LABEL}", "", true) \n`
    content += `// Add to Pine Editor, click Add to Chart\n`
    content += `// Ensure "Indicator and financials name labels" is enabled\n`
    content += `// GAK = Gemiddelde Aankoopprijs\n`

    for (let account of accounts) {
        await fetchPositionsAndOrders(account)
    }

    fs.writeFileSync('./porto.pine', content);

    // file written successfully
    console.log('[ok] written to porto.pine')
    console.log("")

})()