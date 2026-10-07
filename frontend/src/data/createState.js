import { seedEvents, seedActivities } from "./campus.js";

export function createDemoState() {
  return {
    version: 1,
    events: structuredClone(seedEvents),
    registrations: [],
    activities: structuredClone(seedActivities),
    joined: ["code", "mind"],
    announcement:
      "HackMatrix registration closes tonight. Your next big idea could start here.",
    proposals: [
      {
        id: "photo",
        name: "Shutter Society",
        description:
          "A community for campus photography and visual storytelling.",
      },
    ],
  };
}
