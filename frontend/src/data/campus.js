export const DEMO_DATE = "2026-10-07";
export const DEMO_NOW = 740;
export const student = {
  name: "Pranav R Mane",
  firstName: "Pranav",
  usn: "1MS24CI091",
  department: "Computer Science",
  interests: ["AI / ML", "Web development", "Hackathons"],
  year: 3,
};
export const timetable = [
  {
    id: "t1",
    title: "Computer networks",
    start: 540,
    end: 600,
    venue: "Block A · Room 204",
    date: DEMO_DATE,
  },
  {
    id: "t2",
    title: "Software engineering",
    start: 660,
    end: 740,
    venue: "Block A · Room 204",
    date: DEMO_DATE,
  },
  {
    id: "t3",
    title: "DBMS",
    start: 840,
    end: 900,
    venue: "Block C · Room 302",
    date: DEMO_DATE,
  },
  {
    id: "t4",
    title: "DBMS lab",
    start: 900,
    end: 1020,
    venue: "Computing Lab 2",
    date: DEMO_DATE,
  },
];
export const seedEvents = [
  {
    id: "agent",
    title: "Build your first AI agent",
    club: "CodeCraft",
    category: "Technology",
    date: DEMO_DATE,
    start: 765,
    end: 820,
    venue: "Innovation Lab",
    walk: 4,
    capacity: 100,
    registered: 89,
    waitlist: 0,
    tags: ["AI / ML", "Web development"],
    score: 94,
    color: "mint",
    art: "orbit",
    description:
      "From a blank editor to an agent that thinks, plans, and acts. A hands-on session with the CodeCraft community. Bring your laptop and your curiosity.",
    years: [1, 2, 3, 4],
    deadline: DEMO_DATE,
    friends: 8,
  },
  {
    id: "robot",
    title: "Robotics, beyond the basics",
    club: "Cognitive Minds",
    category: "Technology",
    date: DEMO_DATE,
    start: 825,
    end: 915,
    venue: "Robotics Lab 304",
    walk: 8,
    capacity: 40,
    registered: 36,
    waitlist: 0,
    tags: ["Robotics", "AI / ML"],
    score: 86,
    color: "violet",
    art: "cube",
    description:
      "Build an autonomous bot with computer vision and explore the ideas behind real-world robotics.",
    years: [2, 3, 4],
    deadline: DEMO_DATE,
    friends: 3,
  },
  {
    id: "resume",
    title: "Your resume, a little sharper",
    club: "Placement Collective",
    category: "Career",
    date: DEMO_DATE,
    start: 750,
    end: 780,
    venue: "Central Library",
    walk: 6,
    capacity: 30,
    registered: 18,
    waitlist: 0,
    tags: ["Career", "Leadership"],
    score: 81,
    color: "peach",
    art: "steps",
    description:
      "Bring your draft. Leave with actionable feedback from placement mentors and a better story.",
    years: [1, 2, 3, 4],
    deadline: DEMO_DATE,
    friends: 2,
  },
  {
    id: "hack",
    title: "HackMatrix: make something matter",
    club: "CodeCraft",
    category: "Hackathons",
    date: "2026-10-10",
    start: 540,
    end: 1080,
    venue: "APJ Innovation Centre",
    walk: 7,
    capacity: 120,
    registered: 120,
    waitlist: 6,
    tags: ["Hackathons", "AI / ML", "Web development"],
    score: 96,
    color: "blue",
    art: "wave",
    description:
      "A day of ideas, experiments, and building together. Teams of 2–4, mentor support, and a chance to turn a small spark into something useful.",
    years: [1, 2, 3, 4],
    deadline: DEMO_DATE,
    friends: 12,
  },
  {
    id: "music",
    title: "Unplugged under the stars",
    club: "Dhvani",
    category: "Culture",
    date: DEMO_DATE,
    start: 1050,
    end: 1140,
    venue: "Open-air Amphitheatre",
    walk: 5,
    capacity: 150,
    registered: 108,
    waitlist: 0,
    tags: ["Music", "Culture"],
    score: 72,
    color: "pink",
    art: "wave",
    description:
      "An evening of acoustic sets, original songs, and good company. No auditions. Just come as you are.",
    years: [1, 2, 3, 4],
    deadline: DEMO_DATE,
    friends: 6,
  },
  {
    id: "design",
    title: "Interfaces that feel alive",
    club: "Design Assembly",
    category: "Design",
    date: "2026-10-09",
    start: 780,
    end: 870,
    venue: "Design Studio · Block B",
    walk: 5,
    capacity: 50,
    registered: 32,
    waitlist: 0,
    tags: ["Design", "Web development"],
    score: 90,
    color: "violet",
    art: "orbit",
    description:
      "Explore interaction design, motion, and the details that turn functional interfaces into memorable experiences.",
    years: [1, 2, 3, 4],
    deadline: "2026-10-08",
    friends: 4,
  },
];
// The current break stops before a confirmed plan's walking buffer begins.
export function currentFreeWindow(events, registrations, now = DEMO_NOW) {
  const bookings = registrations
    .filter((r) => r.status === "registered")
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter(Boolean)
    .map((e) => ({
      ...e,
      type: "event",
      busyStart: e.start - e.walk,
      busyEnd: e.end + e.walk,
    }));
  const plans = [
    ...timetable.map((t) => ({
      ...t,
      type: "class",
      busyStart: t.start,
      busyEnd: t.end,
    })),
    ...bookings,
  ]
    .filter((p) => p.date === DEMO_DATE && p.busyEnd > now)
    .sort((a, b) => a.busyStart - b.busyStart);
  const active = plans.find((p) => p.busyStart <= now && p.busyEnd > now);
  const next = active || plans[0];
  const until = active ? now : next ? next.busyStart : 1080;
  return { minutes: Math.max(0, until - now), until, next, plans };
}
export const seedActivities = [
  {
    id: "past-web",
    title: "React from zero to shipped",
    club: "CodeCraft",
    date: "2026-09-24",
    skill: "Web development",
    attended: true,
    feedback: true,
  },
  {
    id: "past-ai",
    title: "A practical introduction to ML",
    club: "Cognitive Minds",
    date: "2026-09-18",
    skill: "AI / ML",
    attended: true,
    feedback: false,
  },
  {
    id: "past-team",
    title: "Build together: open-source sprint",
    club: "CodeCraft",
    date: "2026-09-12",
    skill: "Leadership",
    attended: true,
    feedback: true,
  },
];
export const communities = [
  {
    id: "code",
    name: "CodeCraft",
    category: "Technology",
    members: 245,
    color: "mint",
    art: "orbit",
    description:
      "For the ones who see an idea and open their editor. Build, break, and learn together.",
    tags: ["Web development", "Hackathons"],
  },
  {
    id: "mind",
    name: "Cognitive Minds",
    category: "Technology",
    members: 190,
    color: "violet",
    art: "cube",
    description:
      "Curious about intelligence? Explore machine learning, robotics, and what comes next.",
    tags: ["AI / ML", "Robotics"],
  },
  {
    id: "dhvani",
    name: "Dhvani",
    category: "Culture",
    members: 175,
    color: "pink",
    art: "wave",
    description:
      "Find your rhythm. A space for music, performance, and the occasional beautiful noise.",
    tags: ["Music", "Culture"],
  },
  {
    id: "design",
    name: "Design Assembly",
    category: "Design",
    members: 92,
    color: "peach",
    art: "steps",
    description:
      "People who ask “what if it felt better?” Make experiences that mean something.",
    tags: ["Design", "Web development"],
  },
];
export function clock(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
export function dateLabel(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
export function feasibility(event, registrations = [], events = seedEvents) {
  const conflicts = timetable.filter(
    (t) =>
      t.date === event.date &&
      event.start - event.walk < t.end &&
      event.end + event.walk > t.start,
  );
  const overlaps = registrations
    .filter((r) => r.status === "registered" && r.eventId !== event.id)
    .map((r) => events.find((e) => e.id === r.eventId))
    .filter(
      (e) =>
        e &&
        e.date === event.date &&
        event.start - event.walk < e.end &&
        event.end + event.walk > e.start,
    );
  const eligible = event.years.includes(student.year);
  const expired =
    event.deadline < DEMO_DATE ||
    (event.date === DEMO_DATE && event.start < DEMO_NOW);
  return {
    ok: !conflicts.length && !overlaps.length && eligible && !expired,
    conflicts,
    overlaps,
    eligible,
    expired,
    reason: expired
      ? "This opportunity has already started or closed."
      : !eligible
        ? "This event is not open to your year."
        : conflicts.length
          ? `Overlaps ${conflicts[0].title}, including walking time.`
          : overlaps.length
            ? `Overlaps your ${overlaps[0].title} registration.`
            : "Fits your timetable, including walking time.",
  };
}
export function recommendationReasons(event) {
  return [
    event.tags.some((t) => student.interests.includes(t))
      ? "Matches your interests"
      : "Explore something new",
    feasibility(event).ok
      ? "Fits your timetable"
      : "Timetable conflict to review",
    `${event.walk} min walk from your next block`,
    `${event.friends} peers attending`,
  ];
}
export function downloadFile(name, content, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function calendarFile(event) {
  const stamp = (m) =>
    `${event.date.replaceAll("-", "")}T${clock(m).replace(":", "")}00`;
  const escape = (s) =>
    s
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CampusConnect//Frontend Demo//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@campusconnect.demo`,
    "DTSTAMP:20261007T065000Z",
    `DTSTART;TZID=Asia/Kolkata:${stamp(event.start)}`,
    `DTEND;TZID=Asia/Kolkata:${stamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.venue)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
