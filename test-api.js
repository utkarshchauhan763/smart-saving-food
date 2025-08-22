// Test script for Smart Saving Food API
import fetch from 'node-fetch';
const API_BASE = 'http://localhost:5000';

async function testAPI() {
    console.log('🧪 Testing Smart Saving Food API...\n');

    try {
        // Test 1: Health Check
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch(`${API_BASE}`);
        const healthData = await healthResponse.json();
        console.log('✅ Health Check:', healthData.message);
        console.log('📊 Status:', healthData.status);
        console.log('🔗 Endpoints:', Object.keys(healthData.endpoints).join(', '));
        console.log('');

        // Test 2: Register User
        console.log('2. Testing user registration...');
        const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test Student',
                email: 'test@example.com',
                password: 'password123',
                role: 'student'
            })
        });
        
        const registerData = await registerResponse.json();
        if (registerData.success) {
            console.log('✅ User registered successfully');
            console.log('👤 User ID:', registerData.user.id);
            console.log('🔑 Token received');
        } else {
            console.log('⚠️ Registration response:', registerData.message);
        }
        console.log('');

        // Test 3: Login User
        console.log('3. Testing user login...');
        const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        if (loginData.success) {
            console.log('✅ Login successful');
            console.log('👤 User:', loginData.user.name);
            console.log('🎭 Role:', loginData.user.role);
            
            // Save token for further tests
            const token = loginData.token;
            
            // Test 4: Get Menu (requires authentication)
            console.log('');
            console.log('4. Testing menu endpoint...');
            const menuResponse = await fetch(`${API_BASE}/api/menu/today`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const menuData = await menuResponse.json();
            if (menuData.success) {
                console.log('✅ Menu retrieved successfully');
                console.log('📅 Date:', menuData.menu?.date || 'No menu found');
            } else {
                console.log('⚠️ Menu response:', menuData.message);
            }
            
        } else {
            console.log('❌ Login failed:', loginData.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the tests
testAPI();
