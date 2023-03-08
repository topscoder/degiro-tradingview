# Visualize your DeGiro portfolio in TradingView

<br>

> ### __Important__: Never Ever Share Your DeGiro Credentials From `.accounts.json` To Anyone.

<br>

![HEIA_2022-10-26_11-23-57_c8c4c](https://user-images.githubusercontent.com/86197446/197989149-82e2aecd-65a0-4000-9a36-3a25dc47d51c.png)

## Requirements
* node 18.x
* [TradingView](https://www.tradingview.com/gopro/?share_your_love=zdwnsq6cm9)
* Degiro username and password

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

[![asciicast](https://asciinema.org/a/dtWGiElisZVUwECw63zja4lbf.svg?autoplay=1)](https://asciinema.org/a/dtWGiElisZVUwECw63zja4lbf?autoplay=1)

Open `porto.pine` in [TradingView](https://www.tradingview.com/gopro/?share_your_love=zdwnsq6cm9), click 'Add to Chart' and open one of your stock positions. You will see a line at your (avg) entry (aka GAK) and eventually a line(s) for remaining buy/sell orders you have for this position.
