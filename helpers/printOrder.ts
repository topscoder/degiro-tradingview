

/**
 * printOrder
 * 
 * @param price number
 * @param label string
 * @param tickerlabel string
 * @param ticker string
 * @param color string
 * @returns string
 */
export default (price: number, label: string, tickerlabel: string, ticker: string, color: string) => {
    return `plot( (${tickerlabel} == "${ticker}")? ${price}: na, "${label}", color = ${color}, linewidth = 1, style = plot.style_line, trackprice = true, join = true, display = display.all)\n`
}