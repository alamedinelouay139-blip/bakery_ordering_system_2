const API_BASE = 'http://localhost:5000/api';
let authToken = '';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

async function testAPI(name, method, endpoint, body = null, useAuth = false) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (useAuth && authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const options = {
            method,
            headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        log(`\n🧪 Testing: ${name}`, 'blue');
        log(`   ${method} ${endpoint}`, 'yellow');

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (response.ok) {
            log(`   ✅ Success (${response.status})`, 'green');
            console.log('   Response:', data);
            return { success: true, data, status: response.status };
        } else {
            log(`   ❌ Failed (${response.status})`, 'red');
            console.log('   Error:', data);
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        log(`   ❌ Error: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function runTests() {
    log('\n' + '='.repeat(60), 'blue');
    log('🥐 BAKERY API TEST SUITE', 'blue');
    log('='.repeat(60) + '\n', 'blue');

    const testUser = {
        name: 'API Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    // 1. Test Registration
    const registerResult = await testAPI(
        'User Registration',
        'POST',
        '/auth/register',
        testUser
    );

    // 2. Test Login
    const loginResult = await testAPI(
        'User Login',
        'POST',
        '/auth/login',
        {
            email: testUser.email,
            password: testUser.password
        }
    );

    if (loginResult.success && loginResult.data.token) {
        authToken = loginResult.data.token;
        log('\n🔑 Auth token received and saved', 'green');
    }

    // 3. Test Create Product (requires auth)
    const productData = {
        name: 'Test Croissant',
        description: 'Delicious butter croissant',
        price: 3.50,
        stock: 100,
        is_active: 1
    };

    const createProductResult = await testAPI(
        'Create Product',
        'POST',
        '/products',
        productData,
        true
    );

    let productId = null;
    if (createProductResult.success && createProductResult.data.id) {
        productId = createProductResult.data.id;
    }

    // 4. Test Get All Products (requires auth)
    await testAPI(
        'Get All Products',
        'GET',
        '/products',
        null,
        true
    );

    // 5. Test Get Single Product (requires auth)
    if (productId) {
        await testAPI(
            'Get Single Product',
            'GET',
            `/products/${productId}`,
            null,
            true
        );

        // 6. Test Update Product (requires auth)
        await testAPI(
            'Update Product',
            'PUT',
            `/products/${productId}`,
            {
                name: 'Updated Croissant',
                description: 'Extra buttery croissant',
                price: 4.00,
                stock: 150
            },
            true
        );

        // 7. Test Delete Product (requires auth)
        await testAPI(
            'Delete Product',
            'DELETE',
            `/products/${productId}`,
            null,
            true
        );
    }

    // 8. Test Audit Logs (requires auth)
    await testAPI(
        'Get Audit Logs',
        'GET',
        '/audit-logs',
        null,
        true
    );

    // 9. Test without authentication (should fail)
    await testAPI(
        'Get Products Without Auth (should fail)',
        'GET',
        '/products',
        null,
        false
    );

    log('\n' + '='.repeat(60), 'blue');
    log('✨ TEST SUITE COMPLETED', 'blue');
    log('='.repeat(60) + '\n', 'blue');
}

// Run the tests
runTests().catch(console.error);
