//реализация транспортного слоя

const API_KEY =
  "e5e2d0c2b6a4f890be7835e279f08313ea99cb60b125aaf9840b7b4a45e9c870";

const tickers  = new Map();//{список функций которые надо вызвать если изменился }
//{key:func list}    {{'BTC-event':[callback1,callback2,callback3]},{...}}
//





/**
 *
 * @date 2021-07-25
 * @param {any} tickerName имя  тикера в формате BTC
 * @returns {any}
 */
async function loadTicker(tickers) {
  return await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  ).then((r) => r.json());
}

function loadData() {
  return fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  )
    .then((f) => {
      return f.json();
    })
    .then((data) => {
      return data.Data;
    });
}

export const subscribeToTickerUpdate = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || [];
  tickers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeToTickerUpdate = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || [];
  tickers.set(ticker, subscribers.filter(fn => fn != cb));
};

export { loadTicker, loadData };
