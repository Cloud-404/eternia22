import fs from "fs";
import path from "path";
import crypto from "crypto";

// Path to storage file
const DB_FILE = path.join(process.cwd(), "lib", "db-data.json");

// Types mimicking Prisma schema
export interface Admin {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readingTime: number;
  publishedAt: Date;
  status: string;
  featuredImage: string;
  isStory: boolean;
  timeline: string | null;
  copingStrategies: string | null;
  escalationExplanation: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  faqSchema: string | null;
  structuredData: string | null;
  categoryId: string;
  category: Category;
  tags: Tag[];
}

export interface Confession {
  id: string;
  content: string;
  status: string;
  campus: string | null;
  createdAt: Date;
}

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  options: string;
  isActive: boolean;
  createdAt: Date;
  responses: SurveyResponse[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  selectedOption: string;
  createdAt: Date;
  survey: Survey;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  metric: string;
  category: string;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  approved: boolean;
  createdAt: Date;
}

export interface Waitlist {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

// Define structure of the database
interface DatabaseState {
  admin: any[];
  category: any[];
  tag: any[];
  article: any[];
  confession: any[];
  survey: any[];
  surveyResponse: any[];
  achievement: any[];
  testimonial: any[];
  waitlist: any[];
}

function readData(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading JSON database:", err);
  }
  return {
    admin: [],
    category: [],
    tag: [],
    article: [],
    confession: [],
    survey: [],
    surveyResponse: [],
    achievement: [],
    testimonial: [],
    waitlist: [],
  };
}

function writeData(data: DatabaseState) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing JSON database:", err);
  }
}

function matchWhere(item: any, where: any): boolean {
  if (!where) return true;
  for (const key of Object.keys(where)) {
    const filter = where[key];
    if (filter && typeof filter === "object" && !Array.isArray(filter)) {
      if ("not" in filter) {
        if (item[key] === filter.not) return false;
      }
    } else {
      if (item[key] !== filter) return false;
    }
  }
  return true;
}

function applyOrderBy(items: any[], orderBy: any) {
  if (!orderBy) return items;
  const orderList = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...items].sort((a, b) => {
    for (const order of orderList) {
      const key = Object.keys(order)[0];
      const direction = order[key];
      const valA = a[key];
      const valB = b[key];
      if (valA === undefined || valB === undefined) continue;

      let comp = 0;
      if (valA instanceof Date || (typeof valA === "string" && !isNaN(Date.parse(valA)))) {
        comp = new Date(valA).getTime() - new Date(valB).getTime();
      } else if (typeof valA === "number" && typeof valB === "number") {
        comp = valA - valB;
      } else {
        comp = String(valA).localeCompare(String(valB));
      }

      if (direction === "desc") {
        comp = -comp;
      }
      if (comp !== 0) return comp;
    }
    return 0;
  });
}

function populateRelations(model: string, item: any, include: any, select: any, db: DatabaseState): any {
  if (!item) return item;
  const result = { ...item };

  const hasCategory = (include && include.category) || (select && select.category);
  const hasTags = (include && include.tags) || (select && select.tags);
  const hasResponses = (include && include.responses) || (select && select.responses);
  const hasSurvey = (include && include.survey) || (select && select.survey);

  if (model === "article") {
    if (hasCategory) {
      result.category = db.category.find((c) => c.id === item.categoryId) || null;
    }
    if (hasTags) {
      const tagIds = item.tagIds || [];
      result.tags = db.tag.filter((t) => tagIds.includes(t.id));
    }
  }

  if (model === "survey") {
    if (hasResponses) {
      result.responses = db.surveyResponse.filter((r) => r.surveyId === item.id);
    }
  }

  if (model === "surveyResponse") {
    if (hasSurvey) {
      result.survey = db.survey.find((s) => s.id === item.surveyId) || null;
    }
  }

  return result;
}

function applySelect(item: any, select: any): any {
  if (!item || !select) return item;
  const result: any = {};
  for (const key of Object.keys(select)) {
    const selectVal = select[key];
    if (selectVal === true) {
      result[key] = item[key];
    } else if (typeof selectVal === "object") {
      if (item[key] !== undefined) {
        if (Array.isArray(item[key])) {
          result[key] = item[key].map((subItem: any) => applySelect(subItem, selectVal.select || selectVal.include));
        } else {
          result[key] = applySelect(item[key], selectVal.select || selectVal.include);
        }
      }
    }
  }
  return result;
}

