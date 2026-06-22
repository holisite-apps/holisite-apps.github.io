import { z } from "zod";

import { templateKeySchema } from "@/lib/config.schema";

export const storePlatformSchema = z.enum(["ios", "android"]);

export const fetchStatusSchema = z.discriminatedUnion("status", [
  z.object({
    slug: z.string().min(1),
    status: z.literal("ok"),
    platforms: z.array(storePlatformSchema).min(1),
  }),
  z.object({
    slug: z.string().min(1),
    status: z.literal("error"),
    error: z.string().min(1),
  }),
]);

export const manifestSchema = z.object({
  fetchedAt: z.string().datetime(),
  siteUrl: z.string().url(),
  apps: z.array(fetchStatusSchema),
  errors: z.array(fetchStatusSchema),
});

export const storeLinksSchema = z.object({
  ios: z
    .object({
      url: z.string().url(),
      appId: z.string().optional(),
      id: z.number().int().positive().optional(),
    })
    .optional(),
  android: z
    .object({
      url: z.string().url(),
      appId: z.string().min(1),
    })
    .optional(),
});

export const generatedAppDataSchema = z.object({
  slug: z.string().min(1),
  template: templateKeySchema,
  fetchedAt: z.string().datetime(),
  primarySource: storePlatformSchema,
  name: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  descriptionHtml: z.string().optional(),
  version: z.string().optional(),
  updatedAt: z.string().datetime().optional(),
  developer: z.string().optional(),
  category: z.string().optional(),
  rating: z
    .object({
      score: z.number().min(0).max(5),
      count: z.number().int().nonnegative(),
    })
    .optional(),
  releaseNotes: z.string().optional(),
  stores: storeLinksSchema,
  media: z.object({
    icon: z.string().optional(),
    screenshots: z.array(z.string()),
    headerImage: z.string().optional(),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string(),
    canonical: z.string().url(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    noindex: z.boolean().optional(),
  }),
  features: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
  valueProps: z.array(
    z.object({
      icon: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
  faq: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ),
  links: z.record(z.string(), z.string()),
  hasIos: z.boolean(),
  hasAndroid: z.boolean(),
});

export type FetchManifest = z.infer<typeof manifestSchema>;
export type GeneratedAppData = z.infer<typeof generatedAppDataSchema>;
