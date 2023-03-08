import DeGiro from 'degiro-api'

/** 
 * getProduct
 * @param degiro
 * @param name
 * @returns DeGiroProduct | null
 */
export default async (degiro: DeGiro, name: string) => {
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