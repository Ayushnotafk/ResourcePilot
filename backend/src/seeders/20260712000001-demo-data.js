'use strict';

const bcrypt = require('bcryptjs');
const { ALL_PERMISSIONS, ROLE_PERMISSIONS } = require('../constants/permissions');
const { ROLE_DISPLAY } = require('../constants/roles');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const permissions = ALL_PERMISSIONS.map((code) => ({
      code,
      module: code.split('.')[0],
      description: code.replace('.', ' '),
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('permissions', permissions);

    const [permRows] = await queryInterface.sequelize.query('SELECT id, code FROM permissions');
    const permMap = Object.fromEntries(permRows.map((p) => [p.code, p.id]));

    const roles = Object.keys(ROLE_PERMISSIONS).map((name) => ({
      name,
      display_name: ROLE_DISPLAY[name] || name,
      description: `${ROLE_DISPLAY[name] || name} role`,
      is_system: true,
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert('roles', roles);

    const [roleRows] = await queryInterface.sequelize.query('SELECT id, name FROM roles');
    const roleMap = Object.fromEntries(roleRows.map((r) => [r.name, r.id]));

    const rolePermissions = [];
    for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
      for (const perm of perms) {
        rolePermissions.push({
          role_id: roleMap[roleName],
          permission_id: permMap[perm],
          created_at: now,
          updated_at: now,
        });
      }
    }
    await queryInterface.bulkInsert('role_permissions', rolePermissions);

    await queryInterface.bulkInsert('departments', [
      {
        name: 'Information Technology',
        code: 'IT',
        cost_center_code: 'CC-IT-001',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Human Resources',
        code: 'HR',
        cost_center_code: 'CC-HR-001',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Finance',
        code: 'FIN',
        cost_center_code: 'CC-FIN-001',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const [deptRows] = await queryInterface.sequelize.query("SELECT id, code FROM departments WHERE code = 'IT'");
    const itDeptId = deptRows[0].id;

    const passwordHash = await bcrypt.hash('Admin@123', 12);

    await queryInterface.bulkInsert('users', [
      {
        employee_code: 'EMP-001',
        email: 'admin@assetflow.com',
        password_hash: passwordHash,
        first_name: 'System',
        last_name: 'Admin',
        department_id: itDeptId,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        employee_code: 'EMP-002',
        email: 'manager@assetflow.com',
        password_hash: passwordHash,
        first_name: 'Alex',
        last_name: 'Manager',
        department_id: itDeptId,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        employee_code: 'EMP-003',
        email: 'employee@assetflow.com',
        password_hash: passwordHash,
        first_name: 'Jamie',
        last_name: 'Employee',
        department_id: itDeptId,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const [userRows] = await queryInterface.sequelize.query('SELECT id, email FROM users');
    const userMap = Object.fromEntries(userRows.map((u) => [u.email, u.id]));

    await queryInterface.bulkUpdate(
      'users',
      { manager_id: userMap['manager@assetflow.com'] },
      { email: 'employee@assetflow.com' }
    );

    await queryInterface.bulkInsert('user_roles', [
      {
        user_id: userMap['admin@assetflow.com'],
        role_id: roleMap.super_admin,
        assigned_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap['manager@assetflow.com'],
        role_id: roleMap.asset_manager,
        assigned_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap['employee@assetflow.com'],
        role_id: roleMap.employee,
        assigned_at: now,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('locations', [
      {
        name: 'Head Office Campus',
        code: 'CAMP-HQ',
        type: 'campus',
        is_bookable: false,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const [campusRows] = await queryInterface.sequelize.query("SELECT id FROM locations WHERE code = 'CAMP-HQ'");
    const campusId = campusRows[0].id;

    await queryInterface.bulkInsert('locations', [
      {
        name: 'Building A',
        code: 'BLD-A',
        type: 'building',
        parent_id: campusId,
        is_bookable: false,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'IT Warehouse',
        code: 'WH-IT',
        type: 'warehouse',
        parent_id: campusId,
        is_bookable: false,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const [buildingRows] = await queryInterface.sequelize.query("SELECT id FROM locations WHERE code = 'BLD-A'");
    const buildingId = buildingRows[0].id;
    const [warehouseRows] = await queryInterface.sequelize.query("SELECT id FROM locations WHERE code = 'WH-IT'");
    const warehouseId = warehouseRows[0].id;

    await queryInterface.bulkInsert('locations', [
      {
        name: 'Conference Room Alpha',
        code: 'RM-ALPHA',
        type: 'room',
        parent_id: buildingId,
        capacity: 12,
        is_bookable: true,
        amenities: JSON.stringify({ projector: true, whiteboard: true, video_conf: true }),
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('asset_categories', [
      {
        name: 'IT Equipment',
        code: 'IT-EQ',
        requires_serial: true,
        is_bookable_resource: false,
        icon: 'laptop',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Furniture',
        code: 'FURN',
        requires_serial: false,
        is_bookable_resource: false,
        icon: 'chair',
        created_at: now,
        updated_at: now,
      },
    ]);

    const [catRows] = await queryInterface.sequelize.query('SELECT id, code FROM asset_categories');
    const catMap = Object.fromEntries(catRows.map((c) => [c.code, c.id]));

    await queryInterface.bulkInsert('asset_categories', [
      {
        name: 'Laptops',
        code: 'LAPTOP',
        parent_id: catMap['IT-EQ'],
        requires_serial: true,
        depreciation_years: 3,
        icon: 'laptop',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Monitors',
        code: 'MONITOR',
        parent_id: catMap['IT-EQ'],
        requires_serial: true,
        depreciation_years: 5,
        icon: 'monitor',
        created_at: now,
        updated_at: now,
      },
    ]);

    const [laptopCat] = await queryInterface.sequelize.query("SELECT id FROM asset_categories WHERE code = 'LAPTOP'");
    const laptopCatId = laptopCat[0].id;

    await queryInterface.bulkInsert('vendors', [
      {
        name: 'Dell Technologies',
        code: 'DELL',
        contact_email: 'sales@dell.com',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const [vendorRows] = await queryInterface.sequelize.query("SELECT id FROM vendors WHERE code = 'DELL'");
    const vendorId = vendorRows[0].id;

    await queryInterface.bulkInsert('assets', [
      {
        asset_tag: 'AST-2026-001',
        name: 'Dell Latitude 5540',
        category_id: laptopCatId,
        serial_number: 'DL5540-001',
        model: 'Latitude 5540',
        manufacturer: 'Dell',
        status: 'in_stock',
        condition: 'excellent',
        department_id: itDeptId,
        location_id: warehouseId,
        vendor_id: vendorId,
        purchase_date: '2025-06-01',
        purchase_cost: 85000.0,
        current_value: 85000.0,
        created_by: userMap['admin@assetflow.com'],
        created_at: now,
        updated_at: now,
      },
      {
        asset_tag: 'AST-2026-002',
        name: 'Dell Latitude 5540',
        category_id: laptopCatId,
        serial_number: 'DL5540-002',
        model: 'Latitude 5540',
        manufacturer: 'Dell',
        status: 'in_stock',
        condition: 'excellent',
        department_id: itDeptId,
        location_id: warehouseId,
        vendor_id: vendorId,
        purchase_date: '2025-06-01',
        purchase_cost: 85000.0,
        current_value: 85000.0,
        created_by: userMap['admin@assetflow.com'],
        created_at: now,
        updated_at: now,
      },
    ]);

    const [assetRows] = await queryInterface.sequelize.query('SELECT id, asset_tag FROM assets');
    for (const asset of assetRows) {
      await queryInterface.bulkInsert('asset_status_history', [
        {
          asset_id: asset.id,
          from_status: null,
          to_status: 'in_stock',
          changed_by: userMap['admin@assetflow.com'],
          reason: 'Initial stock receipt',
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('asset_status_history', null, {});
    await queryInterface.bulkDelete('assets', null, {});
    await queryInterface.bulkDelete('vendors', null, {});
    await queryInterface.bulkDelete('asset_categories', null, {});
    await queryInterface.bulkDelete('locations', null, {});
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('departments', null, {});
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
