// Campus intelligence. Uses Claude when ANTHROPIC_API_KEY is configured and
// falls back to deterministic, rule-based logic otherwise, so every feature
// works without a key.
const { Anthropic } = require("@anthropic-ai/sdk");
const env = require("../config/env");
const { clock, feasibility, freeWindow } = require("./schedule");
const { HttpError } = require("../utils/http");

let client = null;
function claude() {
  if (!env.anthropicApiKey) return null;
  client ??= new Anthropic({ apiKey: env.anthropicApiKey, maxRetries: 1 });
  return client;
}

const aiStatus = () => ({
  enabled: Boolean(env.anthropicApiKey),
  model: env.anthropicApiKey ? env.aiModel : null,
});

/** One structured-output call; returns parsed JSON matching `schema`. */
async function structured({ system, messages, schema, effort = "low" }) {
  const response = await claude().beta.messages.create({
    model: env.aiModel,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages,
    output_config: { effort, format: { type: "json_schema", schema } },
  });
  if (response.stop_reason === "refusal")
    throw new HttpError(422, "The assistant declined this request.");
  if (response.stop_reason === "max_tokens")
    throw new HttpError(502, "The assistant's answer was cut off. Try again.");
  const block = response.content.find((b) => b.type === "text");
  return JSON.parse(block.text);
}

function describeApiError(error) {
  if (error instanceof Anthropic.AuthenticationError)
    return "The configured ANTHROPIC_API_KEY was rejected.";
  if (error instanceof Anthropic.RateLimitError)
    return "The AI service is busy. Try again in a moment.";
  if (error instanceof Anthropic.APIConnectionError)
    return "The AI service could not be reached.";
  if (error instanceof Anthropic.APIError)
    return `The AI service returned an error (${error.status}).`;
  return null;
}

// ---------------------------------------------------------------- assistant

function ruleBasedReply(question, ctx) {
  const q = question.toLowerCase();
  const { state, profile } = ctx;
  const fit = (e) =>
    feasibility(e, state.registrations, state.events, profile).ok;
  const free = freeWindow(state.events, state.registrations, profile.timetable);
  if (/passport|skill|certificate|resume/.test(q)) {
    const skills = [...new Set(state.activities.map((a) => a.skill))];
    return {
      reply: `Your passport holds ${state.activities.length} verified ${state.activities.length === 1 ? "activity" : "activities"}${skills.length ? ` across ${skills.join(", ")}` : ""}. Each check-in by a coordinator adds an experience and unlocks a certificate.`,
      eventId: "",
    };
  }
  if (/waitlist|full|queue/.test(q)) {
    const full = state.events
      .filter((e) => e.registered >= e.capacity)
      .sort((a, b) => b.waitlist - a.waitlist)[0];
    return full
      ? {
          reply: `${full.title} is full (${full.registered}/${full.capacity}) with ${full.waitlist} waiting. Join the queue and you'll get the next released seat in order — coordinators promote people automatically.`,
          eventId: full.id,
        }
      : {
          reply:
            "Nothing is full right now, so every open event still has seats.",
          eventId: "",
        };
  }
  if (/friend|together|classmate/.test(q))
    return {
      reply:
        "I can see your timetable, but not your friends' schedules, so I can't confirm a shared free period. Share an event with them and compare plans.",
      eventId: "",
    };
  const tagMatch = (e) =>
    /\bai\b|ml|machine/.test(q)
      ? e.tags.includes("AI / ML")
      : /hack/.test(q)
        ? e.tags.includes("Hackathons")
        : /design/.test(q)
          ? e.category === "Design"
          : /music|culture/.test(q)
            ? e.category === "Culture"
            : /career|resume|placement/.test(q)
              ? e.category === "Career"
              : null;
  const wantsBreak = /break|free|now|today|between/.test(q);
  const pool = state.events.filter((e) => {
    const match = tagMatch(e);
    if (match === false) return false;
    if (!fit(e)) return false;
    if (match === null || wantsBreak)
      return (
        e.date === env.demoDate &&
        e.start >= env.demoNow &&
        e.end + e.walk <= free.until
      );
    return true;
  });
  const best = pool.sort((a, b) => b.score - a.score)[0];
  if (best)
    return {
      reply: `${best.title} fits. It runs ${clock(best.start)}–${clock(best.end)} at ${best.venue}, a ${best.walk}-minute walk, with ${Math.max(0, best.capacity - best.registered)} seats left. ${feasibility(best, state.registrations, state.events, profile).reason}`,
      eventId: best.id,
    };
  return {
    reply: free.minutes
      ? `Nothing matching fits your ${free.minutes}-minute break before ${clock(free.until)}. Try Discover for later this week.`
      : "Your day is fully booked right now. Discover shows what's coming later this week.",
    eventId: "",
  };
}

