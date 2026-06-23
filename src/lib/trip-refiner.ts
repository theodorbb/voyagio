

import type {
  AvailableActivity,
  EditableActivity,
  EditableDay,
} from "@/components/trips/itinerary-editor";

const TIME_SLOTS = [
  { timeOfDay: "morning", start: "09:00" },
  { timeOfDay: "afternoon", start: "14:00" },
  { timeOfDay: "evening", start: "18:00" },
  { timeOfDay: "evening", start: "20:00" },
] as const;

function withTimes(activities: EditableActivity[]): EditableActivity[] {
  return activities.map((a, i) => {
    const slot = TIME_SLOTS[Math.min(i, TIME_SLOTS.length - 1)];
    return { ...a, timeOfDay: slot.timeOfDay, startTime: slot.start };
  });
}

function toEditable(a: AvailableActivity): EditableActivity {
  return { ...a, timeOfDay: null, startTime: null };
}

const OUTDOOR = new Set(["Adventure", "Nature", "Water Sports"]);
const INDOOR = new Set(["Cultural", "Food & Wine", "Wellness"]);
const WEATHER_SENSITIVE = new Set([
  "Adventure",
  "Water Sports",
  "Nature",
  "Photography",
]);
const DEMANDING = new Set(["Adventure", "Water Sports", "Nightlife"]);

export type GoalId =
  | "relaxed"
  | "cultural"
  | "romantic"
  | "cheaper"
  | "outdoor"
  | "weatherSafe"
  | "lessTravel"
  | "regenerateDay";

export type RefinementScope =
  | { type: "all" }
  | { type: "day"; day: number }
  | { type: "period"; period: "morning" | "afternoon" | "evening"; day?: number };

export interface WeatherInfo {
  condition: string;
  poor: boolean;
}

export interface ChangeEntry {
  day: number;
  type: "replaced" | "removed" | "added" | "reordered";
  from?: string;
  to?: string;
}

export interface RefineInput {
  days: EditableDay[];
  available: AvailableActivity[];
  goal: GoalId;
  scope: RefinementScope;
  paceTarget: number;
  weather?: WeatherInfo | null;
}

export interface RefineResult {
  days: EditableDay[];
  changes: ChangeEntry[];
  changed: boolean;
  summary: string;
  costBefore: number;
  costAfter: number;
}

interface GoalConfig {
  preferred: Record<string, number>;
  avoided: Set<string>;

  targetGroup?: Set<string>;
  densityDelta: number;
  preferCheaper: boolean;
  preferIndoor: boolean;
  minimizeTravel: boolean;
  regenerate: boolean;
}

const GOAL_CONFIG: Record<GoalId, GoalConfig> = {
  relaxed: {
    preferred: { Wellness: 6, "Food & Wine": 3, Cultural: 3, Photography: 1 },
    avoided: new Set(["Adventure", "Water Sports", "Nightlife"]),
    targetGroup: new Set(["Wellness", "Cultural", "Food & Wine"]),
    densityDelta: -1,
    preferCheaper: false,
    preferIndoor: false,
    minimizeTravel: false,
    regenerate: false,
  },
  cultural: {
    preferred: { Cultural: 7, Photography: 3, "Food & Wine": 2 },
    avoided: new Set(["Water Sports", "Adventure", "Nightlife"]),
    targetGroup: new Set(["Cultural", "Photography"]),
    densityDelta: 0,
    preferCheaper: false,
    preferIndoor: false,
    minimizeTravel: false,
    regenerate: false,
  },
  romantic: {
    preferred: { "Food & Wine": 6, Wellness: 4, Cultural: 3, Photography: 3 },
    avoided: new Set(["Nightlife", "Adventure"]),
    targetGroup: new Set(["Food & Wine", "Wellness", "Cultural", "Photography"]),
    densityDelta: 0,
    preferCheaper: false,
    preferIndoor: false,
    minimizeTravel: false,
    regenerate: false,
  },
  cheaper: {
    preferred: {},
    avoided: new Set(),
    densityDelta: 0,
    preferCheaper: true,
    preferIndoor: false,
    minimizeTravel: false,
    regenerate: false,
  },
  outdoor: {
    preferred: { Adventure: 6, Nature: 6, "Water Sports": 4, Photography: 3 },
    avoided: new Set(["Cultural", "Food & Wine", "Wellness"]),
    targetGroup: OUTDOOR,
    densityDelta: 0,
    preferCheaper: false,
    preferIndoor: false,
    minimizeTravel: false,
    regenerate: false,
  },
  weatherSafe: {
    preferred: { Cultural: 7, "Food & Wine": 5, Wellness: 4 },
    avoided: new Set(["Adventure", "Water Sports", "Nature", "Photography"]),
    targetGroup: INDOOR,
    densityDelta: 0,
    preferCheaper: false,
    preferIndoor: true,
    minimizeTravel: false,
    regenerate: false,
  },
  lessTravel: {
    preferred: {},
    avoided: new Set(),
    densityDelta: 0,
    preferCheaper: false,
    preferIndoor: false,
    minimizeTravel: true,
    regenerate: false,
  },
  regenerateDay: {
    preferred: {},
    avoided: new Set(),
    densityDelta: 0,
    preferCheaper: false,
    preferIndoor: false,
    minimizeTravel: false,
    regenerate: true,
  },
};

