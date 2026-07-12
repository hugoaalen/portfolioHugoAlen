import aboutData from "./about.json";
import educationData from "./education.json";
import experienceData from "./experience.json";
import profileData from "./profile.json";
import projectsData from "./projects.json";

export const AVAILABLE_PROJECT_TAGS = [
  "NEXT",
  "TAILWIND",
  "HTML",
  "CSS",
  "VANILLAJS",
  "BOOTSTRAP",
  "REACT",
  "SUPABASE",
  "ASTRO",
  "VITE",
  "TYPESCRIPT",
  "FIREBASE",
  "PHP",
  "ANGULAR",
  "MYSQL",
] as const;

export const PROJECT_STATUSES = ["published", "draft", "archived"] as const;
export const PROJECT_CATEGORIES = ["app", "website", "game", "tool", "design"] as const;

type Lang = "es" | "en";
type I18nText = Record<Lang, string>;
type ProjectTag = (typeof AVAILABLE_PROJECT_TAGS)[number];
type ProjectStatus = (typeof PROJECT_STATUSES)[number];
type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface EditableItem {
  id: string;
  order: number;
  visible: boolean;
}

export interface AboutParagraph extends EditableItem, I18nText {}

export interface TimelineItem extends EditableItem {
  date: I18nText;
  title: I18nText;
  company: string;
  link?: string;
}

export interface ExperienceItem extends TimelineItem {
  description: I18nText;
}

export interface Project extends EditableItem {
  featured: boolean;
  status: ProjectStatus;
  category: ProjectCategory;
  title: I18nText;
  description: I18nText;
  image: string;
  tags: ProjectTag[];
  github?: string;
  link?: string;
}

function fail(message: string): never {
  throw new Error(`[content] ${message}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${path} debe ser un texto no vacío`);
  }

  return value;
}

function assertNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(`${path} debe ser un número`);
  }

  return value;
}

function assertBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    fail(`${path} debe ser true o false`);
  }

  return value;
}

function assertI18n(value: unknown, path: string): I18nText {
  if (!isPlainObject(value)) {
    fail(`${path} debe tener textos es/en`);
  }

  return {
    es: assertString(value.es, `${path}.es`),
    en: assertString(value.en, `${path}.en`),
  };
}

function assertOptionalUrl(value: unknown, path: string): string | undefined {
  if (value == null || value === "") return undefined;

  const url = assertString(value, path);
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:")) {
    fail(`${path} debe empezar por http://, https:// o mailto:`);
  }

  return url;
}

function assertImagePath(value: unknown, path: string): string {
  const image = assertString(value, path);
  if (!image.startsWith("/")) {
    fail(`${path} debe ser una ruta pública que empiece por /`);
  }

  return image;
}

function assertEditableItem(value: Record<string, unknown>, path: string): EditableItem {
  return {
    id: assertString(value.id, `${path}.id`),
    order: assertNumber(value.order, `${path}.order`),
    visible: assertBoolean(value.visible, `${path}.visible`),
  };
}

function assertUniqueIds(items: EditableItem[], collection: string) {
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      fail(`${collection} tiene el id repetido "${item.id}"`);
    }

    ids.add(item.id);
  }
}

function byOrder<T extends EditableItem>(items: T[]): T[] {
  return [...items]
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
}

function parseAbout(value: unknown): AboutParagraph[] {
  if (!Array.isArray(value)) fail("about.json debe ser una lista");

  const items = value.map((raw, index) => {
    if (!isPlainObject(raw)) fail(`about[${index}] debe ser un objeto`);

    return {
      ...assertEditableItem(raw, `about[${index}]`),
      ...assertI18n(raw, `about[${index}]`),
    };
  });

  assertUniqueIds(items, "about.json");
  return byOrder(items);
}

function parseEducation(value: unknown): TimelineItem[] {
  if (!Array.isArray(value)) fail("education.json debe ser una lista");

  const items = value.map((raw, index) => {
    if (!isPlainObject(raw)) fail(`education.json[${index}] debe ser un objeto`);

    return {
      ...assertEditableItem(raw, `education.json[${index}]`),
      date: assertI18n(raw.date, `education.json[${index}].date`),
      title: assertI18n(raw.title, `education.json[${index}].title`),
      company: assertString(raw.company, `education.json[${index}].company`),
      link: assertOptionalUrl(raw.link, `education.json[${index}].link`),
    };
  });

  assertUniqueIds(items, "education.json");
  return byOrder(items);
}

function parseExperience(value: unknown): ExperienceItem[] {
  const collection = "experience.json";
  if (!Array.isArray(value)) fail(`${collection} debe ser una lista`);

  const items = value.map((raw, index) => {
    if (!isPlainObject(raw)) fail(`${collection}[${index}] debe ser un objeto`);

    const item: ExperienceItem = {
      ...assertEditableItem(raw, `${collection}[${index}]`),
      date: assertI18n(raw.date, `${collection}[${index}].date`),
      title: assertI18n(raw.title, `${collection}[${index}].title`),
      company: assertString(raw.company, `${collection}[${index}].company`),
      link: assertOptionalUrl(raw.link, `${collection}[${index}].link`),
      description: assertI18n(raw.description, `${collection}[${index}].description`),
    };

    return item;
  });

  assertUniqueIds(items, collection);
  return byOrder(items);
}

function parseProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) fail("projects.json debe ser una lista");

  const items = value.map((raw, index) => {
    if (!isPlainObject(raw)) fail(`projects[${index}] debe ser un objeto`);
    if (!Array.isArray(raw.tags)) fail(`projects[${index}].tags debe ser una lista`);

    const tags = raw.tags.map((tag, tagIndex) => {
      const tagName = assertString(tag, `projects[${index}].tags[${tagIndex}]`);
      if (!AVAILABLE_PROJECT_TAGS.includes(tagName as ProjectTag)) {
        fail(`projects[${index}].tags[${tagIndex}] usa "${tagName}", que no existe`);
      }

      return tagName as ProjectTag;
    });

    const status = assertString(raw.status, `projects[${index}].status`);
    if (!PROJECT_STATUSES.includes(status as ProjectStatus)) {
      fail(`projects[${index}].status debe ser published, draft o archived`);
    }

    const category = assertString(raw.category, `projects[${index}].category`);
    if (!PROJECT_CATEGORIES.includes(category as ProjectCategory)) {
      fail(`projects[${index}].category debe ser app, website, game, tool o design`);
    }

    return {
      ...assertEditableItem(raw, `projects[${index}]`),
      featured: assertBoolean(raw.featured, `projects[${index}].featured`),
      status: status as ProjectStatus,
      category: category as ProjectCategory,
      title: assertI18n(raw.title, `projects[${index}].title`),
      description: assertI18n(raw.description, `projects[${index}].description`),
      image: assertImagePath(raw.image, `projects[${index}].image`),
      tags,
      github: assertOptionalUrl(raw.github, `projects[${index}].github`),
      link: assertOptionalUrl(raw.link, `projects[${index}].link`),
    };
  });

  assertUniqueIds(items, "projects.json");
  return byOrder(items).filter((project) => project.status === "published");
}

export const profile = profileData;
export const about = parseAbout(aboutData);
export const education = parseEducation(educationData);
export const experience = parseExperience(experienceData);
export const projects = parseProjects(projectsData);
