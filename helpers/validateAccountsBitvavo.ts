import { AccountBitvavo } from "../interfaces/AccountBitvavo";


/**
 * validateAccountsBitvavo
 * 
 */
export default (account: AccountBitvavo) => {
    
    if (!account.APIKEY || !account.APISECRET) {
        console.error('[!] Invalid account data found. Both APIKEY and APISECRET must be provided as `APIKEY` and `APISECRET`.');
        return;
    }

    return account;
}