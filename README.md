# Visualize your DeGiro portfolio in TradingView

## Installation

```
$ git clone https://github.com/topscoder/degiro-tradingview.git
$ cd degiro-tradingview
$ npm install
$ cp .accounts.example.json .accounts.json
```

Now it's time to enter your DeGiro account credentials into the `.accounts.json` file.

And after that run the following command:

```
$ npm start
> ts-node index.ts

[ok] written to porto.pine
```

Open `porto.pine` in TradingView, click 'Add to Chart' and open one of your stock positions. You will see a line at your (avg) entry and eventually a line(s) for remaining orders you have in DeGiro.

___

# Important: Never Ever Share Your DeGiro Credentials From .accounts.json To Anyone. Period.