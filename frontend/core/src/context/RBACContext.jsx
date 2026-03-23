/**
 * Role-Based Access Control (RBAC) Context
 * Covenant Cloud Church Management System
 *
 * Roles:
 * - superadmin: Full CRUD access to everything
 * - admin: Full CRUD access
 * - pastor (parish_minister): Create, Read, Update
 * - elder (church_elder): Create, Read, Update (also group patron)
 * - treasurer (church_treasurer): Create, Read, Update
 * - registrar: Create, Read, Update
 * - deputy_registrar: Create, Read, Update
 * - member: Read only
 *
 * Group Roles (within a group):
 * - chairperson, vice_chairperson, secretary, vice_secretary, treasurer
 * - For PCMF group only: vice_treasurer (additional role)
 */

import { createContext, useContext } from "react";

export const ROLES = {
  SUPER_ADMIN: "superadmin",
  ADMIN: "admin",
  PASTOR: "pastor",
  ELDER: "elder",
  TREASURER: "treasurer",
  REGISTRAR: "registrar",
  DEPUTY_REGISTRAR: "deputy_registrar",
  MEMBER: "member",
};

export const GROUP_ROLES = {
  CHAIRPERSON: "chairperson",
  VICE_CHAIRPERSON: "vice_chairperson",
  SECRETARY: "secretary",
  VICE_SECRETARY: "vice_secretary",
  TREASURER: "treasurer",
  VICE_TREASURER: "vice_treasurer", // PCMF only
  PATRON: "patron",
  MEMBER: "member",
};

// Permissions matrix
export const PERMISSIONS = {
  // Members module
  members: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [
      ROLES.SUPER_ADMIN, 
      ROLES.ADMIN
    ],
  },
  // Donations module
  donations: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  // Events module
  events: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  // Prayer Requests module
  prayer_requests: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  // Sermons module
  sermons: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  // Giving module
  giving: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  // User Management module
  users: {
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    update: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  // Reports module
  reports: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    update: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  // Settings module
  settings: {
    create: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    delete: [ROLES.SUPER_ADMIN],
  },
  // Groups module
  groups: {
    create: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    read: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
      ROLES.MEMBER,
    ],
    update: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.PASTOR,
      ROLES.ELDER,
      ROLES.TREASURER,
      ROLES.REGISTRAR,
      ROLES.DEPUTY_REGISTRAR,
    ],
    delete: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
};

// Navigation items per role
export const getNavItems = (role) => {
  const allItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      roles: Object.values(ROLES),
    },
    {
      name: "Members",
      path: "/members",
      icon: "Users",
      roles: Object.values(ROLES),
    },
    {
      name: "Donations",
      path: "/donations",
      icon: "DollarSign",
      roles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.PASTOR,
        ROLES.ELDER,
        ROLES.TREASURER,
        ROLES.REGISTRAR,
        ROLES.DEPUTY_REGISTRAR,
        ROLES.MEMBER,
      ],
    },
    {
      name: "Events",
      path: "/events",
      icon: "Calendar",
      roles: Object.values(ROLES),
    },
    {
      name: "Prayer Requests",
      path: "/prayer-requests",
      icon: "Heart",
      roles: Object.values(ROLES),
    },
    {
      name: "Sermons",
      path: "/sermons",
      icon: "BookOpen",
      roles: Object.values(ROLES),
    },
    {
      name: "Giving",
      path: "/giving",
      icon: "HandCoins",
      roles: Object.values(ROLES),
    },
    {
      name: "Groups",
      path: "/groups",
      icon: "UsersRound",
      roles: Object.values(ROLES),
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "BarChart3",
      roles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.PASTOR,
        ROLES.ELDER,
        ROLES.TREASURER,
        ROLES.REGISTRAR,
        ROLES.DEPUTY_REGISTRAR,
      ],
    },
    {
      name: "User Management",
      path: "/users",
      icon: "UserCog",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "Settings",
      roles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.PASTOR,
        ROLES.ELDER,
        ROLES.TREASURER,
        ROLES.REGISTRAR,
        ROLES.DEPUTY_REGISTRAR,
        ROLES.MEMBER,
      ],
    },
  ];

  return allItems.filter((item) => item.roles.includes(role));
};

// Check if a user has permission for an action on a module
export const hasPermission = (role, module, action) => {
  if (!PERMISSIONS[module] || !PERMISSIONS[module][action]) return false;
  return PERMISSIONS[module][action].includes(role);
};

// Check if user can access a group (must be approved by group leadership)
export const canAccessGroup = (userGroupMemberships, groupId) => {
  if (!userGroupMemberships) return false;
  const membership = userGroupMemberships.find((m) => m.groupId === groupId);
  return membership && membership.approved;
};

const RBACContext = createContext();

export const useRBAC = () => useContext(RBACContext);

export default RBACContext;