function convertDates(val: any, model: string): any {
  if (!val) return val;
  if (Array.isArray(val)) {
    return val.map((v) => convertDates(v, model));
  }
  const result = { ...val };
  const dateFields = ["createdAt", "updatedAt", "publishedAt"];
  for (const field of dateFields) {
    if (result[field] && typeof result[field] === "string") {
      result[field] = new Date(result[field]);
    }
  }

  if (result.category) {
    result.category = convertDates(result.category, "category");
  }
  if (result.tags) {
    result.tags = convertDates(result.tags, "tag");
  }
  if (result.responses) {
    result.responses = convertDates(result.responses, "surveyResponse");
  }
  return result;
}

function createItem(model: string, data: any, db: DatabaseState): any {
  const item: any = { ...data };
  if (!item.id) {
    item.id = crypto.randomUUID();
  }
  const now = new Date();
  if (
    model === "admin" ||
    model === "confession" ||
    model === "survey" ||
    model === "surveyResponse" ||
    model === "achievement" ||
    model === "testimonial" ||
    model === "waitlist"
  ) {
    if (!item.createdAt) item.createdAt = now;
  }
  if (model === "admin") {
    if (!item.updatedAt) item.updatedAt = now;
  }
  if (model === "article") {
    if (!item.publishedAt) item.publishedAt = now;
  }

  if (model === "article" && item.tags && item.tags.connect) {
    item.tagIds = item.tags.connect.map((c: any) => c.id);
    delete item.tags;
  }

  db[model as keyof DatabaseState].push(item);
  return item;
}

async function findMany(model: string, args?: any) {
  const db = readData();
  let list = db[model as keyof DatabaseState] || [];

  if (args?.where) {
    list = list.filter((item) => matchWhere(item, args.where));
  }

  if (args?.orderBy) {
    list = applyOrderBy(list, args.orderBy);
  }

  if (typeof args?.take === "number") {
    list = list.slice(0, args.take);
  }

  let results = list.map((item) => populateRelations(model, item, args?.include, args?.select, db));

  if (args?.select) {
    results = results.map((item) => applySelect(item, args.select));
  }

  return convertDates(results, model);
}

async function findUnique(model: string, args: any) {
  const db = readData();
  const list = db[model as keyof DatabaseState] || [];
  const item = list.find((item) => matchWhere(item, args.where)) || null;
  if (!item) return null;

  const populated = populateRelations(model, item, args?.include, args?.select, db);
  const result = applySelect(populated, args?.select);
  return convertDates(result, model);
}

async function findFirst(model: string, args?: any) {
  const db = readData();
  let list = db[model as keyof DatabaseState] || [];

  if (args?.where) {
    list = list.filter((item) => matchWhere(item, args.where));
  }

  if (args?.orderBy) {
    list = applyOrderBy(list, args.orderBy);
  }

  const item = list[0] || null;
  if (!item) return null;

  const populated = populateRelations(model, item, args?.include, args?.select, db);
  const result = applySelect(populated, args?.select);
  return convertDates(result, model);
}

async function count(model: string, args?: any) {
  const db = readData();
  let list = db[model as keyof DatabaseState] || [];
  if (args?.where) {
    list = list.filter((item) => matchWhere(item, args.where));
  }
  return list.length;
}

async function create(model: string, args: any) {
  const db = readData();
  const item = createItem(model, args.data, db);
  writeData(db);

  const populated = populateRelations(model, item, args?.include, args?.select, db);
  const result = applySelect(populated, args?.select);
  return convertDates(result, model);
}

async function update(model: string, args: any) {
  const db = readData();
  const list = db[model as keyof DatabaseState] || [];
  const where = args?.where;
  const data = args?.data;

  const idx = list.findIndex((item) => matchWhere(item, where));
  if (idx === -1) {
    throw new Error(`Record to update not found for ${model}`);
  }

  const updatedItem = { ...list[idx], ...data, updatedAt: new Date() };
  list[idx] = updatedItem;

  writeData(db);
  const populated = populateRelations(model, updatedItem, args?.include, args?.select, db);
  const result = applySelect(populated, args?.select);
  return convertDates(result, model);
}

