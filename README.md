# Visualize your DeGiro / Bitvavo portfolio in TradingView

<br>

> ### __Important__: Never Ever Share Your DeGiro / Bitvavo Credentials From `.accounts.[degiro|bitvavo].json` To Anyone.

<br>

![HEIA_2022-10-26_11-23-57_c8c4c](https://user-images.githubusercontent.com/86197446/197989149-82e2aecd-65a0-4000-9a36-3a25dc47d51c.png)

## Requirements
* node 18.x
* [TradingView](https://www.tradingview.com/gopro/?share_your_love=zdwnsq6cm9)
* Degiro username and password
* [AND/OR] Bitvavo API Key and API Secret

## Installation

```
$ git clone https://github.com/topscoder/degiro-tradingview.git
$ cd degiro-tradingview
$ npm install
```

### DEGIRO
```
$ cp .accounts.degiro.example.json .accounts.degiro.json\
```

Now it's time to enter your DeGiro account credentials into the `.accounts.degiro.json` file.

And after that run the following command:

```
$ npm run degiro && cat porto.degiro.pine
```

### Bitvavo

```
$ cp .accounts.bitvavo.example.json .accounts.bitvavo.json
```

Now it's time to enter your Bitvavo API Key and API Secret into the `.accounts.bitvavo.json` file.

And after that run the following command:

```
$ npm run bitvavo && cat porto.bitvavo.pine
```

Open your generated Pine file in [TradingView](https://www.tradingview.com/gopro/?share_your_love=zdwnsq6cm9), click 'Add to Chart' and open one of your stock positions. You will see a line at your (avg) entry (aka GAK) and eventually a line(s) for remaining buy/sell orders you have for this position.
