const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function testAll() {
  console.log('🚀 Starting integration tests for new hackathon endpoints...');

  try {
    // 1. Login Admin
    console.log('\n--- Test 1: Admin Login ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@assetflow.com', password: 'Admin@123' })
    });
    
    if (!adminLoginRes.ok) throw new Error('Admin login failed');
    const adminLoginData = await adminLoginRes.json();
    const token = adminLoginData.data.accessToken;
    console.log('✅ Admin login successful! Token retrieved.');

    // 2. Signup a new user
    console.log('\n--- Test 2: User Signup ---');
    const testEmail = `testuser_${Date.now()}@assetflow.com`;
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'TestPassword@123',
        firstName: 'Test',
        lastName: 'Employee',
        employeeCode: `EMP-${Math.floor(Math.random() * 10000)}`,
        phone: '1234567890'
      })
    });
    const signupData = await signupRes.json();
    if (!signupRes.ok) throw new Error(`Signup failed: ${JSON.stringify(signupData)}`);
    console.log(`✅ Signup successful! New user email: ${testEmail}`);

    // 3. List Users
    console.log('\n--- Test 3: List Users ---');
    const usersRes = await fetch(`${BASE_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!usersRes.ok) throw new Error('Failed to list users');
    const usersData = await usersRes.json();
    const testUser = usersData.data.find(u => u.email === testEmail);
    if (!testUser) throw new Error('Newly registered user not found in the users list');
    console.log(`✅ Users list retrieved! Found test user with ID: ${testUser.id}`);

    // 4. Promote User to technician
    console.log('\n--- Test 4: Promote User ---');
    const promoteRes = await fetch(`${BASE_URL}/users/${testUser.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roleName: 'maintenance_technician' })
    });
    if (!promoteRes.ok) throw new Error('Promoting user failed');
    console.log('✅ User successfully promoted to maintenance_technician!');

    // 5. Test Reports Endpoint
    console.log('\n--- Test 5: Reports Endpoint ---');
    const reportsRes = await fetch(`${BASE_URL}/reports`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!reportsRes.ok) throw new Error('Reports compilation endpoint returned error status');
    console.log('✅ Reports endpoint fetched successfully!');

    // 6. Test Bookings with Overlap Constraints
    console.log('\n--- Test 6: Bookings & Overlap Validation ---');
    // First, let's look for a bookable asset
    const assetsRes = await fetch(`${BASE_URL}/assets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const assetsData = await assetsRes.json();
    let bookableAsset = assetsData.data.find(a => a.isBookable);
    if (!bookableAsset) {
      console.log('ℹ️ No bookable asset found. Creating a bookable asset...');
      // Get category
      const catRes = await fetch(`${BASE_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const catData = await catRes.json();
      const firstCategory = catData.data?.[0];
      if (!firstCategory) throw new Error('No categories found to create asset');

      const createAssetRes = await fetch(`${BASE_URL}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Conference Room Alpha',
          assetTag: `CONF-${Date.now().toString().slice(-4)}`,
          status: 'in_stock',
          condition: 'excellent',
          categoryId: firstCategory.id,
          isBookable: true
        })
      });
      const createAssetData = await createAssetRes.json();
      console.log('Create Asset Response:', createAssetData);
      bookableAsset = createAssetData.data?.asset || createAssetData.data;
    }

    console.log(`Using bookable asset ID: ${bookableAsset.id}`);

    const bookingStart = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    const bookingEnd = new Date(Date.now() + 7200000).toISOString(); // 2 hours from now

    // Create booking 1
    const booking1Res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        assetId: bookableAsset.id,
        startTime: bookingStart,
        endTime: bookingEnd
      })
    });
    const booking1Data = await booking1Res.json();
    if (!booking1Res.ok) throw new Error(`Booking 1 creation failed: ${JSON.stringify(booking1Data)}`);
    console.log('✅ Booking 1 created successfully.');

    // Try to create overlapping booking (booking 2)
    const booking2Res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        assetId: bookableAsset.id,
        startTime: new Date(Date.now() + 4500000).toISOString(), // Overlaps booking 1
        endTime: new Date(Date.now() + 6000000).toISOString()
      })
    });
    
    if (booking2Res.status === 400) {
      console.log('✅ Overlap check succeeded! Blocked overlapping slot as expected.');
    } else {
      throw new Error('Overlap check failed: expected 400 Bad Request, but got status ' + booking2Res.status);
    }

    console.log('\n🌟 Integration tests completed successfully! Everything is working correctly.');
  } catch (err) {
    console.error('\n❌ Integration tests failed:', err.message);
    process.exit(1);
  }
}

testAll();
