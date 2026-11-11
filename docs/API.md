# REST API Documentation

Prefix: `/api/v1/`
Documentation UIs:
- **Swagger UI:** `/api/docs/`
- **Redoc:** `/api/redoc/`
- **OpenAPI 3.0 Schema:** `/api/schema/`

---

## 1. Authentication (`/api/v1/auth/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | Public | Register customer account |
| POST | `/api/v1/auth/login/` | Public | Authenticate and obtain JWT access + refresh |
| POST | `/api/v1/auth/refresh/` | Public | Refresh JWT access token |
| GET | `/api/v1/auth/me/` | Bearer | Retrieve current user profile and role |
| PATCH | `/api/v1/auth/me/` | Bearer | Update user profile |
| POST | `/api/v1/auth/logout/` | Bearer | Blacklist refresh token and logout |

## 2. Payment Providers & Guides (`/api/v1/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/providers/` | Public | List active payment providers |
| GET | `/api/v1/provider-guides/` | Public | List verified provider dispute guides |
| PATCH | `/api/v1/provider-guides/{id}/` | Admin/Content | Update provider guide steps / status |

## 3. Official Channels (`/api/v1/official-channels/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/official-channels/` | Public | Curated official helplines & portals |
| POST/PATCH | `/api/v1/official-channels/{id}/` | Admin/Content | Manage directory records |

## 4. Incidents & Classification (`/api/v1/incidents/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/incidents/classify/` | Public | Evaluate intake questions without saving |
| POST | `/api/v1/incidents/` | Bearer | Create incident & auto-generate action plan |
| GET | `/api/v1/incidents/` | Bearer | List authenticated customer's cases |
| GET | `/api/v1/incidents/{id}/` | Bearer | Retrieve detailed case information |
| PATCH | `/api/v1/incidents/{id}/` | Bearer | Update case status or details |
| GET | `/api/v1/incidents/{id}/action-plan/` | Bearer | Get prioritized action plan items |

## 5. Complaints, References & Evidence
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/action-items/{id}/toggle_complete/` | Bearer | Mark action item done / record notes |
| GET | `/api/v1/incidents/{id}/complaint-draft/` | Bearer | Generate formal grievance letter |
| GET | `/api/v1/references/?incident_id={id}` | Bearer | List recorded authority reference numbers |
| POST | `/api/v1/references/` | Bearer | Record new external reference number |
| GET | `/api/v1/evidence/?incident_id={id}` | Bearer | List uploaded evidence metadata |
| POST | `/api/v1/evidence/` | Bearer | Securely upload evidence file (multipart/form-data) |

## 6. Admin Analytics (`/api/v1/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/admin/dashboard/` | Staff/Admin | Operational counts, guide reviews, recent audits |
| GET | `/api/v1/audit-logs/` | Staff/Admin | Audit trail for security & compliance |
