import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FIXED: no leading slash
const inputPath = path.resolve(__dirname, "../assets/beastiary.json");
const outputPath = path.resolve(__dirname, "bestiary_randomized.json");

const LOOT_POOL = [
  "Monster Blood",
  "Monster Claw",
  "Monster Bone",
  "Monster Eye",
  "Monster Hide",
  "Rare Herb",
  "Vampire Fang",
  "Wraith Essence",
  "Specter Dust",
  "Ancient Relic",
  "Mutagen Sample",
  "Dark Crystal",
  "Ghost Essence",
  "Dragon Scale",
  "Essence of Death",
  "Alchemy Ingredient",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomLoot() {
  const count = randomInt(2, 4);
  const loot = [];
  const poolCopy = [...LOOT_POOL];

  for (let i = 0; i < count; i++) {
    if (poolCopy.length === 0) break;
    const idx = randomInt(0, poolCopy.length - 1);
    loot.push(poolCopy.splice(idx, 1)[0]);
  }
  return loot;
}

function randomVulnerability() {
  const signs = ["Igni", "Quen", "Yrden", "Aard", "Axii"];
  return signs[randomInt(0, signs.length - 1)];
}

function randomizeMonster(mon) {
  return {
    beastName: mon.beastName.trim(),
    imageUrl: mon.imageUrl,
    stats: {
      vitality: randomInt(1, 10),
      attack: randomInt(1, 10),
      defense: randomInt(1, 10),
      speed: randomInt(1, 10),
      intelligence: randomInt(1, 10),
    },
    signVulnerability: randomVulnerability(),
    loot: randomLoot(),
  };
}

function main() {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const monsters = JSON.parse(raw);

  const randomized = monsters.map(randomizeMonster);
  fs.writeFileSync(outputPath, JSON.stringify(randomized, null, 2), "utf-8");

  console.log(`Generated randomized bestiary: ${outputPath}`);
}

main();
