import { z } from "zod";

/** URL-safe slug: lowercase alphanumeric segments separated by hyphens. */
export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slug must be lowercase alphanumeric with hyphens (no leading/trailing hyphen)",
  );

export const templateKeySchema = z.enum(["bible", "women-bible", "shopping"]);

export const valuePropIconSchema = z.enum([
  "wallet",
  "list",
  "bell",
  "book",
  "heart",
  "star",
  "shield",
  "sparkles",
]);

const urlNoTrailingSlash = z
  .string()
  .url("must be a valid URL")
  .refine((url) => !url.endsWith("/"), "must not have a trailing slash");

const optionalUrl = z.string().url().optional();

const mailtoOrUrl = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("mailto:") || z.string().url().safeParse(value).success,
    "must be a URL or mailto: link",
  );

const siteHomeValueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const siteHomeSchema = z
  .object({
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    intro: z.string().min(1),
    values: z.array(siteHomeValueSchema).max(3).optional(),
  })
  .optional();

const githubPagesSchema = z
  .object({
    repository: z.string().min(1),
    basePath: z.string(),
    customDomain: z.string().optional(),
  })
  .optional();

const trackingSchema = z
  .object({
    enabled: z.boolean().default(true),
    utmSource: z.string().min(1).default("holisite"),
    utmMedium: z.string().min(1).default("landing_page"),
    campaign: z.string().min(1).optional(),
    iosProviderToken: z.string().min(1).optional(),
  })
  .optional();

export const siteSchema = z.object({
  name: z.string().min(1),
  url: urlNoTrailingSlash,
  locale: z.string().min(2).default("en"),
  description: z.string().optional(),
  githubPages: githubPagesSchema,
  home: siteHomeSchema,
  tracking: trackingSchema,
});

export const templateMetaSchema = z.object({
  label: z.string().min(1),
  description: z.string().optional(),
});

export const iosStoreSchema = z
  .object({
    id: z.number().int().positive().optional(),
    appId: z.string().min(1).optional(),
    country: z.string().length(2).default("us"),
    lang: z.string().optional(),
  })
  .refine((store) => store.id != null || store.appId != null, {
    message: "stores.ios requires id or appId",
  });

export const androidStoreSchema = z.object({
  appId: z.string().min(1),
  country: z.string().length(2).default("us"),
  lang: z.string().default("en"),
});

export const storesSchema = z
  .object({
    ios: iosStoreSchema.optional(),
    android: androidStoreSchema.optional(),
  })
  .refine((stores) => stores.ios != null || stores.android != null, {
    message: "At least one of stores.ios or stores.android is required",
  });

export const seoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  keywords: z.array(z.string().min(1)).optional(),
  targetKeywords: z.array(z.string().min(1)).optional(),
  relatedTerms: z.array(z.string().min(1)).optional(),
  keywordIntro: z.string().min(1).optional(),
  canonical: optionalUrl,
  ogImage: z.string().min(1).optional(),
  noindex: z.boolean().optional(),
});

export const overridesSchema = z.object({
  tagline: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  descriptionHtml: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  screenshots: z.array(z.string().min(1)).optional(),
  rating: z
    .object({
      score: z.number().min(0).max(5),
      count: z.number().int().nonnegative(),
    })
    .optional(),
  developer: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  releaseNotes: z.string().min(1).optional(),
});

export const featureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const valuePropSchema = z.object({
  icon: valuePropIconSchema,
  title: z.string().min(1),
  description: z.string().min(1),
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const linksSchema = z.object({
  privacy: optionalUrl,
  terms: optionalUrl,
  support: mailtoOrUrl.optional(),
  website: optionalUrl,
});

export const appConfigSchema = z.object({
  slug: slugSchema,
  template: z.string().min(1),
  enabled: z.boolean().default(true),
  name: z.string().min(1).optional(),
  priority: z.number().int().optional(),
  stores: storesSchema,
  seo: seoSchema.optional(),
  tracking: trackingSchema,
  overrides: overridesSchema.optional(),
  features: z.array(featureSchema).optional(),
  valueProps: z.array(valuePropSchema).optional(),
  faq: z.array(faqSchema).optional(),
  links: linksSchema.optional(),
});

export const appsConfigSchema = z
  .object({
    site: siteSchema,
    templates: z.record(z.string(), templateMetaSchema).refine(
      (templates) =>
        templateKeySchema.options.every((key) => key in templates),
      {
        message: `templates must include keys: ${templateKeySchema.options.join(", ")}`,
      },
    ),
    apps: z.array(appConfigSchema).min(1),
  })
  .superRefine((config, ctx) => {
    const slugSet = new Set<string>();
    const templateKeys = new Set(Object.keys(config.templates));

    config.apps.forEach((app, index) => {
      if (slugSet.has(app.slug)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate slug: ${app.slug}`,
          path: ["apps", index, "slug"],
        });
      }
      slugSet.add(app.slug);

      if (!templateKeys.has(app.template)) {
        ctx.addIssue({
          code: "custom",
          message: `unknown template "${app.template}" — must be one of: ${[...templateKeys].join(", ")}`,
          path: ["apps", index, "template"],
        });
      }

      if (app.enabled !== false) {
        if (!app.stores.ios && !app.stores.android) {
          ctx.addIssue({
            code: "custom",
            message: "enabled app requires at least one store platform",
            path: ["apps", index, "stores"],
          });
        }
      }
    });
  });

export type AppsConfig = z.infer<typeof appsConfigSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export type SiteConfig = z.infer<typeof siteSchema>;
export type TemplateKey = z.infer<typeof templateKeySchema>;