export interface GoalMeta {
  id: GoalId;
  label: string;
  hint: string;
}

export const GOALS: GoalMeta[] = [
  { id: "relaxed", label: "More Relaxed", hint: "Ease the pace, calmer days" },
  { id: "cultural", label: "More Cultural", hint: "Lean into heritage & art" },
  { id: "romantic", label: "More Romantic", hint: "Intimate, scenic moments" },
  { id: "cheaper", label: "Lower Budget", hint: "Trim cost, keep variety" },
  { id: "weatherSafe", label: "Weather Adaptation", hint: "Favor indoor plans" },
  { id: "outdoor", label: "More Outdoor", hint: "Active, open-air experiences" },
  { id: "lessTravel", label: "Reduce Travel", hint: "Keep stops closer together" },
  { id: "regenerateDay", label: "Regenerate Day", hint: "Fresh top-rated picks" },
];

function haversine(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function hasCoords(
  a: { latitude?: number | null; longitude?: number | null }
): a is { latitude: number; longitude: number } {
  return a.latitude != null && a.longitude != null;
}

function scoreActivity(
  a: AvailableActivity,
  config: GoalConfig,
  anchor?: { lat: number; lng: number }
): number {
  let score = config.preferred[a.category] ?? 0;
  score += (a.rating || 0) * 0.5;
  if (config.preferCheaper) score -= a.price * 0.03;
  if (config.preferIndoor) {
    if (INDOOR.has(a.category)) score += 3;
    if (WEATHER_SENSITIVE.has(a.category)) score -= 4;
  }
  if (config.minimizeTravel && anchor && hasCoords(a)) {
    score -= haversine(anchor.lat, anchor.lng, a.latitude, a.longitude) * 0.4;
  }
  return score;
}

function bestFromPool(
  pool: AvailableActivity[],
  config: GoalConfig,
  used: Set<string>,
  predicate: (a: AvailableActivity) => boolean,
  anchor?: { lat: number; lng: number }
): AvailableActivity | null {
  let best: AvailableActivity | null = null;
  let bestScore = -Infinity;
  for (const a of pool) {
    if (used.has(a.id) || !predicate(a)) continue;
    const s = scoreActivity(a, config, anchor);

    if (s > bestScore || (s === bestScore && best && a.id < best.id)) {
      best = a;
      bestScore = s;
    }
  }
  return best;
}

function dayAnchor(
  acts: EditableActivity[]
): { lat: number; lng: number } | undefined {
  const withGeo = acts.filter(hasCoords);
  if (withGeo.length === 0) return undefined;
  const lat =
    withGeo.reduce((s, a) => s + (a.latitude as number), 0) / withGeo.length;
  const lng =
    withGeo.reduce((s, a) => s + (a.longitude as number), 0) / withGeo.length;
  return { lat, lng };
}

function nearestNeighborOrder(acts: EditableActivity[]): EditableActivity[] {
  const geo = acts.filter(hasCoords);
  if (geo.length < 3) return acts;
  const remaining = [...acts];
  const ordered: EditableActivity[] = [];

  let current = remaining.shift() as EditableActivity;
  ordered.push(current);
  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const cand = remaining[i];
      if (hasCoords(current) && hasCoords(cand)) {
        const d = haversine(
          current.latitude as number,
          current.longitude as number,
          cand.latitude as number,
          cand.longitude as number
        );
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
    }
    current = remaining.splice(bestIdx, 1)[0];
    ordered.push(current);
  }
  return ordered;
}

