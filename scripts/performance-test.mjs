#!/usr/bin/env node

import { spawn } from "node:child_process"
import http from "node:http"
import { performance } from "node:perf_hooks"

const TEST_PORT = 3002
const TEST_URL = `http://127.0.0.1:${TEST_PORT}`

console.log('[HisarWeb Starter] 🚀 Performance Testing Suite')
console.log('='.repeat(50))

async function waitForServer(url, timeout = 60000) {
  const start = Date.now()

  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url + '/api/health', (res) => {
          if (res.statusCode === 200) {
            resolve()
          } else {
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        })
        req.on('error', reject)
        req.setTimeout(2000, () => {
          req.destroy()
          reject(new Error('Timeout'))
        })
      })
      return true
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  return false
}

async function testEndpoint(path, description) {
  const start = performance.now()

  return new Promise((resolve) => {
    const req = http.get(TEST_URL + path, (res) => {
      const end = performance.now()
      const duration = end - start

      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        resolve({
          path,
          description,
          status: res.statusCode,
          duration: Math.round(duration),
          size: Buffer.byteLength(body, 'utf8')
        })
      })
    })

    req.on('error', () => {
      const end = performance.now()
      resolve({
        path,
        description,
        status: 'ERROR',
        duration: Math.round(end - start),
        size: 0
      })
    })

    req.setTimeout(10000, () => {
      req.destroy()
      resolve({
        path,
        description,
        status: 'TIMEOUT',
        duration: 10000,
        size: 0
      })
    })
  })
}

async function runPerformanceTests() {
  console.log('📊 Starting performance tests...\n')

  // Test endpoints
  const tests = [
    { path: '/api/health', description: 'Health Check' },
    { path: '/nl', description: 'Dutch Homepage' },
    { path: '/en', description: 'English Homepage' },
    { path: '/nl/about', description: 'About Page (NL)' },
    { path: '/nl/contact', description: 'Contact Page (NL)' },
    { path: '/nl/services', description: 'Services Page (NL)' },
    { path: '/api/trpc/content.overview', description: 'tRPC Content API' }
  ]

  console.log('Running single request tests...')
  const results = []

  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description)
    results.push(result)

    const status = result.status === 200 ? '✅' : '❌'
    console.log(`${status} ${result.description}: ${result.duration}ms (${result.status})`)
  }

  console.log('\n📈 Performance Summary:')
  console.log('='.repeat(50))

  results.forEach(result => {
    const statusIcon = result.status === 200 ? '✅' : result.status === 'TIMEOUT' ? '⏱️' : '❌'
    console.log(`${statusIcon} ${result.description.padEnd(20)} | ${String(result.duration).padStart(6)}ms | ${String(result.size).padStart(8)} bytes`)
  })

  // Calculate averages
  const successful = results.filter(r => r.status === 200)
  if (successful.length > 0) {
    const avgDuration = Math.round(successful.reduce((sum, r) => sum + r.duration, 0) / successful.length)
    console.log('\n📊 Average response time:', avgDuration + 'ms')

    // Performance recommendations
    console.log('\n💡 Performance Analysis:')
    if (avgDuration < 100) {
      console.log('✅ Excellent performance (< 100ms average)')
    } else if (avgDuration < 300) {
      console.log('✅ Good performance (< 300ms average)')
    } else if (avgDuration < 1000) {
      console.log('⚠️ Acceptable performance (< 1s average) - consider optimization')
    } else {
      console.log('❌ Poor performance (> 1s average) - optimization needed')
    }
  }

  return results
}

async function runLoadTest() {
  console.log('\n🔥 Running basic load test (10 concurrent requests)...')

  const concurrentRequests = 10
  const promises = []

  const startTime = performance.now()

  for (let i = 0; i < concurrentRequests; i++) {
    promises.push(testEndpoint('/nl', `Load Test ${i + 1}`))
  }

  const results = await Promise.all(promises)
  const endTime = performance.now()

  const successful = results.filter(r => r.status === 200)
  const failed = results.length - successful.length

  console.log(`📊 Load Test Results:`)
  console.log(`   Total requests: ${results.length}`)
  console.log(`   Successful: ${successful.length}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Total time: ${Math.round(endTime - startTime)}ms`)
  console.log(`   Requests/second: ${Math.round((results.length * 1000) / (endTime - startTime))}`)

  if (successful.length > 0) {
    const avgDuration = Math.round(successful.reduce((sum, r) => sum + r.duration, 0) / successful.length)
    console.log(`   Average response time: ${avgDuration}ms`)
  }

  return results
}

async function main() {
  try {
    // Start the server
    console.log('🚀 Starting test server...')
    const serverProcess = spawn('node', ['--env-file=.env', 'scripts/start-standalone.mjs'], {
      env: {
        ...process.env,
        PORT: TEST_PORT,
        HOSTNAME: '127.0.0.1',
        NEXT_TELEMETRY_DISABLED: '1',
        NODE_ENV: 'production'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    })

    // Wait for server to be ready
    console.log('⏳ Waiting for server to start...')
    const serverReady = await waitForServer(TEST_URL)

    if (!serverReady) {
      console.error('❌ Server failed to start within timeout')
      serverProcess.kill()
      process.exit(1)
    }

    console.log('✅ Server ready!\n')

    // Run performance tests
    await runPerformanceTests()

    // Run load test
    await runLoadTest()

    console.log('\n✅ Performance testing completed!')

    // Clean up
    serverProcess.kill()

  } catch (error) {
    console.error('❌ Performance test failed:', error.message)
    process.exit(1)
  }
}

main()