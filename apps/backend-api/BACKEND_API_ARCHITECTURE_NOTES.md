# Backend API Architecture Notes

## Purpose Of This Scaffold

This application is the future trusted server boundary for the rebuilt platform.

It is being initialized as a Node.js scaffold without locking in a final server framework yet. That keeps the project aligned with the existing architecture memory, which still treats the exact backend framework as an open decision.

## What This Service Is Preparing For

- Prisma ORM
- MySQL connectivity
- authentication routes
- site configuration routes
- future study data routes

## Current Structural Direction

- `prisma/` for schema, migrations, and seed data
- `src/config/` for runtime configuration loading
- `src/db/` for future database/bootstrap logic
- `src/http/routes/` for route registration boundaries
- `src/modules/auth/` for authentication domain logic
- `src/modules/site-config/` for public/admin site settings logic
- `src/modules/study-data/` for future persisted Study Room data APIs

## Why The Scaffold Is Framework-Neutral Right Now

- the project memory has not yet locked Express, Fastify, Nest, or another framework
- the immediate goal is safe structural preparation, not premature implementation
- Prisma, route boundaries, and module layout can be prepared before the final HTTP framework choice

## Current Scope Boundary

- no business routes implemented yet
- no Prisma package installed yet
- no MySQL connection executed yet
- no auth/session implementation yet

## Recommended Next Backend Step

- choose the backend framework explicitly before adding production routes or middleware
