interface Account {
    user: string;
    pwd: string;
}

/**
 * validateAccounts
 * 
 */
export default (accounts: any[]) => {
    let returnData: Account[] = [];
    accounts.forEach(account => {
        if (!account.user || !account.pwd) {
            console.error('[!] Invalid account data found. Both user and password must be provided as `user` and `pwd`.');
            return;
        }

        let newAccount: Account = {
            user: account.user,
            pwd: account.pwd
        };
        returnData.push(newAccount);
    });

    return returnData;
}