# CualificacionLeadsPlek API

Backend REST API for lead qualification, analytics tracking, and email template management.

- Version: 1.0.1
- Content-Type: `application/json`

---

## Author

Developer

- Name: Andrés Segura
- Email: andres.segura.dev@gmail.com
- GitHub: [github.com/Andr7st](https://github.com/Andr7st)

Requeriments design

- Name: Lucas Matias Segovia
- Email: lms.segovia86@gmail.com
- GitHub: [github.com/LumDev86](https://github.com/LumDev86)

---

## Tech Stack

- Node.js + TypeScript
- Express v5
- PostgreSQL + Drizzle ORM

---

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your DB credentials
npm run db:push        # sync schema to DB
npm run dev            # start dev server
```

---

## Leads

### POST /api/leads
Create a new lead.

Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "companyType": "startup",
  "productType": "saas"
}
```

- `companyType`: `"startup"` | `"pyme"` | `"enterprise"` | `"freelance"`
- `productType`: `"saas"` | `"ecommerce"` | `"marketplace"` | `"other"`

Response `201`:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "companyType": "startup",
  "productType": "saas",
  "status": "lead",
  "createdAt": "2026-04-09T10:00:00.000Z",
  "updatedAt": "2026-04-09T10:00:00.000Z"
}
```

---

### GET /api/leads
Get all leads. Supports optional query filters.

Query params (all optional):
- `status`: `"lead"` | `"contacted"` | `"qualified"` | `"converted"` | `"lost"`
- `companyType`: `"startup"` | `"pyme"` | `"enterprise"` | `"freelance"`

Examples:
```
GET /api/leads
GET /api/leads?status=contacted
GET /api/leads?companyType=enterprise
```

Response `200`:
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "companyType": "startup",
    "productType": "saas",
    "status": "lead",
    "createdAt": "2026-04-09T10:00:00.000Z",
    "updatedAt": "2026-04-09T10:00:00.000Z"
  }
]
```

---

### GET /api/leads/:id
Get a single lead by UUID.

```
GET /api/leads/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Response `200`:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "companyType": "startup",
  "productType": "saas",
  "status": "lead",
  "createdAt": "2026-04-09T10:00:00.000Z",
  "updatedAt": "2026-04-09T10:00:00.000Z"
}
```

---

### PATCH /api/leads/:id
Update the status of a lead.

Valid status transitions:
- `lead` → `contacted`, `lost`
- `contacted` → `qualified`, `lost`
- `qualified` → `converted`, `lost`
- `converted` → (terminal)
- `lost` → (terminal)

Request body:
```json
{
  "status": "contacted"
}
```

Response `200`:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "companyType": "startup",
  "productType": "saas",
  "status": "contacted",
  "createdAt": "2026-04-09T10:00:00.000Z",
  "updatedAt": "2026-04-09T10:30:00.000Z"
}
```

---

### DELETE /api/leads/:id
Delete a lead by UUID.

```
DELETE /api/leads/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Response `204`: No content.

---

## Analytics

### POST /api/analytics/visit
Register a page visit. Both fields are optional.

Request body:
```json
{
  "source": "google",
  "campaign": "spring_launch_2026"
}
```

Response `201`:
```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "source": "google",
  "campaign": "spring_launch_2026",
  "createdAt": "2026-04-09T11:00:00.000Z"
}
```

---

### GET /api/analytics/summary
Get a summary of visits, leads, conversions, and conversion rate.

Response `200`:
```json
{
  "visits": 340,
  "leads": 52,
  "conversions": 18,
  "conversionRate": 34.62
}
```

---

## Email Templates

### POST /api/emails/templates
Create a new email template.

Request body:
```json
{
  "name": "Welcome Email",
  "subject": "Thanks for signing up!",
  "body": "<html><body><h1>Welcome aboard!</h1><p>We're glad to have you.</p></body></html>"
}
```

Response `201`:
```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "name": "Welcome Email",
  "subject": "Thanks for signing up!",
  "body": "<html><body><h1>Welcome aboard!</h1><p>We're glad to have you.</p></body></html>",
  "createdAt": "2026-04-09T09:00:00.000Z",
  "updatedAt": "2026-04-09T09:00:00.000Z"
}
```

---

### GET /api/emails/templates
Get all email templates.

Response `200`:
```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Welcome Email",
    "subject": "Thanks for signing up!",
    "body": "<html><body><h1>Welcome aboard!</h1></body></html>",
    "createdAt": "2026-04-09T09:00:00.000Z",
    "updatedAt": "2026-04-09T09:00:00.000Z"
  }
]
```

---

### POST /api/emails/send
Send an email using an existing template to one or more recipients.

Request body:
```json
{
  "templateId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "to": ["jane@example.com", "john@example.com"]
}
```

Response `200`:
```json
{
  "message": "Email sent successfully",
  "templateId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "recipients": ["jane@example.com", "john@example.com"]
}
```

---

Deploy vercel: [**s03-26-equipo-31-backend.vercel.app**](https://s03-26-equipo-31-backend.vercel.app/)
