# Admin Dashboard API Documentation

## Overview
This document describes the Admin Dashboard API endpoints for the ClubUnite platform. All endpoints require admin authentication (JWT token with `role: 'admin'`).

**Base URL**: `/api/admin`

**Authentication**: All routes require `Authorization: Bearer <token>` header with a valid JWT token from an admin user.

---

## 📊 Dashboard Overview (Analytics)

### Get Dashboard Stats
`GET /api/admin/dashboard`

Returns comprehensive dashboard statistics including user counts, event counts, RSVP totals, trending categories, active organizers, and top interests.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalStudents": 120,
    "totalOrganizers": 30,
    "totalEvents": 45,
    "totalRSVPs": 230,
    "totalBookmarks": 180,
    "trendingCategories": [...],
    "activeOrganizers": [...],
    "topInterests": [...]
  }
}
```

### Get RSVP Chart Data
`GET /api/admin/analytics/rsvps?period=week`

Returns RSVP data for line chart visualization.
- `period`: `'day'` or `'week'` (default: `'week'`)

### Get Category Distribution
`GET /api/admin/analytics/categories`

Returns event category distribution for pie chart.

### Get Top Organizers
`GET /api/admin/analytics/organizers?limit=10`

Returns top organizers by engagement for bar chart.
- `limit`: Number of organizers to return (default: 10)

---

## 👥 User Management

### Get All Users
`GET /api/admin/users?search=&role=&status=&page=1&limit=20`

Get paginated list of users with filters.
- `search`: Search by name or email
- `role`: Filter by role (`'user'`, `'organizer'`, `'admin'`, or `'all'`)
- `status`: Filter by status (`'active'`, `'suspended'`, or `'all'`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Get User by ID
`GET /api/admin/users/:id`

Get detailed user information including stats.

### Update User Status
`PUT /api/admin/users/:id/status`

Update user status (suspend/activate).
**Body:**
```json
{
  "status": "suspended" // or "active"
}
```

### Delete User
`DELETE /api/admin/users/:id`

Permanently delete a user. Cannot delete yourself.

---

## 🎉 Event Management

### Get All Events
`GET /api/admin/events?search=&category=&featured=&page=1&limit=20`

Get paginated list of events with filters.
- `search`: Search by title or description
- `category`: Filter by category
- `featured`: Filter by featured status (`'true'` or `'false'`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Get Event by ID
`GET /api/admin/events/:id`

Get detailed event information including bookmark count.

### Toggle Featured Event
`PUT /api/admin/events/:id/feature`

Toggle the featured status of an event.

### Delete Event
`DELETE /api/admin/events/:id`

Delete an event and associated bookmarks. Admin-only.

---

## 📈 Reports & Insights

### Get Popular Times
`GET /api/admin/reports/popular-times`

Returns most popular times for events (by hour and by day of week).

### Get Category Engagement
`GET /api/admin/reports/category-engagement`

Returns category-wise engagement heatmap data with engagement scores.

### Get Top Tags
`GET /api/admin/reports/top-tags?limit=20`

Returns top performing keywords/tags from events and user preferences.
- `limit`: Number of tags to return (default: 20)

---

## ⚙️ Settings

### Get All Admins
`GET /api/admin/settings/admins`

Get list of all admin users.

### Add Admin
`POST /api/admin/settings/admins`

Promote a user to admin role.
**Body:**
```json
{
  "userId": "user_id_here"
}
```

### Remove Admin
`DELETE /api/admin/settings/admins/:id`

Remove admin privileges from a user. Cannot remove yourself or the last admin.

### Generate API Token
`POST /api/admin/settings/generate-token`

Generate a JWT API token for backend access (valid for 30 days).

### Export Analytics
`GET /api/admin/settings/export?type=summary`

Export analytics data as CSV.
- `type`: `'summary'` or `'events'` (default: `'summary'`)

---

## 🔐 Access Control

All admin routes are protected by:
1. `protect` middleware - Verifies JWT token
2. `admin` middleware - Verifies user has `role: 'admin'`

**Request Header:**
```
Authorization: Bearer <your_jwt_token>
```

**Error Response (403):**
```json
{
  "message": "Not authorized as admin"
}
```

---

## 📝 Notes

- All timestamps are in ISO format
- Pagination starts at page 1
- Empty arrays/objects are returned as `[]`/`{}`
- The `featured` field on events highlights them on the main feed
- User `status` can be `'active'` or `'suspended'`
- Deleted users/events are permanently removed from the database

