# <img alt="Logo" src="https://github.com/HavardPede/dissertation/blob/master/client/public/favicon.png" height="40px" /> CryptoWarrior
CryptoWarrior was my dissertation project for my Bachelor at Newcastle University. It is an application that was made to serve as a proof of concept; to display what is possible when storing game logic and game assets on a peer-to-peer network. 

## Game overview
Each user will have a character that can wear up to 6 different types of items at once; a necklace, a helmet, a talisman, a weapon, a set of body armour and a shield. These items can come in 1 of 4 rarities; common, rare, epic and legendary.
A user may combine and destroy 3 items of the same rarity (expect legendary), to have a chance of creating an item of 1 higher rarity. Users may at any point trade items between each other through an auction house.

<img alt="Image of CryptoWarrior" src="https://imgur.com/9QBXne1.png" width="70%" />

## Motivation

The project outlined 3 areas of concern with modern game development:
- How to safely store game files.
-	How to privately store game files.
-	How to keep a game and its logic transparent to its users.

The motivation for this project was to see how well a fully decentralised game would stand against these concerns, and discuss potential other drawbacks with such a solution.
A second agenda with this undertaking was to gain some knowledge with both JavaScript and ReactJS.

## Technology
I utilized ReactJS and the Ethereum blockchain to create this project. This was my first project using either of these tools.
<div style="display:flex;">
<img alt="Ethereum logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" height="100px" />
<img alt="ReactJS logo" src="https://www.metaltoad.com/sites/default/files/styles/large_personal_photo_870x500_/public/2020-05/react-js-blog-header.png?itok=VbfDeSgJ" height="100px" />
<img alt="Metamask logo" src="https://en.bitcoinwiki.org/upload/en/images/e/eb/Metamask.png" height="100px" />
 </div>
 
## How it works
There is currently no database, cache or local storage used to run this application. All that is required, is a machine to run an instance of this application, as well as a blockchain to point to. During my development process, I was using a local blockchain on [Ganache](https://www.trufflesuite.com/ganache). But any Ethereum blockchain would work with this, even the public Ethereum blockhain. However, this will quickly prove to be an expensive endevour.

Any and all events that would occur in the game, is stored on the blockchain on a Smart Contract. I used [Drizzle](https://www.trufflesuite.com/drizzle) to communicate between the application and my crypto wallet. As Drizzle is based on Redux, it has very similar behaviour.


<img alt="Architecture" src="https://imgur.com/eexrh0j.png" width="70%" />

## Outcomes
The consesus with this task was that games that uses blockchains for storage has the following 
**pros**
- Game events are stored transparently, which is a huge win.
- Surprisingly easy to develop.
- Opens the game to an investing market (as game assets can be viewed as an investment).
- A robust game that is as hard to hack as the blockchain it is based upon.

**cons**
- State-changing game interactions would be very slow (~15 seconds).
- Computation formulas would be public (for RNG elements etc).
