export default {
  config: {
    API_KEY: "e5e2d0c2b6a4f890be7835e279f08313ea99cb60b125aaf9840b7b4a45e9c870",
    socket: "",
    btc2usd: "",
  },
  init() {
    // eslint-disable-next-line
    console.log(this.config.API_KEY);
    this.socket = new WebSocket(
      `wss://streamer.cryptocompare.com/v2?api_key=${this.config.API_KEY}`
    );
    // eslint-disable-next-line no-unused-vars
    this.socket.onopen = (e) => {
      var subRequest = {
        action: "SubAdd",
        subs: ["5~CCCAGG~BTC~USD", "5~CCCAGG~USD~BTCDOWN"],
      };
      this.socket.send(JSON.stringify(subRequest));
      console.log("connected");
    };

    this.socket.onmessage = (e) => {
      let dat = JSON.parse(e.data);
              console.log(dat);


    };
  },
};
