const EXPECTED_PROPERTIES = ['species', 'weight', 'height', 'diet', 'where', 'when', 'fact'];

//Type definitions
/**
 * An animal
 * @typedef {Object} Animal
 * @property {number} weight - Weight in lbs
 * @property {number} height - Height in feet
 * @property {string} diet - herbivore, carnivore, omnivore
 */


/**
 * A Human
 * @typedef {Animal} Human
 * @property {string} name - Name from form field
 */


/**
 * A Dino
 * @typedef {Animal} Dino
 * @property {string} species
 * @property {string} where - Where the Dinosaur lived
 * @property {string} when -  When the Dinosaur lived
 * @property {string} fact - Another fact about the species
 */

/**
 * All animals share 3 properties.
 * @param {Object} properties: Must include all in
 *     `weight`, `height`, `diet`
 * @returns {Animal}
 * @constructor
 */
const Animal = function(properties) {
    return {
        weight: properties.weight,
        height: properties.height,
        diet: properties.diet
    }
};

/**
 * A human is an Animal, with an additional name property
 * @param properties: Properties of human. Must include
 *     `weight`, `height`, `diet`, `name`
 * @returns {Human}
 */
const Human = function Human(properties){
    const {name, ...rest} = properties;
    return Object.assign( Animal(rest), {name});
}

// Create Dino Constructor
/**
 * A dinosaur is an Animal with 4 additional properties
 * @param {Object} properties: Properties of Dinosaur. Must include
 *     `species`, `weight`, `height`, `diet`, `where`, `when`, `fact`
 * @returns {Dino}
 * @constructor
 */
const Dino = function Dino(properties){
    // Check all required fields are there
    EXPECTED_PROPERTIES.forEach(value => {
        if (!Object.prototype.hasOwnProperty.call(properties, value)){
            throw Error(`Missing required Dinosaur property: ${value}`);
        }
    })
    const {species, where, when, fact, ...rest} = properties

    return Object.assign(Animal(rest), {
            species,
            where,
            when,
            fact,
        });
}

// Create Dino Compare Methods 1 to 3
// NOTE: Weight in JSON file is in lbs, height in inches.
// These functions can be applied between any Animal instance, in any order
/**
 * Provides a string synthesizing comparison of two Animal instances' weight
 * @param {Animal} animal Animal with whom to compare weights
 * @returns {string} Comparison
 */
const compareWeights = function(animal){
    const diff = animal.weight - this.weight;
    if (diff > 0){
        return `At ${this.weight} lbs, I am about `+
               `${Math.round(100 * (animal.weight - this.weight)/animal.weight)}% ` +
               `lighter than you`;
    }
    if (diff < 0) {
        return `At ${this.weight} lbs, I am about ` +
               `${Math.round(100 * (this.weight - animal.weight) / animal.weight)}% ` +
               `heavier than you`;
    }
     return `We have the exact same weight!`;
}

/**
 * Provides a string synthesizing comparison of two Animal instances' height
 * @param {Animal} animal Animal with whom to compare heights
 * @returns {string} Comparison
 */
const compareHeights = function (animal){
    const diff = animal.height - this.height;
    if (diff > 0) {
        return `At ${(this.height / 12).toFixed(2)} feet, I am about ` +
               `${Math.round(100 * (animal.height - this.height) / animal.height)}% ` +
               `smaller than you`;
    }
    if (diff < 0) {
        return `At ${(this.height / 12).toFixed(2)} feet, I am about ` +
               `${Math.round(100 * (this.height - animal.height) / animal.height)}% ` +
               `taller than you`;
    }
    return `We have the exact same height!`;
}

/**
 * Provides a string synthesizing comparison of two Animal instances' diet
 * @param {Animal} animal Animal with whom to compare diets
 * @returns {string} Comparison
 */
const compareDiet = function (animal){
    if (this.diet !== 'herbivore' && animal.diet === 'herbivore') {
        return 'Really, you don\'t eat meat ?';
    }
    if (this.diet === 'herbivore' && animal.diet !== 'herbivore') {
        return 'I think you shouldn\'t eat meat, you know.';
    }
    if (this.diet !== 'carnivore' && animal.diet === 'carnivore') {
        return 'I think you should try some vegetables, you know !';
    }
    if (this.diet === 'carnivore' && animal.diet !== 'carnivore') {
        return 'Why do you waste your appetite on vegetables ?';
    }
    return 'We like the same food !';
}

// Generate Tiles for each Dino in Array
/**
 * Takes tile content and generates HTML.
 * @param {string} caption The tile label to be displayed, species or human name.
 * @param {string} [fact] Fact to render.
 * @param {string} [image] image file name (in images directory) if different.
 *      from caption.
 * @returns {string} Tile HTML content.
 */
const generateTileHTML = function (caption, fact, image){
    image = image || caption;
    fact = fact || null;
    return `<div class="grid-item">
                <h3>${caption}</h3>
                <img src="images/${image}.png" alt="${caption} image"/>
                ${fact ? '<p>'+ fact +'</p>':''}
            </div>`;
}


/**
 * Provides the grid item HTML for any tile.
 * @param {Human} human Human with whom to compare the dinosaur or to display.
 * @param {Dino} [other] Dinosaur with whom to compare human (if dinosaur tile).
 * @returns {string} Tile HTML content.
 */
const getTileHTML = function(human, other) {
    if (arguments.length!==2) {
        return generateTileHTML(human.name, '', 'human');
    }
    if (other.species === 'Pigeon') {
        return generateTileHTML('Pigeon', other.fact);
    }

    const facts = [
        `Location: ${other.where}`,
        `When I lived: ${other.when}`,
        other.fact,
        compareDiet.call(other, human),
        compareHeights.call(other, human),
        compareWeights.call(other, human)
    ];
    const fact = facts[Math.round(Math.random() * 5)];
    return generateTileHTML(other.species, fact);
}


/**
 * Adds tiles to DOM
 * @param {Human} human
 */
function addTiles(human){
    const grid = document.getElementById('grid');
    for (let i=0; i<4; i++) {
        grid.innerHTML += getTileHTML(human, dinos[i]);
    }
    grid.innerHTML += getTileHTML(human);
    for (let i=4; i<8; i++) {
        grid.innerHTML += getTileHTML(human, dinos[i]);
    }
}


/**
 * Hides the form
 */
const removeForm = function (){
    document.getElementById('dino-compare').style.display= 'none';
}

/**
 * Reads the`feet` and `inches` form fields and returns the sum in inches.
 * @returns {number}
 */
const getHumanSizeInches = function(){
    const feet = document.getElementById('feet');
    const inches = document.getElementById('inches');
    return parseFloat(inches.value) + parseInt(feet.value) * 12;
}

// Create Dino Objects
const dinos = [];
data.Dinos.forEach(value => {
    dinos.push(Dino(value));
});


// On button click, prepare and display infographic
/**
 * Reads the form to create human, hides it and replace with Dino grid.
 */
const showTiles = function(){
    // Collect form data to generate human object
    const human = Human({
        name: document.getElementById('name').value,
        height: getHumanSizeInches(),
        weight: parseFloat(document.getElementById('weight').value),
        diet: document.getElementById('diet').value
    });
    removeForm();
    addTiles(human);
}