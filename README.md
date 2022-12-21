# Visualize your DeGiro portfolio in TradingView

![HEIA_2022-10-26_11-23-57_c8c4c](https://user-images.githubusercontent.com/86197446/197989149-82e2aecd-65a0-4000-9a36-3a25dc47d51c.png)

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
```

Open `porto.pine` in TradingView, click 'Add to Chart' and open one of your stock positions. You will see a line at your (avg) entry and eventually a line(s) for remaining orders you have in DeGiro.

___

# Important: Never Ever Share Your DeGiro Credentials From .accounts.json To Anyone. Period.
