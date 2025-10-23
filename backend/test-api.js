// Simple API test script for Review Hub

const http = require('http');

// Test configuration
const HOST = 'localhost';
const PORT = 3000;

// Test cases
const testCases = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/api/health'
  },
  {
    name: 'Get Reviews',
    method: 'GET',
    path: '/api/reviews'
  },
  {
    name: 'Get Categories',
    method: 'GET',
    path: '/api/reviews/categories'
  },
  {
    name: 'Search Reviews',
    method: 'GET',
    path: '/api/reviews/search?query=test'
  },
  {
    name: 'Get Review by ID',
    method: 'GET',
    path: '/api/reviews/1'
  },
  {
    name: 'User Registration',
    method: 'POST',
    path: '/api/users/register',
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    }
  },
  {
    name: 'User Login',
    method: 'POST',
    path: '/api/users/login',
    data: {
      email: 'test@example.com',
      password: 'password123'
    }
  }
];

// Function to make HTTP requests
function makeRequest(testCase, callback) {
  const options = {
    hostname: HOST,
    port: PORT,
    path: testCase.path,
    method: testCase.method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback(null, {
          statusCode: res.statusCode,
          data: jsonData
        });
      } catch (e) {
        callback(null, {
          statusCode: res.statusCode,
          data: data
        });
      }
    });
  });

  req.on('error', (e) => {
    callback(e, null);
  });

  if (testCase.data) {
    req.write(JSON.stringify(testCase.data));
  }

  req.end();
}

// Run tests
console.log('Running API tests...\n');

let passed = 0;
let failed = 0;

function runTest(index) {
  if (index >= testCases.length) {
    console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
    return;
  }

  const testCase = testCases[index];
  console.log(`Testing: ${testCase.name} (${testCase.method} ${testCase.path})`);

  makeRequest(testCase, (error, response) => {
    if (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      failed++;
    } else {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log(`  ✅ Passed (${response.statusCode})`);
        passed++;
      } else {
        console.log(`  ❌ Failed (${response.statusCode}): ${JSON.stringify(response.data)}`);
        failed++;
      }
    }
    
    // Run next test
    setTimeout(() => runTest(index + 1), 500);
  });
}

// Start tests
runTest(0);