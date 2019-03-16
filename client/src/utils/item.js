export default class item{
    constructor(id, name, image, type, stats, rarity, equipped){
        this.id = id;
        this.name = name;
        this.image = image;
        this.type = type;
        this.stats = stats;
        this.rarity = rarity;
        this.equipped = equipped;
    }
    getName(){
        return this.name
    }
}