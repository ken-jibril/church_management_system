/**
 * Badge Component - Covenant Cloud Church Management System
 */

const variantClasses = {
  success: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  gray: "bg-gray-100 text-gray-700",
  indigo: "bg-indigo-100 text-indigo-800",
  orange: "bg-orange-100 text-orange-800",
};

export default function Badge({ children, variant = "gray", className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.gray} ${className}`}
    >
      {children}
    </span>
  );
}

// Role badge helper
export function RoleBadge({ role }) {
  const roleConfig = {
    superadmin: { label: "Super Admin", variant: "purple" },
    admin: { label: "Admin", variant: "indigo" },
    pastor: { label: "Pastor", variant: "info" },
    elder: { label: "Elder", variant: "success" },
    treasurer: { label: "Treasurer", variant: "warning" },
    registrar: { label: "Registrar", variant: "orange" },
    deputy_registrar: { label: "Deputy Registrar", variant: "orange" },
    member: { label: "Member", variant: "gray" },
  };

  const config = roleConfig[role] || { label: role, variant: "gray" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Status badge helper
export function StatusBadge({ status }) {
  const statusConfig = {
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "danger" },
    pending: { label: "Pending", variant: "warning" },
    confirmed: { label: "Confirmed", variant: "success" },
    upcoming: { label: "Upcoming", variant: "info" },
    completed: { label: "Completed", variant: "gray" },
    cancelled: { label: "Cancelled", variant: "danger" },
    answered: { label: "Answered", variant: "success" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
  };

  const config = statusConfig[status] || { label: status, variant: "gray" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
