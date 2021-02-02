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
    badge: "./assets/bag",
    description: "Every time you go shopping, bring a reusable tote or bag",
  },
  {
    title: "Waste Warrior",
    category: "waste",
    duration: 5,
    pointsPerDay: 1,
    type: "personal",
    badge: "./assets/apple",
    description:
      "Don't use disposable or single use containers, bottles, utensils",
  },

  {
    title: "Turnt Down For What",
    category: "energy",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/light",
    description:
      "Everytime you leave a room, turn off the lights! Don't leave any stray lights on",
  },
  {
    title: "Water Warrior",
    category: "water",
    duration: 7,
    pointsPerDay: 2,
    type: "personal",
    badge: "./assets/drop",
    description: "Take shower for less than 5 minutes",
  },
  {
    title: "Foot Soldiers",
    category: "transportation",
    duration: 14,
    pointsPerDay: 2,
    type: "friend",
    badge: "./assets/cycle",
    description:
      "Instead of taking a car - walk, bike or take public transportation",
  },
  {
    title: "Foodie Friends",
    category: "food",
    duration: 7,
    pointsPerDay: 1,
    type: "friend",
    badge: "./assets/apple",
    description: "Make only meatless meals",
  },
  {
    title: "Power Down",
    category: "energy",
    duration: 10,
    pointsPerDay: 1,
    type: "personal",
    badge: "./assets/battery",
    description: "Unplug your computer and other large electronics at night",
  },
  {
    title: "No Drizzle, My Nizzle",
    category: "water",
    duration: 5,
    pointsPerDay: 2,
    type: "friend",
    badge: "./assets/water",
    description: "Turn off the faucet while brushing your teeth",
  },
];

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
