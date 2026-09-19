/**
 * Generates openapi.json from the existing zod request schemas — the first
 * step of the implementation plan's Phase 6 (Django migration): freeze the
 * Next.js API contract so a Django implementation of the same endpoints can be
 * verified against it later (e.g. with Schemathesis/Dredd), without waiting
 * for the migration itself to start.
 *
 * Run: npx tsx scripts/generate-openapi.ts
 */

import { writeFileSync } from "node:fs"
import { zodToJsonSchema } from "zod-to-json-schema"
import { contactFormSchema } from "../lib/schemas/contact"
import { loginSchema } from "../lib/schemas/login"
import { predictRequestSchema } from "../lib/schemas/predict"
import { economicScenarioSchema } from "../lib/schemas/economics"

function schema(name: string, zodSchema: Parameters<typeof zodToJsonSchema>[0]) {
  const { $schema, ...rest } = zodToJsonSchema(zodSchema, name) as Record<string, unknown>
  return rest
}

const openapi = {
  openapi: "3.0.3",
  info: {
    title: "AfriMaint API",
    version: "0.1.0",
    description:
      "Contract for the Next.js API routes under app/api/. Frozen here so a future Django implementation " +
      "(implementation plan Phase 6) can be validated against the same shapes before cutover.",
  },
  paths: {
    "/api/contact": {
      post: {
        summary: "Submit a marketing-site inquiry",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ContactForm" } } } },
        responses: { "200": { description: "OK" }, "400": { description: "Invalid submission" } },
      },
    },
    "/api/auth/[...nextauth]": {
      post: {
        summary: "NextAuth credentials sign-in (email + password)",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } } },
        responses: { "200": { description: "Session established" } },
      },
    },
    "/api/machines": {
      get: {
        summary: "List machines for the authenticated user's organization",
        security: [{ sessionCookie: [] }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/machines/{id}": {
      get: {
        summary: "Get a single machine (must belong to the caller's organization)",
        security: [{ sessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/alerts": {
      get: {
        summary: "List alerts for the authenticated user's organization",
        security: [{ sessionCookie: [] }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/alerts/{id}": {
      patch: {
        summary: "Update an alert's status",
        security: [{ sessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK" },
          "400": { description: "Invalid status" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/work-orders": {
      get: {
        summary: "List work orders for the authenticated user's organization",
        security: [{ sessionCookie: [] }],
        responses: { "200": { description: "OK" } },
      },
      post: {
        summary: "Create a work order (Manager/Admin only)",
        security: [{ sessionCookie: [] }],
        responses: {
          "201": { description: "Created" },
          "403": { description: "Forbidden — Manager/Admin only" },
          "404": { description: "Machine not found" },
        },
      },
    },
    "/api/predict": {
      post: {
        summary: "Score a sensor reading via ml-service and persist the prediction",
        security: [{ sessionCookie: [] }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/PredictRequest" } } } },
        responses: {
          "201": { description: "Created" },
          "404": { description: "Machine not found" },
          "502": { description: "ML service unavailable" },
          "503": { description: "ML service reachable but artifact not loaded" },
        },
      },
    },
    "/api/economics": {
      get: {
        summary: "List recent economic reports for the organization",
        security: [{ sessionCookie: [] }],
        responses: { "200": { description: "OK" } },
      },
      post: {
        summary: "Compute a run-to-failure vs predictive-maintenance scenario and persist it",
        security: [{ sessionCookie: [] }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/EconomicScenario" } } },
        },
        responses: {
          "201": { description: "Created" },
          "404": { description: "Machine not found" },
          "409": { description: "No cost matrix configured" },
        },
      },
    },
    "/api/admin/models": {
      get: {
        summary: "List model versions with their real reported metrics (Admin only)",
        security: [{ sessionCookie: [] }],
        responses: { "200": { description: "OK" }, "403": { description: "Forbidden — Admin only" } },
      },
    },
  },
  components: {
    securitySchemes: {
      sessionCookie: { type: "apiKey", in: "cookie", name: "next-auth.session-token" },
    },
    schemas: {
      ContactForm: schema("ContactForm", contactFormSchema),
      Login: schema("Login", loginSchema),
      PredictRequest: schema("PredictRequest", predictRequestSchema),
      EconomicScenario: schema("EconomicScenario", economicScenarioSchema),
    },
  },
}

writeFileSync("openapi.json", JSON.stringify(openapi, null, 2) + "\n")
console.log("Wrote openapi.json")