function transformDay(
  day: EditableDay,
  config: GoalConfig,
  pool: AvailableActivity[],
  used: Set<string>,
  paceTarget: number,
  period: "morning" | "afternoon" | "evening" | null,
  changes: ChangeEntry[]
): EditableDay {
  let acts = [...day.activities];

  const effectivePeriod = (a: EditableActivity, i: number) =>
    a.timeOfDay ?? TIME_SLOTS[Math.min(i, TIME_SLOTS.length - 1)].timeOfDay;

  const inPeriod = (a: EditableActivity, i: number) =>
    !period || effectivePeriod(a, i) === period;

  if (config.regenerate) {
    const fresh: AvailableActivity[] = [];
    const cats = new Set<string>();
    const ranked = [...pool]
      .filter((a) => !used.has(a.id))
      .sort((a, b) => b.rating - a.rating || (a.id < b.id ? -1 : 1));
    for (const a of ranked) {
      if (fresh.length >= paceTarget) break;
      if (!cats.has(a.category)) {
        fresh.push(a);
        cats.add(a.category);
      }
    }
    for (const a of ranked) {
      if (fresh.length >= paceTarget) break;
      if (!fresh.includes(a)) fresh.push(a);
    }
    if (fresh.length > 0) {
      for (const old of acts) used.delete(old.id);
      for (const a of fresh) used.add(a.id);
      acts.forEach((old) =>
        changes.push({ day: day.dayNumber, type: "removed", from: old.title })
      );
      fresh.forEach((a) =>
        changes.push({ day: day.dayNumber, type: "added", to: a.title })
      );
      return { ...day, activities: withTimes(fresh.map(toEditable)) };
    }
    return { ...day, activities: withTimes(acts) };
  }

  const anchor = config.minimizeTravel ? dayAnchor(acts) : undefined;
  const maxReplacements = period ? 1 : 2;
  let replacements = 0;

  if (config.avoided.size > 0 || config.preferIndoor) {
    for (let i = 0; i < acts.length; i++) {
      if (replacements >= maxReplacements) break;
      const a = acts[i];
      if (!inPeriod(a, i)) continue;
      const isOffGoal =
        config.avoided.has(a.category) ||
        (config.preferIndoor && WEATHER_SENSITIVE.has(a.category));
      if (!isOffGoal) continue;
      const target = config.targetGroup;
      const replacement = bestFromPool(
        pool,
        config,
        used,
        (c) => (target ? target.has(c.category) : true),
        anchor
      );
      if (replacement) {
        used.delete(a.id);
        used.add(replacement.id);
        changes.push({
          day: day.dayNumber,
          type: "replaced",
          from: a.title,
          to: replacement.title,
        });
        acts[i] = toEditable(replacement);
        replacements++;
      }
    }
  }

  if (config.preferCheaper && acts.length > 0) {
    const order = acts
      .map((a, i) => ({ a, i }))
      .filter(({ a, i }) => inPeriod(a, i))
      .sort((x, y) => y.a.price - x.a.price);
    for (const { a, i } of order) {
      if (replacements >= maxReplacements) break;
      const replacement = bestFromPool(
        pool,
        config,
        used,
        (c) =>
          c.price < a.price * 0.8 &&
          (c.rating || 0) >= 3.8 &&
          c.id !== a.id
      );
      if (replacement) {
        used.delete(a.id);
        used.add(replacement.id);
        changes.push({
          day: day.dayNumber,
          type: "replaced",
          from: `${a.title} (€${a.price})`,
          to: `${replacement.title} (€${replacement.price})`,
        });
        acts[i] = toEditable(replacement);
        replacements++;
      }
    }
  }

  if (config.densityDelta < 0 && acts.length > 1) {
    const target = Math.max(1, acts.length + config.densityDelta);
    while (acts.length > target) {
      let dropIdx = -1;
      let dropRank = -Infinity;
      for (let i = 0; i < acts.length; i++) {
        const a = acts[i];
        const rank =
          (DEMANDING.has(a.category) ? 2 : 0) +
          (a.difficulty === "Challenging"
            ? 2
            : a.difficulty === "Moderate"
              ? 1
              : 0) +
          a.duration / 120;
        if (rank > dropRank) {
          dropRank = rank;
          dropIdx = i;
        }
      }
      if (dropIdx < 0) break;
      const removed = acts.splice(dropIdx, 1)[0];
      used.delete(removed.id);
      changes.push({
        day: day.dayNumber,
        type: "removed",
        from: removed.title,
      });
    }
  }

  if (config.minimizeTravel && acts.length >= 2) {
    const reordered = nearestNeighborOrder(acts);
    const orderChanged = reordered.some((a, i) => a.id !== acts[i].id);
    if (orderChanged) {
      acts = reordered;
      changes.push({ day: day.dayNumber, type: "reordered" });
    }
    const center = dayAnchor(acts);
    if (center && acts.length >= 3) {
      let farIdx = -1;
      let farDist = -Infinity;
      acts.forEach((a, i) => {
        if (hasCoords(a)) {
          const d = haversine(
            center.lat,
            center.lng,
            a.latitude as number,
            a.longitude as number
          );
          if (d > farDist) {
            farDist = d;
            farIdx = i;
          }
        }
      });
      if (farIdx >= 0 && farDist > 3) {
        const a = acts[farIdx];
        const replacement = bestFromPool(
          pool,
          config,
          used,
          (c) => hasCoords(c) && c.id !== a.id,
          center
        );
        if (
          replacement &&
          hasCoords(replacement) &&
          haversine(
            center.lat,
            center.lng,
            replacement.latitude,
            replacement.longitude
          ) <
            farDist * 0.7
        ) {
          used.delete(a.id);
          used.add(replacement.id);
          changes.push({
            day: day.dayNumber,
            type: "replaced",
            from: a.title,
            to: replacement.title,
          });
          acts[farIdx] = toEditable(replacement);
        }
      }
    }
  }

  const dayTouched = changes.some((c) => c.day === day.dayNumber);
  if (
    !dayTouched &&
    config.targetGroup &&
    Object.keys(config.preferred).length > 0 &&
    acts.length > 0
  ) {

    let weakIdx = -1;
    let weakScore = Infinity;
    acts.forEach((a, i) => {
      if (!inPeriod(a, i)) return;
      const s = scoreActivity(a, config, anchor);
      if (s < weakScore) {
        weakScore = s;
        weakIdx = i;
      }
    });
    if (weakIdx >= 0) {
      const a = acts[weakIdx];
      const replacement = bestFromPool(
        pool,
        config,
        used,
        (c) =>
          (config.targetGroup as Set<string>).has(c.category) &&
          c.id !== a.id &&
          scoreActivity(c, config, anchor) > weakScore + 1
      );
      if (replacement) {
        used.delete(a.id);
        used.add(replacement.id);
        changes.push({
          day: day.dayNumber,
          type: "replaced",
          from: a.title,
          to: replacement.title,
        });
        acts[weakIdx] = toEditable(replacement);
      }
    }
  }

  return { ...day, activities: withTimes(acts) };
}

