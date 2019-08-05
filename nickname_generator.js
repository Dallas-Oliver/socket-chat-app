class NameGenerator {
  constructor() {
    adjectives = [
      "red",
      "bouncy",
      "tall",
      "quiet",
      "scary",
      "flippant",
      "excitable",
      "friendly",
      "brown"
    ];
    animals = [
      "aardvark",
      "baboon",
      "badger",
      "camel",
      "eagle",
      "clam",
      "penguin",
      "falcon",
      "gecko",
      "hedgehog"
    ];
  }
  static randomNickname() {
    let adj = this.adjectives[
      Math.floor(Math.random() * this.adjectives.length)
    ];

    let animal = this.animals[Math.floor(Math.random() * this.animals.length)];

    return `${adj}_${animal}`;
  }
}
