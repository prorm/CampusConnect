// Screens each role can open, in sidebar order, and where each role lands.
export const NAV = {
  student: ["today", "explore", "schedule", "poster", "passport", "communities"],
  coordinator: ["organizer", "explore", "poster", "communities"],
  admin: ["admin", "organizer", "explore", "communities"],
};
export const HOME = { student: "today", coordinator: "organizer", admin: "admin" };

// Sidebar icon and label for each screen.
export const PAGE_META = {
  today: ["sun", "My campus today"],
  explore: ["compass", "Discover"],
  schedule: ["calendar", "My schedule"],
  poster: ["poster", "Poster intelligence"],
  passport: ["passport", "Skill passport"],
  communities: ["users", "Communities"],
  organizer: ["grid", "Event workspace"],
  admin: ["shield", "Campus management"],
};
