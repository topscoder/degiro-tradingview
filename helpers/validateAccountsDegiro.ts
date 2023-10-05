import { AccountDegiro } from "../interfaces/AccountDegiro";

/**
 * validateAccounts
 * 
 */
export default (accounts: any[]) => {
    let returnData: AccountDegiro[] = [];
    accounts.forEach(account => {
        if (!account.user || !account.pwd) {
            console.error('[!] Invalid account data found. Both user and password must be provided as `user` and `pwd`.');
            return;
        }

        let newAccount: AccountDegiro = {
            user: account.user,
            pwd: account.pwd
        };
        returnData.push(newAccount);
    });

    return returnData;
}