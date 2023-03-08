import DeGiro from "degiro-api"
import { DeGiroEnums } from "degiro-api"
import { DeGiroAccount } from "../types/DeGiroAccount"
import printOrder from "../helpers/printOrder"
import getTickerByProduct from "./getTickerByProduct"
import getProduct from "./getProduct"

/**
 * fetchPositionsAndOrders
 *
 * @param account : DeGiroAccount
 * @return content : Promise.resolve({content, porto_tickers})
 */
export default async (account : DeGiroAccount) => {

    let content = ""
    let porto_tickers = []
    
    console.log(`[+] Login to degiro account ${account.user}...`)

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

    console.log(`[+] Fetching actual portfolio for ${account.user}...`)

    portfolio.forEach( function(value) {
        // Print pine script to draw AVG line
        let label = `${value.size} x AVG`
        const { tickerlabel, ticker } = getTickerByProduct(value.productData)
        porto_tickers.push(ticker);
        content += `// ${value.productData.name}\n`
        content += printOrder(value.breakEvenPrice, label, tickerlabel, ticker, 'color.white')
    })

    // Get Orders
    console.log("[+] Fetching actual orders...")

    const { orders, lastTransactions } = await degiro.getOrders({
        active: true,
        lastTransactions: false
    })

    // Check if there are open buy/sell order
    for ( const index in orders ) {
        const name = orders[index]['product']
        const product = await getProduct(degiro, name)
        const { tickerlabel, ticker } = getTickerByProduct(product)

        if ( ticker == "" ) {
            console.error(`[x] Whoopss.. Panic at the disco!`)
            console.error(`[x] Could not resolve ticker for ${name}`)
            continue
        }

        const price = orders[index]['price']
        const label = orders[index]['buysell'] == 'S' ? 'TP' : 'BUY'
        const color = orders[index]['buysell'] == 'S' ? 'color.green' : 'color.orange'

        content += `// ${name}\n`
        content += printOrder(price, `${orders[index]['size']} x ${label}`, tickerlabel, ticker, color)
    }

    console.log("[-] Logout from degiro...")

    await degiro.logout()

    return Promise.resolve({"content": content, "porto_tickers": porto_tickers})
}