function assistantContext({ state, profile }) {
  const free = freeWindow(state.events, state.registrations, profile.timetable);
  return {
    campus: "Ramaiah Institute of Technology",
    today: env.demoDate,
    now: clock(env.demoNow),
    student: {
      name: state.user.name,
      year: state.user.year,
      department: state.user.department,
      interests: state.user.interests,
    },
    freeTime: {
      minutes: free.minutes,
      until: clock(free.until),
      nextPlan: free.next?.title || null,
    },
    timetable: profile.timetable.map((c) => ({
      title: c.title,
      days: c.days,
      start: clock(c.start),
      end: clock(c.end),
    })),
    events: state.events.map((e) => {
      const fit = feasibility(e, state.registrations, state.events, profile);
      return {
        id: e.id,
        title: e.title,
        club: e.club,
        category: e.category,
        date: e.date,
        start: clock(e.start),
        end: clock(e.end),
        venue: e.venue,
        walkMinutes: e.walk,
        seatsLeft: Math.max(0, e.capacity - e.registered),
        waitlist: e.waitlist,
        tags: e.tags,
        fitsStudent: fit.ok,
        fitReason: fit.reason,
        studentStatus:
          state.registrations.find((r) => r.eventId === e.id)?.status || null,
      };
    }),
    passport: state.activities.map((a) => ({
      title: a.title,
      skill: a.skill,
      date: a.date,
    })),
  };
}

const ASSISTANT_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    eventId: { type: "string" },
  },
  required: ["reply", "eventId"],
  additionalProperties: false,
};

async function assistantReply(question, history, ctx) {
  if (!claude()) return { ...ruleBasedReply(question, ctx), source: "rules" };
  const context = assistantContext(ctx);
  const system = `You are the CampusConnect campus assistant for students at ${context.campus}. Help the student decide what to do on campus using only the JSON context below: their timetable, free time, events with precomputed fit checks, registrations, and skill passport. The fit checks already include class clashes, walking time, eligibility and deadlines, so rely on them rather than recomputing.

If the answer needs information that is not in the context, such as friends' schedules or off-campus details, say plainly that you don't have it. Write two to four warm, concrete sentences in plain text without markdown. When you recommend one specific event, put its id in eventId; otherwise set eventId to an empty string.

<context>
${JSON.stringify(context)}
</context>`;
  const messages = [...history, { role: "user", content: question }];
  try {
    const result = await structured({
      system,
      messages,
      schema: ASSISTANT_SCHEMA,
    });
    const known = ctx.state.events.some((e) => e.id === result.eventId);
    return {
      reply: result.reply,
      eventId: known ? result.eventId : "",
      source: "claude",
    };
  } catch (error) {
    const reason = describeApiError(error);
    if (!reason) throw error;
    if (!env.isTest) console.warn(`[ai] ${reason} Using rule-based reply.`);
    return { ...ruleBasedReply(question, ctx), source: "rules", notice: reason };
  }
}

// ------------------------------------------------------------ poster reader

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const toMinutes = (value) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

/** Normalises extracted poster fields into an event draft or explains gaps. */
function draftFromFields(fields) {
  const missing = [];
  if (!fields.title) missing.push("event name");
  if (!DATE.test(fields.date || "")) missing.push("date (YYYY-MM-DD)");
  if (!TIME.test(fields.start || "")) missing.push("start time (HH:MM)");
  if (!TIME.test(fields.end || "")) missing.push("end time (HH:MM)");
  if (!fields.venue) missing.push("venue");
  if (missing.length)
    throw new HttpError(422, `Couldn't find the ${missing.join(", ")}.`, {
      missing,
    });
  if (toMinutes(fields.end) <= toMinutes(fields.start))
    throw new HttpError(422, "The end time must be after the start time.");
  const years = (fields.years || [])
    .map(Number)
    .filter((y) => [1, 2, 3, 4].includes(y));
  const tags = (fields.tags || [])
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 5);
  const deadline =
    DATE.test(fields.deadline || "") && fields.deadline <= fields.date
      ? fields.deadline
      : fields.date;
  return {
    title: fields.title.slice(0, 100),
    club: (fields.club || "Campus community").slice(0, 60),
    category: (fields.category || "Technology").slice(0, 40),
    date: fields.date,
    start: toMinutes(fields.start),
    end: toMinutes(fields.end),
    deadline,
    venue: fields.venue.slice(0, 100),
    capacity: Math.min(5000, Math.max(1, Number(fields.capacity) || 60)),
    years: years.length ? [...new Set(years)].sort() : [1, 2, 3, 4],
    tags: tags.length ? tags : ["AI / ML"],
    description: (
      fields.description ||
      "Created from a poster. Confirm details with the organizer before you go."
    ).slice(0, 1000),
  };
}

