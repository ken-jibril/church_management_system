# PCEA Church Management Backend

## Overview
This Django backend powers the PCEA Covenant Church management system.
It handles members, districts, church groups, leadership roles, and permissions.

## Folder Structure
- `core/` : Django project (settings, urls, wsgi)
- `members/` : Custom User model and member-related logic
- `districts/` : District models and leadership
- `groups/` : Church group models and leadership roles

## Custom User Model
- `Member` (extends `AbstractUser`)
- Fields:
  - `is_super_admin` → Full access (ken)
  - `is_parish_minister` → Parish Minister
  - `is_kirk_session` → Kirk Session elders
- **AUTH_USER_MODEL** set to `members.Member`

## Setup Instructions
1. Create and activate virtual environment
2. Install requirements:
    ```bash
    pip install -r requirements.txt
    ```
3. Apply migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
4. Create superuser:
    ```bash
    python manage.py createsuperuser
    ```
5. Run server:
    ```bash
    python manage.py runserver
    ```

## Models
### Members
- Stores all church members
- Tracks phone number, roles, and access levels

### Districts
- Tracks members by district
- Includes elder, secretary, treasurer, deacons

### Groups
- Tracks all church groups
- Stores patron (elder) and leadership roles
- Leadership roles: Chairperson, Vice Chairperson, Secretary, Vice Secretary, Treasurer, Vice Treasurer (PCMF only)

## Permissions Logic
- Super Admin → full access
- Parish Minister / Kirk Session → full access
- Elders / Deacons → district-level access
- Group Leaders → group-level access
- Members → limited access

## Optional / Future Models
### NewMemberRegistration

- Track pending members before approval

- Fields: first_name, last_name, email, phone_number, group/district (optional), status, created_at

- Media / Admin Logs

- Track who updated what and when

- Fields: user (FK → Member), action, model_name, timestamp

- Event / Attendance / Service Tracking

- Track church services, events, and attendance

- Fields: event_name, date & time, participants (ManyToMany → Member), attendance status