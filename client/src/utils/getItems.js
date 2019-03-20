import item from "./item"

export default class getItems {

    constructor() {
        var amulet = new item(1, "Eye of Ethlitch", "./images/gear/amulet/1.png", "amulet", [], "epic", true);
        var helmet = new item(2, "Prides Hope", "./images/gear/helmet/9.png", "helmet", [], "legendary", true);
        var trinket = new item(3, "Tower of Soph", "./images/gear/trinket/1.png", "trinket", [], "epic", true);
        var weapon = new item(4, "exalibur", "./images/gear/weapon/axe/mithril.png", "weapon", [0.8, 30], "legendary", true);
        var body = new item(5, "Trovakia", "./images/gear/body/8.png", "body", [0.8, 30], "epic", true);
        var shield = new item(6, "Anarath", "./images/gear/shields/4.png", "shield", [], "legendary", true);
        
        var mithril = new item(7, "Mithril", "./images/gear/weapon/axe/mithril.png", "weapon", [0.8, 60], "epic", false);
        var gandir = new item(8, "Gandir", "./images/gear/weapon/axe/poison.png", "weapon", [0.8, 80], "legendary", false);
        var steel2 = new item(10, "Steel", "./images/gear/weapon/axe/steel.png", "weapon", [0.8, 30], "common", false);
        var steel3 = new item(11, "Steel", "./images/gear/weapon/axe/steel.png", "weapon", [0.8, 30], "common", false);
        var socks = new item(12, "socks", "./images/gear/Boots/Bronze.png", "boots", [0.8, 30], "common", false);

        var mithril1 = new item(13, "Mithril", "./images/gear/weapon/axe/mithril.png", "weapon", [0.8, 60], "epic", false);
        var gandir1 = new item(14, "Gandir", "./images/gear/weapon/axe/poison.png", "weapon", [0.8, 80], "legendary", false);
        var steel4 = new item(15, "Steel", "./images/gear/weapon/axe/steel.png", "weapon", [0.8, 30], "common", false);
        var steel5 = new item(16, "Steel", "./images/gear/weapon/axe/steel.png", "weapon", [0.8, 30], "common", false);
        var socks1 = new item(17, "socks", "./images/gear/Boots/Bronze.png", "boots", [0.8, 30], "common", false);
        this.itemList = [amulet, helmet, trinket, mithril, gandir, weapon, body, shield, steel2, steel3, socks, mithril1, gandir1, steel4, steel5, socks1];
    }
}