async function updateMany(model: string, args: any) {
  const db = readData();
  const list = db[model as keyof DatabaseState] || [];
  const where = args?.where;
  const data = args?.data;
  let count = 0;

  const updatedList = list.map((item) => {
    if (matchWhere(item, where)) {
      count++;
      return { ...item, ...data, updatedAt: new Date() };
    }
    return item;
  });

  (db as any)[model] = updatedList;
  writeData(db);
  return { count };
}

async function deleteMany(model: string, args?: any) {
  const db = readData();
  const list = db[model as keyof DatabaseState] || [];
  const where = args?.where;
  const remaining = list.filter((item) => !matchWhere(item, where));
  const deletedCount = list.length - remaining.length;
  (db as any)[model] = remaining;
  writeData(db);
  return { count: deletedCount };
}

const prisma = {
  $disconnect: async () => {},
  $connect: async () => {},
  admin: {
    findUnique: (args: any) => findUnique("admin", args) as Promise<Admin | null>,
    deleteMany: (args?: any) => deleteMany("admin", args) as Promise<{ count: number }>,
    create: (args: any) => create("admin", args) as Promise<Admin>,
  },
  category: {
    findMany: (args?: any) => findMany("category", args) as Promise<Category[]>,
    findUnique: (args: any) => findUnique("category", args) as Promise<Category | null>,
    deleteMany: (args?: any) => deleteMany("category", args) as Promise<{ count: number }>,
    create: (args: any) => create("category", args) as Promise<Category>,
  },
  tag: {
    findMany: (args?: any) => findMany("tag", args) as Promise<Tag[]>,
    findUnique: (args: any) => findUnique("tag", args) as Promise<Tag | null>,
    deleteMany: (args?: any) => deleteMany("tag", args) as Promise<{ count: number }>,
    create: (args: any) => create("tag", args) as Promise<Tag>,
  },
  article: {
    findMany: (args?: any) => findMany("article", args) as Promise<Article[]>,
    findUnique: (args: any) => findUnique("article", args) as Promise<Article | null>,
    count: (args?: any) => count("article", args) as Promise<number>,
    deleteMany: (args?: any) => deleteMany("article", args) as Promise<{ count: number }>,
    create: (args: any) => create("article", args) as Promise<Article>,
  },
  confession: {
    findMany: (args?: any) => findMany("confession", args) as Promise<Confession[]>,
    create: (args: any) => create("confession", args) as Promise<Confession>,
    count: (args?: any) => count("confession", args) as Promise<number>,
    update: (args: any) => update("confession", args) as Promise<Confession>,
    deleteMany: (args?: any) => deleteMany("confession", args) as Promise<{ count: number }>,
  },
  survey: {
    findFirst: (args?: any) => findFirst("survey", args) as Promise<Survey | null>,
    findMany: (args?: any) => findMany("survey", args) as Promise<Survey[]>,
    findUnique: (args: any) => findUnique("survey", args) as Promise<Survey | null>,
    create: (args: any) => create("survey", args) as Promise<Survey>,
    update: (args: any) => update("survey", args) as Promise<Survey>,
    updateMany: (args: any) => updateMany("survey", args) as Promise<{ count: number }>,
    deleteMany: (args?: any) => deleteMany("survey", args) as Promise<{ count: number }>,
  },
  surveyResponse: {
    create: (args: any) => create("surveyResponse", args) as Promise<SurveyResponse>,
    count: (args?: any) => count("surveyResponse", args) as Promise<number>,
    deleteMany: (args?: any) => deleteMany("surveyResponse", args) as Promise<{ count: number }>,
  },
  achievement: {
    findMany: (args?: any) => findMany("achievement", args) as Promise<Achievement[]>,
    create: (args: any) => create("achievement", args) as Promise<Achievement>,
    deleteMany: (args?: any) => deleteMany("achievement", args) as Promise<{ count: number }>,
  },
  testimonial: {
    findMany: (args?: any) => findMany("testimonial", args) as Promise<Testimonial[]>,
    create: (args: any) => create("testimonial", args) as Promise<Testimonial>,
    deleteMany: (args?: any) => deleteMany("testimonial", args) as Promise<{ count: number }>,
  },
  waitlist: {
    count: (args?: any) => count("waitlist", args) as Promise<number>,
    findUnique: (args: any) => findUnique("waitlist", args) as Promise<Waitlist | null>,
    create: (args: any) => create("waitlist", args) as Promise<Waitlist>,
  },
};

export default prisma;
