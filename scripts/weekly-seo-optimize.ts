#!/usr/bin/env npx tsx
import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

import { appsConfigSchema, type AppsConfig } from "../src/lib/config.schema";

const CONFIG_PATH = "apps.config.json";
const MAX_TERMS = 18;

function loadLocalEnv(path = ".env.local") {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf-8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    process.env[key] ??= value;
  }
}

type SeoUpdate = {
  slug: string;
  keywords?: string[];
  targetKeywords?: string[];
  relatedTerms?: string[];
  keywordIntro?: string;
};

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

function uniqueTerms(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

function mergeTerms(existing: string[] | undefined, incoming: string[] | undefined): string[] | undefined {
  const terms = uniqueTerms([...(existing ?? []), ...(incoming ?? [])]).slice(0, MAX_TERMS);
  return terms.length > 0 ? terms : undefined;
}

function buildSearchQueries(app: AppsConfig["apps"][number]): string[] {
  const seo = app.seo;
  const baseTerms = [
    app.name ?? app.slug,
    ...(seo?.targetKeywords ?? []),
    ...(seo?.relatedTerms ?? []),
  ].slice(0, 5);

  if (app.template === "shopping") {
    return [
      `${baseTerms.join(" ")} spreadsheet shopping agent competitors`,
      `${app.name ?? app.slug} Oopbuy Mulebuy CNFans Taobao Weidian 1688`,
    ];
  }

  return [
    `${baseTerms.join(" ")} Bible app competitors devotional prayer`,
    `${app.name ?? app.slug} YouVersion She Reads Truth Olive Tree Bible Gateway`,
  ];
}

async function searchSerpApi(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    return [];
  }

  const params = new URLSearchParams({
    engine: "google",
    q: query,
    api_key: apiKey,
    num: "5",
  });
  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`SerpAPI request failed for "${query}": ${response.status}`);
  }

  const data = (await response.json()) as {
    organic_results?: Array<{
      title?: string;
      link?: string;
      snippet?: string;
    }>;
  };

  return (data.organic_results ?? []).map((result) => ({
    title: result.title ?? "",
    url: result.link ?? "",
    snippet: result.snippet ?? "",
  }));
}

async function collectSearchContext(app: AppsConfig["apps"][number]): Promise<SearchResult[]> {
  const queries = buildSearchQueries(app);
  const results = await Promise.all(queries.map((query) => searchSerpApi(query)));
  return results.flat().filter((result) => result.title || result.snippet);
}

function fallbackSearchTerms(app: AppsConfig["apps"][number]): string[] {
  if (app.template === "shopping") {
    return [
      "Oopbuy spreadsheet",
      "Mulebuy spreadsheet",
      "CNFans spreadsheet",
      "Taobao finds",
      "Weidian finds",
      "1688 product links",
      "QC photos",
      "Sugargoo",
      "Superbuy",
      "CSSBUY",
      "AllChinaBuy",
    ];
  }

  if (app.template === "bible") {
    return [
      "YouVersion Bible app",
      "Olive Tree Bible",
      "Blue Letter Bible",
      "Bible Gateway",
      "Bible reading plans",
      "offline Bible",
      "daily Bible verse",
      "audio Bible",
    ];
  }

  return [
    "She Reads Truth",
    "YouVersion Bible app",
    "First 5 app",
    "Glorify app",
    "Daily Grace devotional",
    "Bible journaling app",
    "prayer plans",
    "daily devotional for women",
  ];
}

function buildSystemPrompt() {
  return [
    "You are an SEO assistant for a static app landing page site.",
    "Return only valid JSON.",
    "Do not claim affiliation with competitor brands.",
    "Do not use wording like official alternative, official Oopbuy, official YouVersion, or best replacement.",
    "Only suggest natural related search terms and a concise, user-facing keywordIntro.",
  ].join(" ");
}

function getOpenAiChatCompletionsUrl(): string {
  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1")
    .replace(/\/+$/, "");

  return `${baseUrl}/chat/completions`;
}

async function requestLlmUpdate(
  app: AppsConfig["apps"][number],
  searchResults: SearchResult[],
): Promise<SeoUpdate | undefined> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log(`Skipping ${app.slug}: OPENAI_API_KEY is not configured.`);
    return undefined;
  }

  const fallbackTerms = fallbackSearchTerms(app);
  const prompt = {
    app: {
      slug: app.slug,
      name: app.name,
      template: app.template,
      currentSeo: app.seo,
    },
    searchResults:
      searchResults.length > 0
        ? searchResults.slice(0, 10)
        : fallbackTerms.map((term) => ({ title: term, url: "", snippet: term })),
    task:
      "Suggest SEO updates for this app landing page. Return JSON with slug, keywords, targetKeywords, relatedTerms, keywordIntro. Keep arrays concise. Preserve app name and user intent. Competitor names are allowed only as related search terms or comparison context.",
  };

  const response = await fetch(getOpenAiChatCompletionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: JSON.stringify(prompt) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed for ${app.slug}: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return undefined;
  }

  const parsed = JSON.parse(content) as SeoUpdate;
  return parsed.slug === app.slug ? parsed : { ...parsed, slug: app.slug };
}

function sanitizeIntro(intro: string | undefined): string | undefined {
  if (!intro) {
    return undefined;
  }

  return intro
    .replace(/\bofficial\s+(Oopbuy|Mulebuy|CNFans|YouVersion|She Reads Truth|Olive Tree|Bible Gateway)\b/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function applySeoUpdate(app: AppsConfig["apps"][number], update: SeoUpdate) {
  const seo = app.seo ?? {};

  app.seo = {
    ...seo,
    keywords: mergeTerms(seo.keywords, update.keywords),
    targetKeywords: mergeTerms(seo.targetKeywords, update.targetKeywords),
    relatedTerms: mergeTerms(seo.relatedTerms, update.relatedTerms),
    keywordIntro: sanitizeIntro(update.keywordIntro) ?? seo.keywordIntro,
  };
}

async function main() {
  loadLocalEnv();

  const rawConfig = await readFile(CONFIG_PATH, "utf-8");
  const parsedConfig = appsConfigSchema.parse(JSON.parse(rawConfig));
  let changed = false;

  for (const app of parsedConfig.apps) {
    if (app.enabled === false) {
      continue;
    }

    console.log(`Optimizing SEO for ${app.slug}...`);
    const searchResults = await collectSearchContext(app);
    const update = await requestLlmUpdate(app, searchResults).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skipping ${app.slug}: ${message}`);
      return undefined;
    });

    if (update) {
      applySeoUpdate(app, update);
      changed = true;
    }
  }

  if (!changed) {
    console.log("No SEO updates generated.");
    return;
  }

  appsConfigSchema.parse(parsedConfig);
  await writeFile(CONFIG_PATH, `${JSON.stringify(parsedConfig, null, 2)}\n`);
  console.log("Updated apps.config.json with weekly SEO suggestions.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
