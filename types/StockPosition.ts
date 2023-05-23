
export type StockPosition = {
    tickerId: string,
    tickerLabel: string,
    actualPrice: number,
    breakEvenPrice: number,
    totalValue: number,
    pnlPercentage: number,
    currency: string
};