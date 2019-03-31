import AuctionHouse from "./contracts/AuctionHouse.json";

const drizzleOptions = {
    web3: {
      block: false,
      fallback: {
        type: "ws",
        url: "ws://127.0.0.1:7545",
      },
    },
    contracts: [
      AuctionHouse
    ],
    polls: {
        accounts: 3000,
        blocks: 3000
    },
    events: {
        MintItem: ["MitItem"],
        Transfer: ["Transfer"],
        Approval: ["Approval"],
        ApprovalForAll: ["ApprovalForAll"],
        AuctionCreated: ["AuctionCreated"],
        AuctionPurchased: ["AuctionPurchased"],
        AuctionEnded: ["AuctionEnded"]

    },
  };
  export default drizzleOptions;