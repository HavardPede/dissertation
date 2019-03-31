export default class auctionHouseItem{
    constructor(id, type, image, stats, rarity, price, seller, ended){
        this.id = id;
        this.type = type;
        this.image = image;
        this.stats = stats;
        this.rarity = rarity;
        this.price = price;
        this.seller = seller;
        this.ended = ended;
    }
}