function scopeLabel(scope: RefinementScope): string {
  if (scope.type === "day") return `Day ${scope.day}`;
  if (scope.type === "period") {
    const p = scope.period[0].toUpperCase() + scope.period.slice(1);
    return scope.day ? `${p} of day ${scope.day}` : `Every ${scope.period}`;
  }
  return "Your itinerary";
}

function buildSummary(
  goal: GoalId,
  scope: RefinementScope,
  changes: ChangeEntry[],
  weather: WeatherInfo | null | undefined,
  costBefore: number,
  costAfter: number
): string {
  const subject = scopeLabel(scope);
  const replaced = changes.filter((c) => c.type === "replaced").length;
  const removed = changes.filter((c) => c.type === "removed").length;
  const added = changes.filter((c) => c.type === "added").length;
  const reordered = changes.filter((c) => c.type === "reordered").length;
  const saved = Math.max(0, costBefore - costAfter);

  switch (goal) {
    case "relaxed":
      return `${subject} was adjusted to feel more relaxed by easing the pace${
        removed ? ` (removed ${removed} busier stop${removed > 1 ? "s" : ""})` : ""
      }${
        replaced
          ? ` and swapping in calmer cultural and wellness experiences`
          : ""
      }.`;
    case "cultural":
      return `${subject} was shifted toward more cultural and heritage experiences${
        replaced ? `, replacing ${replaced} activit${replaced > 1 ? "ies" : "y"} with curated cultural alternatives` : ""
      }.`;
    case "romantic":
      return `${subject} was tuned to feel more romantic with intimate dining and scenic moments${
        replaced ? `, swapping in ${replaced} more fitting experience${replaced > 1 ? "s" : ""}` : ""
      }.`;
    case "cheaper":
      return `${subject} was adjusted to reduce the estimated cost while preserving variety${
        saved > 0 ? `, saving about €${saved} per person` : ""
      }.`;
    case "outdoor":
      return `${subject} was rebalanced toward more outdoor and active experiences${
        replaced ? `, replacing ${replaced} indoor stop${replaced > 1 ? "s" : ""}` : ""
      }.`;
    case "weatherSafe":
      return `${subject} was adapted for ${
        weather?.condition ?? "uncertain"
      } conditions by prioritizing indoor cultural, food and wellness activities${
        replaced ? ` (${replaced} outdoor stop${replaced > 1 ? "s" : ""} replaced)` : ""
      }.`;
    case "lessTravel":
      return `${subject} was optimized to reduce travel between stops${
        reordered ? ` by reordering the day` : ""
      }${replaced ? ` and choosing a closer alternative` : ""}.`;
    case "regenerateDay":
      return `${subject} was rebuilt with a fresh selection of ${added} top-rated experience${
        added > 1 ? "s" : ""
      }.`;
    default:
      return `${subject} was refined.`;
  }
}

