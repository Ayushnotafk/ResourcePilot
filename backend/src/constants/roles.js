const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ASSET_MANAGER: 'asset_manager',
  DEPARTMENT_HEAD: 'department_head',
  EMPLOYEE: 'employee',
  MAINTENANCE_TECHNICIAN: 'maintenance_technician',
  AUDITOR: 'auditor',
  PROCUREMENT_OFFICER: 'procurement_officer',
};

const ROLE_DISPLAY = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ASSET_MANAGER]: 'Asset Manager',
  [ROLES.DEPARTMENT_HEAD]: 'Department Head',
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.MAINTENANCE_TECHNICIAN]: 'Maintenance Technician',
  [ROLES.AUDITOR]: 'Auditor',
  [ROLES.PROCUREMENT_OFFICER]: 'Procurement Officer',
};

module.exports = { ROLES, ROLE_DISPLAY };
