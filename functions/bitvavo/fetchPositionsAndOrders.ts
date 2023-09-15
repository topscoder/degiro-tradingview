
import { StockPosition } from "../../types/StockPosition"
import printOrder from "../../helpers/printOrder"


/**
 * fetchPositionsAndOrders
 *
 * @param api_key : string
 * @param api_secret : string
 * @return content : Promise.resolve({content, porto_positions})
 */
export default async (api_key: string, api_secret: string) => {

    let content = ""
    let porto_positions = []

    const bitvavo = require('bitvavo')().options({
        APIKEY: api_key,
        APISECRET: api_secret,
        ACCESSWINDOW: 2000,
        RESTURL: 'https://api.bitvavo.com/v2',
        WSURL: 'wss://ws.bitvavo.com/v2/',
        DEBUGGING: false
    })

    console.log(`[+] Fetching actual portfolio from Bitvavo...`)

    try {
        let response = await bitvavo.ordersOpen({})
        for (let entry of response) {

            let label = `${entry.side}`
            content += `// ${entry.market}\n`

            if (entry.status == 'filled')
                continue;

            // {
            // orderId: 'f9991ce3-1337-4926-991c-b3007442342e',
            // market: 'BTC-EUR',
            // created: 1693331980767,
            // updated: 1693331980767,
            // status: 'new',
            // side: 'sell',
            // orderType: 'limit',
            // amount: '0.01',
            // amountRemaining: '0.01',
            // price: '26598',
            // onHold: '0.01',
            // onHoldCurrency: 'BTC',
            // filledAmount: '0',
            // filledAmountQuote: '0',
            // feePaid: '0',
            // feeCurrency: 'EUR',
            // fills: [],
            // selfTradePrevention: 'decrementAndCancel',
            // visible: true,
            // timeInForce: 'GTC',
            // postOnly: false
            // }

            const stockPosition: StockPosition = {
                tickerId: entry.market,
                tickerLabel: 'tickerLabel',
                actualPrice: entry.price,
                breakEvenPrice: 0,
                totalValue: Math.round(entry.amount * entry.price),
                pnlPercentage: 0, //Math.round(((value.price - value.breakEvenPrice) / value.breakEvenPrice) * 100),
                currency: entry.feeCurrency
            };

            porto_positions.push(stockPosition);

            let color = (entry.side == 'buy' ? 'color.green' : 'color.red')
            let orderLabel = entry.side + ' @ ' + entry.amount
            content += printOrder(entry.price, orderLabel, 'syminfo.ticker', entry.market.replace("-", ""), color)
        }

        // Sort alphabetically on tickerId
        porto_positions.sort((a, b) => a.tickerId.localeCompare(b.tickerId));

    } catch (error) {
        console.error(`[x] Whoopss.. Panic at the disco!`)
        console.log(error)
    }

    return Promise.resolve({ "content": content, "porto_positions": porto_positions })
}
