export default class item{
    constructor(id, type, image, stats, rarity, onAuction){
        this.id = id;
        this.type = type;
        this.image = image;
        this.stats = stats;
        this.rarity = rarity;
        this.onAuction = onAuction;
    }
}