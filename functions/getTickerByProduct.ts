
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
  if (product['symbol'] != "") {
    tickerlabel = "syminfo.ticker"
    ticker = product['symbol']

  } else {
    // Try vwdId
    let vwd: Array<any> = product['vwdId'].toString().match(/^(.*?)\.(.*?)\,(.*?)$/)  // "vwdId": "MSFT.NASDAQ,E",
    if (vwd != null && vwd.length > 0) {
      tickerlabel = "syminfo.tickerid"
      ticker = `${vwd[2]}:${vwd[1]}` // NASDAQ:MSFT
    }
  }

  // TODO: Fix fundamentally
  if (ticker == "FB2A") {
    ticker = "META"
  }

  if (ticker == "AEND") {
    ticker = "AGN"
  }

  if (ticker == "116") {
    ticker = "WATT"
  }

  if (ticker == "BP.") {
    ticker = "BP"
  }

  if (ticker == "ADG") {
    ticker = "AMG"
  }

  if (ticker == "5ZM") {
    ticker = "ZM"
  }

  if (ticker == "RY6") {
    ticker = "O"
  }

  if (ticker == "1QZ") {
    ticker = "COIN"
  }

  if (ticker == "TNTC") {
    ticker = "PNL"
  }

  if (ticker == "2HQ") {
    ticker = "TLRY"
  }

  // Innovative Industrial Properties Inc
  if (ticker == "1IK") {
    ticker = "IIPR"
  }

  // Unilever PLC
  if (ticker == "UNVB") {
    ticker = "UNA"
  }

  // BlackBerry Ltd
  if (ticker == "RI1") {
    ticker = "BB"
  }

  // Plug Power Inc
  if (ticker == "PLUN") {
    ticker = "PLUG"
  }

  return { "tickerlabel": tickerlabel, "ticker": ticker }
}
