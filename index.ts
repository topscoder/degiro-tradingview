const fs = require('fs');
import DeGiro, { DeGiroEnums, DeGiroTypes } from 'degiro-api'
import process from 'process'
import accounts from './.accounts.json'

process.removeAllListeners('warning')

// TODO Overview box with all positions

let PORTO_LABEL = "DEGIRO PORTO"

type DeGiroAccount = {
  pwd: string,
  user: string
}

let content = ""

/**
 *
 * @param degiro
 * @param name
 * @returns
 *
 * {
    id: '19750059',
    name: 'American Electric Power Company Inc',
    isin: 'US0255371017',
    symbol: 'AEP',
    contractSize: 1,
    productType: 'STOCK',
    productTypeId: 1,
    tradable: true,
    category: 'D',
    currency: 'EUR',
    active: true,
    exchangeId: '196',
    onlyEodPrices: false,
    orderTimeTypes: [ 'DAY', 'GTC' ],
    buyOrderTypes: [ 'LIMIT', 'MARKET', 'STOPLOSS', 'STOPLIMIT' ],
    sellOrderTypes: [ 'LIMIT', 'MARKET', 'STOPLOSS', 'STOPLIMIT' ],
    productBitTypes: [ 'US_RAS_GREEN_LIST' ],
    closePrice: 88.91,
    closePriceDate: '2022-10-31',
    feedQuality: 'R',
    orderBookDepth: 0,
    vwdIdentifierType: 'vwdkey',
    vwdId: 'US0255371017.TRADE,E',
    qualitySwitchable: false,
    qualitySwitchFree: false,
    vwdModuleId: 34
    }
 */
const getProduct = async (degiro: DeGiro, name: string) => {
    const result = await degiro.searchProduct({
        text: name,
        limit: 1,
    })

    if (result && result.length > 0) {
        for (let i in result) {
            if (result[i]['active'] == true) {
                return result[i]
            }
        }
    }

    return null
}

/**
 * fetchPositionsAndOrders
 *
 * @param account : DeGiroAccount
 */
const fetchPositionsAndOrders = async (account : DeGiroAccount) => {

    console.log(`[ ] Login to degiro account ${account.user}...`)

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

    console.log("[ ] Fetching actual portfolio...")

    portfolio.forEach( function(value) {
        // Print pine script to draw AVG line
        let label = `${value.size} x AVG`
        const { tickerlabel, ticker } = getTickerByProduct(value.productData)
        content += `// ${value.productData.name}\n`
        content += printOrder(value.breakEvenPrice, label, tickerlabel, ticker, 'color.white')
    })

    // Get Orders
    console.log("[ ] Fetching actual orders...")

    const { orders, lastTransactions } = await degiro.getOrders({
        active: true,
        lastTransactions: false
    })

    // console.log(orders);

    // Check if there are open buy/sell order
    for ( const index in orders ) {
        const name = orders[index]['product']
        const product = await getProduct(degiro, name)
        const { tickerlabel, ticker } = getTickerByProduct(product)

        if ( ticker == "" ) {
            console.error(`Whoopss.. Panic at the disco!`)
            console.error(`Could not resolve ticker for ${name}`)
            continue
        }

        const price = orders[index]['price']
        const label = orders[index]['buysell'] == 'S' ? 'TP' : 'BUY'
        const color = orders[index]['buysell'] == 'S' ? 'color.green' : 'color.orange'

        content += `// ${name}\n`
        content += printOrder(price, `${orders[index]['size']} x ${label}`, tickerlabel, ticker, color)
    }

    console.log("[ ] Logout from degiro...")

    await degiro.logout()

    return Promise.resolve(content)
}

let getTickerByProduct = (product: any) => {
    let tickerlabel = ""
    let ticker = ""

    // Try symbol
    if ( product['symbol'] != "" ) {
        tickerlabel = "syminfo.ticker"
        ticker = product['symbol']

    } else {
        // Try vwdId
        let vwd : Array<any> = product['vwdId'].toString().match(/^(.*?)\.(.*?)\,(.*?)$/)  // "vwdId": "MSFT.NASDAQ,E",
        if ( vwd != null && vwd.length > 0 ) {
            tickerlabel = "syminfo.tickerid"
            ticker = `${vwd[2]}:${vwd[1]}` // NASDAQ:MSFT
        }

    }

    // TODO: Fix fundamentally
    if ( ticker == "FB2A" ) {
        ticker = "META"
    }

    return { "tickerlabel": tickerlabel, "ticker": ticker }
}

/**
 *
 */
let printOrder = (price: number, label: string, tickerlabel: string, ticker: string, color: string) => {
    return `plot( (${tickerlabel} == "${ticker}")? ${price}: na, "${label}", color = ${color}, linewidth = 1, style = plot.style_line, trackprice = true, join = true, display = display.all)\n`
}

(async () => {

    const now = new Date()

    // TradingView Indicator Header
    content += "//@version=5 \n"
    content += `indicator("${PORTO_LABEL}", "", true) \n`
    content += `// Generated at ${now.toLocaleString()} \n`
    content += `// Add to Pine Editor, click Add to Chart\n`
    content += `// Ensure "Indicator and financials name labels" is enabled\n`
    content += `// AVG = Average share price\n`
    content += `\n`

    for (let account of accounts) {
        await fetchPositionsAndOrders(account)
    }

    fs.writeFileSync('./porto.pine', content);

    // file written successfully
    console.log('[OK] Done. See porto.pine.')
    console.log("")

})()