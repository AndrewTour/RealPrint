# Real Estate Letterbox Drop Operations Platform - Blueprint

## SECTION 1: Product summary
This platform is an operations-first SaaS designed for real estate agencies to manage the end-to-end workflow of letterbox drop campaigns. It connects agents, marketing admins, print partners, and distributors. The business value lies in reducing manual coordination (emails, spreadsheets), preventing errors in print specs or quantities, providing clear visibility into job statuses, and enabling data-driven optimization of farming areas. The MVP scope focuses on campaign creation, basic map-based area selection, print specification, supplier handoff, and status tracking. Future phases will introduce CRM integrations, advanced heatmaps, and automated ROI attribution.

## SECTION 2: Critical features list
**Must-have:**
- Campaign creation wizard (type, objective, agent)
- Print specification selection (size, stock, quantity)
- Map-based drop area planning (suburb/polygon selection)
- Supplier job handoff (structured email/export for MVP)
- Job status tracking board
- Role-based access control (Admin, Agent, Supplier)

**Should-have:**
- Artwork upload and versioning
- Cost estimation and quoting engine
- Dashboard reporting (spend, volume by area)
- Saved territories/farming zones
- Internal approval workflows

**Nice-to-have:**
- API integration with specific printers
- Distributor mobile view for proof-of-completion
- Duplicate address suppression
- "No junk mail" area flags

## SECTION 3: User roles and permissions
- **Super Admin:** Full system access, manage agencies, global settings.
- **Agency Admin:** Manage users, approve campaigns, view all agency reporting, manage billing.
- **Agent:** Create campaigns, view own campaign status, manage own saved territories.
- **Marketing Coordinator:** Create/edit campaigns on behalf of agents, upload artwork, liaise with suppliers.
- **Printer / Print Partner:** View assigned jobs, update print/dispatch status, download artwork and run sheets.
- **Distributor / Drop Team:** View assigned routes, update drop status, upload completion photos.
- **Reporting User:** Read-only access to dashboards.

## SECTION 4: Detailed workflow maps
1. **Agent/Marketing:** Initiates campaign -> Selects type (e.g., Just Sold) -> Uploads artwork -> Defines map area -> Selects print specs -> Submits for approval.
2. **Agency Admin:** Reviews quote/specs -> Approves -> Job state changes to "Approved for Print".
3. **System:** Generates job sheet -> Notifies Printer.
4. **Printer:** Logs in -> Downloads assets -> Updates status to "In Production" -> "Printed" -> "Dispatched".
5. **Distributor:** Receives physical stock -> Logs in -> Views map route -> Completes drop -> Updates status to "Distribution Completed" -> Uploads photo.
6. **System:** Notifies Agent -> Updates reporting.

## SECTION 5: Data model / entities
- **User:** id, email, role, officeId
- **Office:** id, name, address
- **Campaign:** id, title, type, objective, status, agentId, officeId, totalCost, createdAt
- **Artwork:** id, campaignId, fileUrl, version, status
- **PrintSpec:** id, campaignId, size, stock, sides, quantity, tolerance
- **Territory:** id, name, geoJson, estimatedHouseholds, agentId
- **CampaignDrop:** id, campaignId, territoryId, quantity, status, distributorId
- **Supplier:** id, name, type (Printer/Distributor), email
- **AuditLog:** id, entityType, entityId, action, userId, timestamp

## SECTION 6: Map and location intelligence design
- **Logic:** Users draw polygons or select predefined suburbs on a map. The system calculates the area and uses a baseline density multiplier (e.g., X households per sq km for residential zones) to estimate quantities.
- **Exclusions:** MVP will allow manual polygon exclusions. Future phases will integrate zoning data to exclude commercial/industrial.
- **Provider:** Leaflet with OpenStreetMap for MVP (free, no API key required immediately). Mapbox for future phases.
- **Data Structure:** GeoJSON stored in the database.

## SECTION 7: Printer integration design
- **Architecture:** API-first, but MVP will use a robust fallback: Webhook/Email generation.
- **Fallback:** When a job is approved, the system generates a structured JSON payload and a PDF Job Sheet, emailed to the printer with secure links to download artwork.
- **Status:** Printers get a secure, magic-link accessed portal to click status buttons (e.g., "Mark Printed"), updating the system via internal API.

## SECTION 8: Scheduling and operations logic
- **Deadlines:** Calculated backwards from "Requested In-Home Date". E.g., Print Deadline = In-Home Date - 5 days.
- **SLA Warnings:** If current date > Print Deadline and status < "Printed", flag as "Late Risk".
- **Cancellations:** Allowed only if status is before "In Production".

## SECTION 9: Pricing engine design
- **Formulas:** Base Print Cost (Quantity * Unit Price based on tier) + Distribution Cost (Quantity * Area Rate) + Markup % + GST.
- **Overrides:** Admins can apply a manual discount or surcharge before approval.

## SECTION 10: UX / UI architecture
- **Main Pages:** Dashboard, Campaigns List, Campaign Builder (Wizard), Territories Map, Reporting, Settings.
- **Navigation:** Left sidebar for desktop, bottom tab for mobile.
- **Campaign Builder:** Multi-step wizard (Details -> Creative -> Map -> Specs -> Review).

## SECTION 11: Technical architecture
- **Stack:** React + Vite (Frontend), Express (Backend), Tailwind CSS, shadcn/ui.
- **Database:** SQLite with Prisma (MVP for easy container deployment), easily migratable to Postgres.
- **Storage:** Local disk upload for MVP, easily swappable to AWS S3.
- **Maps:** Leaflet + React-Leaflet.
- **Why:** Fits the AI Studio environment perfectly while providing a robust full-stack foundation.

## SECTION 12: Database schema
(See prisma/schema.prisma in codebase)

## SECTION 13: API design
- `POST /api/campaigns`
- `GET /api/campaigns/:id`
- `PUT /api/campaigns/:id/status`
- `POST /api/upload`
- `GET /api/territories`

## SECTION 14: Notification and automation rules
- **Triggers:** Campaign Approved -> Email Printer. Status == Dispatched -> Email Distributor. Status == Completed -> Email Agent.

## SECTION 15: Admin controls
- Manage users, set pricing tiers per 1000 flyers, manage supplier details.

## SECTION 16: Security and compliance
- JWT-based Auth. RBAC middleware on Express routes. Uploaded files served via signed URLs or authenticated routes.

## SECTION 17: MVP build roadmap
1. Setup & DB Schema
2. Auth & Layout
3. Campaign Wizard & Map
4. Supplier Portal & Status Tracking
5. Dashboard & Reporting

## SECTION 18: QA / testing plan
- Focus on permission boundaries (agents can't approve their own campaigns if threshold exceeded).
- Map polygon intersection tests.

## SECTION 19: Seed data and demo scenario
- Pre-populate 1 Office, 2 Agents, 1 Admin, 1 Printer, and 5 historical campaigns in various states.

## SECTION 20: Build execution
(Proceeding with codebase generation)
