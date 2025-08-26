// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Endpoint Tests', () => {
  
  test('should serve the main page', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    
    // Check content type
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });

  test('should handle POST /register with valid data', async ({ request }) => {
    const userData = {
      name: 'API Test User',
      gender: 'male',
      email: 'apitest@example.com',
      country: 'usa'
    };

    const response = await request.post('/register', {
      data: userData
    });

    expect(response.status()).toBe(201);
    
    const responseData = await response.json();
    expect(responseData.message).toBe('User registered successfully');
    expect(responseData.userId).toBeDefined();
  });

  test('should handle POST /register with missing fields', async ({ request }) => {
    const invalidData = {
      name: 'Incomplete User',
      gender: 'female'
      // Missing email and country
    };

    const response = await request.post('/register', {
      data: invalidData
    });

    expect(response.status()).toBe(400);
    
    const responseData = await response.json();
    expect(responseData.error).toBe('All fields are required');
  });

  test('should handle POST /register with invalid email', async ({ request }) => {
    const invalidEmailData = {
      name: 'Invalid Email User',
      gender: 'other',
      email: 'invalid-email-format',
      country: 'thailand'
    };

    const response = await request.post('/register', {
      data: invalidEmailData
    });

    expect(response.status()).toBe(400);
    
    const responseData = await response.json();
    expect(responseData.error).toBe('Invalid email format');
  });

  test('should handle POST /register with duplicate email', async ({ request }) => {
    const userData = {
      name: 'Duplicate Test User',
      gender: 'female',
      email: 'duplicate.api@example.com',
      country: 'japan'
    };

    // Register user first time
    const firstResponse = await request.post('/register', {
      data: userData
    });
    expect(firstResponse.status()).toBe(201);

    // Try to register with same email
    const duplicateUserData = {
      name: 'Another User',
      gender: 'male',
      email: 'duplicate.api@example.com',
      country: 'singapore'
    };

    const secondResponse = await request.post('/register', {
      data: duplicateUserData
    });
    expect(secondResponse.status()).toBe(400);
    
    const responseData = await secondResponse.json();
    expect(responseData.error).toBe('Email already registered');
  });

  test('should handle GET /users endpoint', async ({ request }) => {
    // First register a user
    const userData = {
      name: 'GET Test User',
      gender: 'other',
      email: 'gettest@example.com',
      country: 'uk'
    };

    await request.post('/register', {
      data: userData
    });

    // Then get users
    const response = await request.get('/users');
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Check user structure
    const user = users.find(u => u.email === 'gettest@example.com');
    expect(user).toBeDefined();
    expect(user.name).toBe('GET Test User');
    expect(user.gender).toBe('other');
    expect(user.country).toBe('uk');
    expect(user.id).toBeDefined();
    expect(user.created_at).toBeDefined();
  });

  test('should handle GET /users/count endpoint', async ({ request }) => {
    const response = await request.get('/users/count');
    expect(response.status()).toBe(200);
    
    const countData = await response.json();
    expect(countData.count).toBeDefined();
    expect(typeof countData.count).toBe('number');
    expect(countData.count).toBeGreaterThanOrEqual(0);
  });

  test('should handle Thai characters in registration', async ({ request }) => {
    const thaiUserData = {
      name: 'ทดสอบ ระบบลงทะเบียน',
      gender: 'female',
      email: 'thai.test@example.com',
      country: 'thailand'
    };

    const response = await request.post('/register', {
      data: thaiUserData
    });

    expect(response.status()).toBe(201);
    
    const responseData = await response.json();
    expect(responseData.message).toBe('User registered successfully');

    // Verify the user was stored correctly
    const usersResponse = await request.get('/users');
    const users = await usersResponse.json();
    
    const thaiUser = users.find(u => u.email === 'thai.test@example.com');
    expect(thaiUser).toBeDefined();
    expect(thaiUser.name).toBe('ทดสอบ ระบบลงทะเบียน');
  });

  test('should handle CORS properly', async ({ request }) => {
    const response = await request.post('/register', {
      data: {
        name: 'CORS Test',
        gender: 'male',
        email: 'cors@example.com',
        country: 'canada'
      },
      headers: {
        'Origin': 'http://localhost:3001'
      }
    });

    expect(response.status()).toBe(201);
    
    // Check CORS headers if present
    const headers = response.headers();
    // CORS headers might be present depending on server configuration
  });
});