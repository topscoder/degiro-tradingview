
/**
 * getTicketByProduct
 * 
 * @param product (array[symbol:string, vwdId:int])
 * @returns object { tickerlabel:string, ticker:string}
 */
export default (product: any) => {
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

    if ( ticker == "AEND" ) {
        ticker = "AGN"
    }
    
    if ( ticker == "116" ) {
        ticker = "WATT"
    }

    return { "tickerlabel": tickerlabel, "ticker": ticker }
}