export function refine(input: RefineInput): RefineResult {
  const { days, available, goal, scope, paceTarget, weather } = input;
  const config = GOAL_CONFIG[goal];
  const changes: ChangeEntry[] = [];

  const result: EditableDay[] = days.map((d) => ({
    ...d,
    activities: d.activities.map((a) => ({ ...a })),
  }));

  const costBefore = result.reduce(
    (s, d) => s + d.activities.reduce((t, a) => t + a.price, 0),
    0
  );

  const inScope = (dayNumber: number) => {
    if (scope.type === "all") return true;
    if (scope.type === "day") return scope.day === dayNumber;
    return scope.day == null || scope.day === dayNumber;
  };

  const used = new Set(result.flatMap((d) => d.activities.map((a) => a.id)));
  const period = scope.type === "period" ? scope.period : null;

  for (let i = 0; i < result.length; i++) {
    if (!inScope(result[i].dayNumber)) continue;
    result[i] = transformDay(
      result[i],
      config,
      available,
      used,
      paceTarget,
      period,
      changes
    );
  }

  const costAfter = result.reduce(
    (s, d) => s + d.activities.reduce((t, a) => t + a.price, 0),
    0
  );

  const summary = buildSummary(
    goal,
    scope,
    changes,
    weather,
    costBefore,
    costAfter
  );

  return {
    days: result,
    changes,
    changed: changes.length > 0,
    summary,
    costBefore,
    costAfter,
  };
}

const WORD_NUMBERS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
};

const GOAL_KEYWORDS: Array<{ goal: GoalId; words: string[] }> = [
  {
    goal: "regenerateDay",
    words: ["regenerate", "rebuild", "redo", "refresh", "start over", "new plan", "different plan"],
  },
  {
    goal: "weatherSafe",
    words: ["rain", "rainy", "weather", "indoor", "storm", "wet", "bad weather"],
  },
  {
    goal: "cheaper",
    words: ["budget", "cheaper", "cheap", "afford", "save money", "less expensive", "lower cost", "lower budget", "spend less"],
  },
  {
    goal: "relaxed",
    words: ["relax", "relaxing", "chill", "calm", "slower", "slow down", "less busy", "easy", "lighter", "easier", "rest"],
  },
  {
    goal: "cultural",
    words: ["cultur", "museum", "history", "historic", "heritage", "art", "gallery", "monument"],
  },
  {
    goal: "romantic",
    words: ["romant", "romance", "honeymoon", "couple", "intimate", "date"],
  },
  {
    goal: "outdoor",
    words: ["outdoor", "outdoors", "outside", "nature", "hike", "hiking", "active", "adventur", "open air"],
  },
  {
    goal: "lessTravel",
    words: ["travel", "distance", "closer", "less movement", "less driving", "nearby", "commute", "reduce travel", "walking", "minimize travel"],
  },
];

export interface ParsedInstruction {
  goal: GoalId | null;
  scope: RefinementScope;
}

export function parseInstruction(
  text: string,
  dayCount: number,
  defaultScope: RefinementScope = { type: "all" }
): ParsedInstruction {
  const lower = ` ${text.toLowerCase()} `;

  let goal: GoalId | null = null;
  for (const { goal: g, words } of GOAL_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) {
      goal = g;
      break;
    }
  }

  let day: number | undefined;
  const numMatch = lower.match(/day\s+(\d+)/) || lower.match(/(\d+)(?:st|nd|rd|th)?\s+day/);
  if (numMatch) day = parseInt(numMatch[1], 10);
  if (day == null) {
    for (const [word, n] of Object.entries(WORD_NUMBERS)) {
      if (lower.includes(`day ${word}`) || lower.includes(`${word} day`)) {
        day = n;
        break;
      }
    }
  }
  if (day == null && lower.includes("last day")) day = dayCount;
  if (day != null && (day < 1 || day > dayCount)) day = undefined;

  let period: "morning" | "afternoon" | "evening" | undefined;
  if (lower.includes("morning")) period = "morning";
  else if (lower.includes("afternoon")) period = "afternoon";
  else if (lower.includes("evening") || lower.includes("night"))
    period = "evening";

  let scope: RefinementScope;
  if (period) scope = { type: "period", period, day };
  else if (day != null) scope = { type: "day", day };
  else scope = defaultScope;

  return { goal, scope };
}
