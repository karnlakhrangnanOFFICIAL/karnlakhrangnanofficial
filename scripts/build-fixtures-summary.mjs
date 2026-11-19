import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data/fixtures.json");
const outputPath = path.join(root, "data/fixtures-men-summary.json");

const cardFields = [
  "id",
  "date",
  "time",
  "time_th",
  "time_uk",
  "season",
  "competition",
  "competition_name",
  "competition_short",
  "competition_logo",
  "home_team",
  "home_logo",
  "away_team",
  "away_logo",
  "venue",
  "channels",
  "status",
  "home_score",
  "away_score",
  "home_pen_score",
  "away_pen_score",
  "result",
  "goals",
  "team_type",
  "round",
  "matchday",
  "ha",
];

export function buildMenFixturesSummary() {
  const fixtures = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const menFixtures = fixtures
    .filter((match) => match.team_type === "M")
    .map((match) => {
      const summary = {};
      for (const field of cardFields) {
        if (Object.hasOwn(match, field)) summary[field] = match[field];
      }
      return summary;
    });

  const output = JSON.stringify(menFixtures);
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(
    `[Build] Men match-card data: ${menFixtures.length} matches, ${Buffer.byteLength(output)} bytes`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildMenFixturesSummary();
}
