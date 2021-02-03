/* eslint-disable no-unused-vars */
"use strict";

const db = require("./server/db/database");
const {
  User,
  Challenge,
  PersonalChallenge,
  FriendChallenge,
  Friend,
} = require("./server/db");

const users = [
  {
    name: "Rachel",
    uid: "aaa",
    email: "rachel@mail.com",
  },
  {
    name: "Sam",
    uid: "bbb",
    email: "sam@mail.com",
  },
  {
    name: "Tom",
    uid: "ccc",
    email: "tom@mail.com",
  },
];

const challenges = [
  {
    title: "Totes McGotes",
    category: "waste",
    duration: 7,
    pointsPerDay: 1,
    type: "personal",
    badge: "./assets/bag-c",
    description: "Every time you go shopping, bring a reusable tote or bag.",
    tips:
      "A simple change of bringing your groceries and goods home in reusable grocery bags can help the planet is so many ways. Plastic bags are created with non-renewable resources and are likely to end up in as litter or in landfill forever. Although paper bags are easier to recycle, reducing your use of them can also save countless trees. When a reusable bag is made from materials that are quickly renewed like cotton or bamboo, the environment reaps the benefits and the bag can be reused many times over.",
  },
  {
    title: "Waste Warrior",
    category: "waste",
    duration: 5,
    pointsPerDay: 1,
    type: "personal",
    badge: "./assets/bottle-c",
    description:
      "Don't use any kind of single use plastics such as plastic bags, take out containers, cups, lids, bottles, straws or utensils.",
    tips:
      "Most of our plastic ends up in landfills, our oceans and waterways, and the environment. Plastics are not biodegradable so they slowly break down into smaller microplastics which are found almost everywhere, including Mount Everest! You can help change the fate of the world by not using single use plastics.",
  },

  {
    title: "Turnt Down For What",
    category: "energy",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/light-c",
    description:
      "Everytime you leave a room, turn off the lights! Don't leave any stray lights on.",
    tips:
      "Not only does turning off the lights save electricity and lower your utility bills, it can also help reduce carbon emission and other harmful greenhouse gases. The power plants that supply the electricity to your home use fossil fuels, which are a major contributor of air pollution. By turning off your lights, you reduce your electricity demand.",
  },
  {
    title: "Water Warrior",
    category: "water",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/shower-c",
    description: "Take shower for less than 5 minutes each day.",
    tips:
      "According to a 2016 water study, the average shower lasts for 7.8 minutes and uses 15.8 gallons per shower. Taking shorter showers can save many gallons of water minimize your carbon footprint by reducing the amount of energy needed to heat your water tank. So set a timer and cut your shower time down!",
  },
  {
    title: "Foot Soldiers",
    category: "transportation",
    duration: 14,
    pointsPerDay: 2,
    type: "friend",
    badge: "./assets/shoes-c",
    description:
      "Instead of taking a car - walk, bike or take public transportation.",
    tips:
      "You can greatly reduce transportation emissions by walking, biking and taking public transportation to reduce smog and CO2. Going on foot, bike or public transportation also helps to reduce noise pollution and congestion. You can also reap the benefits of increased health by going on foot or cycling, both of which are excellent choices for some physical activity.",
  },
  {
    title: "Foodie Friends",
    category: "food",
    duration: 7,
    pointsPerDay: 1,
    type: "friend",
    badge: "./assets/veg-c",
    description: "Make only meatless meals.",
    tips: "",
  },
  {
    title: "Power Down",
    category: "energy",
    duration: 10,
    pointsPerDay: 1,
    type: "personal",
    badge: "./assets/plug-c",
    description: "Unplug your computer and other large electronics at night.",
    tips: "",
  },
  {
    title: "No Drizzle, My Nizzle.",
    category: "water",
    duration: 5,
    pointsPerDay: 2,
    type: "friend",
    badge: "./assets/faucet-c",
    description: "Turn off the faucet while brushing your teeth.",
    tips: "",
  },
  {
    title: "BYOC",
    category: "waste",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/mug-c",
    description:
      "Bring your own resuable cup to your favorite cafe or make your own coffee or tea at home.",
    tips: "",
  },
  {
    title: "Home Cookin', Good Lookin'",
    category: "food",
    duration: 5,
    pointsPerDay: 3,
    type: "friend",
    badge: "./assets/meal-c",
    description:
      "Cook all your meals at home to reduce your use of takeout containters.",
    tips: "",
  },
  {
    title: "Compost",
    category: "food",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/apple-c",
    description:
      "Compost all your leftover food items such as non-greasy scraps, peels, tea bags, coffee grounds, eggshells and non-food items such egg cartons, newspapers, dried leaves, and old flowers. Leave out the dairy, oil, bones and meat from your compost bin. You can use any kind of container to hold your compost like a milk carton, bin or a paper/plastic bag in your freezer. At the end of the challenge, drop off the compost at a local collection area.",
    tips:
      "Organic waste in landfills generates a potent greenhouse gas called methane. By composting, methane emissions are significantly reduced and compost can help eliminate the need for chemical fertilizers.",
  },
  {
    title: "Carpool",
    category: "transportation",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/carpool-c",
    description:
      "If you must take a car, carpool! Everyone knows that pool parties are better anyways.",
    tips: "",
  },
];

function getallimagePath() {
  //find image path
}

async function seed() {
  await db.sync({ force: true });

  console.log("db synced!");

  try {
    // const users = await Promise.all([
    //   User.create({email: 'cody@email.com', password: '123'}),
    //   User.create({email: 'murphy@email.com', password: '123'}),
    // ])
    const allUsers = await Promise.all(
      users.map((user) => {
        return User.create(user);
      })
    );

    const allChallenges = await Promise.all(
      challenges.map((challenge) => {
        return Challenge.create(challenge);
      })
    );

    console.log(`seeded successfully`);
  } catch (error) {
    console.log("There was a problem seeding db: ", error.message);
  }
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}
