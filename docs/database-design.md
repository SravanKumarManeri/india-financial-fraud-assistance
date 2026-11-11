# Database Design & Schema Specification

The platform utilizes **MySQL 8.x** with utf8mb4 collation for high-concurrency production deployments and isolated SQLite for automated test suites.

## Entity-Relationship Overview

```
+----------------+          +-------------------+          +-------------------+
|     users      | 1 ---- * |     incidents     | 1 ---- * | action_plan_items |
+----------------+          +-------------------+          +-------------------+
        |                             |                              |
        |                             | 1                            | 1
        |                             |                              |
        |                             v *                            v *
        |                   +-------------------+          +-------------------+
        |                   |complaint_reference|          |cust_action_updates|
        |                   +-------------------+          +-------------------+
        |                             |
        |                             v *
        |                   +-------------------+
        +-----------------> |  evidence_files   |
                            +-------------------+

+-------------------+       +-------------------+          +-------------------+
| payment_providers | 1 - * |  provider_guides  |          | official_channels |
+-------------------+       +-------------------+          +-------------------+
```

## Sensitive Data Protection
Under no circumstances are the following recorded:
- UPI PINs, ATM PINs, Net Banking passwords
- Card CVVs / Full Card Numbers
- OTPs (One Time Passwords)
- Authentication tokens of third-party apps
