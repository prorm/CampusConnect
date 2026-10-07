const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Activity = require("../models/Activity");
const Feedback = require("../models/Feedback");
const Community = require("../models/Community");
const Announcement = require("../models/Announcement");
const data = require("./data");
const { sentimentFor } = require("../services/ai");

const models = [
  User,
  Event,
  Registration,
  Activity,
  Feedback,
  Community,
  Announcement,
];

/** Replaces every CampusConnect collection with the demo campus. */
async function seedDatabase() {
  await Promise.all(models.map((model) => model.deleteMany({})));
  await Promise.all(models.map((model) => model.syncIndexes()));

  const communities = new Map();
  for (const { proposedBy, ...community } of data.communities) {
    communities.set(community.slug, { community, proposedBy });
  }

  const users = new Map();
  for (const { key, joined = [], ...fields } of data.users) {
    const user = new User(fields);
    await user.setPassword(data.DEMO_PASSWORD);
    users.set(key, { user, joined });
  }

  const savedCommunities = new Map();
  for (const [slug, { community, proposedBy }] of communities) {
    savedCommunities.set(
      slug,
      await Community.create({
        ...community,
        proposedBy: proposedBy ? users.get(proposedBy).user._id : undefined,
      }),
    );
  }

  for (const { user, joined } of users.values()) {
    user.joined = joined.map((slug) => savedCommunities.get(slug)._id);
    await user.save();
  }

  const events = new Map();
  for (const event of data.events) {
    events.set(
      event.slug,
      await Event.create({ ...event, source: "seed" }),
    );
  }

  await Registration.insertMany(
    data.registrations.map((r) => ({
      user: users.get(r.user).user._id,
      event: events.get(r.event)._id,
      status: r.status,
    })),
  );

  await Activity.insertMany(
    Object.entries(data.activities).flatMap(([key, list]) =>
      list.map((activity) => ({ ...activity, user: users.get(key).user._id })),
    ),
  );

  await Feedback.insertMany(
    data.feedbacks.map((f) => ({
      ...f,
      user: users.get(f.user).user._id,
      sentiment: sentimentFor(f.rating),
    })),
  );

  await Announcement.create({
    text: data.announcement,
    author: users.get("ananya").user._id,
  });

  return { users: users.size, events: events.size };
}

async function seedIfEmpty() {
  if (await User.estimatedDocumentCount()) return false;
  await seedDatabase();
  return true;
}

module.exports = { seedDatabase, seedIfEmpty };

if (require.main === module) {
  const { connectDatabase, disconnectDatabase } = require("../config/db");
  (async () => {
    await connectDatabase();
    const result = await seedDatabase();
    console.log(
      `[seed] Demo campus ready: ${result.users} accounts, ${result.events} events. Password for every demo account: ${data.DEMO_PASSWORD}`,
    );
    await disconnectDatabase();
  })().catch(async (error) => {
    console.error(`[seed] ${error.message}`);
    await disconnectDatabase().catch(() => {});
    process.exitCode = 1;
  });
}