function parsePosterText(text) {
  const values = Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter((line) => line.includes(":"))
      .map((line) => {
        const at = line.indexOf(":");
        return [
          line.slice(0, at).trim().toLowerCase(),
          line.slice(at + 1).trim(),
        ];
      }),
  );
  const list = (v) => (v ? v.split(",").map((s) => s.trim()) : []);
  return draftFromFields({
    title: values.event || values.title,
    club: values.club || values.host,
    category: values.category,
    date: values.date,
    start: values.start,
    end: values.end,
    venue: values.venue || values.location,
    deadline: values.deadline,
    capacity: values.capacity || values.seats,
    years: list(values.years),
    tags: list(values.tags),
    description: values.description,
  });
}

const POSTER_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    club: { type: "string" },
    category: {
      type: "string",
      enum: ["Technology", "Hackathons", "Design", "Culture", "Career", "Sports"],
    },
    date: { type: "string" },
    start: { type: "string" },
    end: { type: "string" },
    venue: { type: "string" },
    deadline: { type: "string" },
    capacity: { type: "integer" },
    years: { type: "array", items: { type: "integer" } },
    tags: { type: "array", items: { type: "string" } },
    description: { type: "string" },
  },
  required: [
    "title",
    "club",
    "category",
    "date",
    "start",
    "end",
    "venue",
    "deadline",
    "capacity",
    "years",
    "tags",
    "description",
  ],
  additionalProperties: false,
};

async function readPoster({ text, image }) {
  if (!image) return { draft: parsePosterText(text || ""), source: "rules" };
  if (!claude())
    throw new HttpError(
      422,
      "Reading poster images needs an ANTHROPIC_API_KEY on the server. Paste the poster text instead.",
    );
  const content = [
    {
      type: "image",
      source: { type: "base64", media_type: image.mediaType, data: image.data },
    },
    {
      type: "text",
      text: `Extract the campus event on this poster. Today is ${env.demoDate}; resolve dates without a year to the next occurrence and write them as YYYY-MM-DD. Write times in 24-hour HH:MM. Use an empty string for any field the poster doesn't show, 0 for an unknown capacity, and an empty list for unknown years of study (1–4) or tags. Keep tags short, like "AI / ML", "Hackathons", "Web development", "Robotics", "Design", "Music", "Career". Write a one or two sentence description using only what the poster says.${text ? `\n\nThe student also typed these notes from the poster:\n${text}` : ""}`,
    },
  ];
  try {
    const fields = await structured({
      messages: [{ role: "user", content }],
      schema: POSTER_SCHEMA,
      effort: "medium",
    });
    return { draft: draftFromFields(fields), source: "claude" };
  } catch (error) {
    const reason = describeApiError(error);
    if (reason) throw new HttpError(502, reason);
    throw error;
  }
}

// ---------------------------------------------------------- feedback digest

function sentimentFor(rating) {
  return rating >= 4 ? "positive" : rating <= 2 ? "constructive" : "neutral";
}

function ruleBasedSummary(feedbacks) {
  const avg =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  const positive = feedbacks.filter((f) => f.rating >= 4);
  const critical = feedbacks.filter((f) => f.rating <= 3);
  const quote = (f) =>
    f.comment.length > 110 ? `${f.comment.slice(0, 107)}…` : f.comment;
  return {
    summary: `${feedbacks.length} reflection${feedbacks.length === 1 ? "" : "s"} averaging ${avg.toFixed(1)}/5; ${Math.round((positive.length / feedbacks.length) * 100)}% positive.`,
    strengths: positive.slice(0, 3).map(quote),
    improvements: critical.slice(0, 3).map(quote),
  };
}

const SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "strengths", "improvements"],
  additionalProperties: false,
};

async function summarizeFeedback(feedbacks) {
  if (!feedbacks.length)
    return {
      summary: "No reflections yet.",
      strengths: [],
      improvements: [],
      source: "rules",
    };
  if (!claude()) return { ...ruleBasedSummary(feedbacks), source: "rules" };
  const lines = feedbacks
    .map((f) => `- [${f.rating}/5] ${f.title}: ${f.comment}`)
    .join("\n");
  try {
    const result = await structured({
      messages: [
        {
          role: "user",
          content: `Summarise these student reflections for the event coordinator. Give a one-sentence overall summary, up to three specific strengths, and up to three concrete improvements. Base every point on what students actually wrote; leave a list empty rather than inventing points.\n\n${lines}`,
        },
      ],
      schema: SUMMARY_SCHEMA,
    });
    return { ...result, source: "claude" };
  } catch (error) {
    if (!describeApiError(error)) throw error;
    return { ...ruleBasedSummary(feedbacks), source: "rules" };
  }
}

module.exports = {
  aiStatus,
  assistantReply,
  ruleBasedReply,
  readPoster,
  parsePosterText,
  summarizeFeedback,
  sentimentFor,
};
