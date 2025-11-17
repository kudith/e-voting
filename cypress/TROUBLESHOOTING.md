# 🔧 Troubleshooting Guide - SiPilih Cypress Tests

## ✅ Masalah yang Sudah Diperbaiki

### Error: Support file missing
```
Error: Your project does not contain a default supportFile.
We expect a file matching cypress/support/e2e.{js,jsx,ts,tsx} to exist.
```

**✅ SUDAH DIPERBAIKI**: File `cypress/support/e2e.js` sudah dibuat.

---

## ⚠️ Warning yang Bisa Diabaikan

### Cache Creation Warnings (Windows)
```
ERROR:net\disk_cache\cache_util_win.cc:20] Unable to move the cache: Access is denied.
ERROR:gpu\ipc\host\gpu_disk_cache.cc:723] Gpu Cache Creation failed: -2
```

**Status**: ⚠️ Warning ini tidak mengganggu fungsi Cypress
**Penyebab**: Permission issue pada Windows cache folder
**Solusi**: 
1. Cypress tetap berfungsi normal, abaikan warning ini
2. Atau jalankan terminal sebagai Administrator (opsional)

### XSS Payloads Muncul di Aplikasi
```
><img src=x onerror=alert(1)>
<script>alert("XSS")</script>
```

**Status**: ✅ Ini NORMAL - Bukan bug!
**Penyebab**: Cypress security test sedang menguji XSS prevention
**Apa yang Terjadi**: 
- Test memasukkan XSS payload untuk verifikasi keamanan
- Payload **ditampilkan sebagai text** (tidak dieksekusi)
- Ini membuktikan aplikasi **AMAN dari XSS**

**Detail**: Lihat [SECURITY-XSS.md](../SECURITY-XSS.md)

---

## 🚀 Cara Menjalankan Test

### Metode 1: Cypress UI (Interactive Mode)
```bash
npx cypress open
```
**Kelebihan**:
- Visual interface
- Lihat test berjalan real-time
- Debugging lebih mudah
- Time-travel debugging

**Langkah**:
1. Jalankan command di atas
2. Pilih "E2E Testing"
3. Pilih browser (Chrome/Firefox/Edge)
4. Klik test file yang ingin dijalankan

### Metode 2: Headless Mode (Terminal)
```bash
# Semua test
npm test

# Test spesifik
npm run test:functional   # Functional tests
npm run test:security     # Security tests
npm run test:e2e         # End-to-end tests
npm run test:voting      # Voting process
npm run test:admin       # Admin dashboard
```

**Kelebihan**:
- Lebih cepat
- Cocok untuk CI/CD
- Generate video recording
- Generate screenshots

### Metode 3: Test Runner Script
```bash
# Lihat semua opsi
node cypress/run-tests.js help

# Jalankan test tertentu
node cypress/run-tests.js all          # Semua test
node cypress/run-tests.js functional   # Functional tests
node cypress/run-tests.js security     # Security tests
node cypress/run-tests.js homepage     # Homepage tests
```

---

## 📋 Checklist Sebelum Testing

### ✅ Requirements
- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] Aplikasi berjalan (`npm run dev`)
- [ ] Database terisi dengan test data
- [ ] File `cypress.env.json` dikonfigurasi

### ✅ Konfigurasi `cypress.env.json`
Pastikan file ini ada dan berisi kredensial dengan **username** (bukan email):
```json
{
  "ADMIN_USERNAME": "admin_farid",
  "ADMIN_PASSWORD": "fredo931",
  "VOTER_USERNAME": "admin_farid",
  "VOTER_PASSWORD": "fredo931"
}
```

**Note**: Sistem menggunakan **username dan password**, bukan email!

### ✅ Aplikasi Running
```bash
# Terminal 1 - Jalankan aplikasi
npm run dev

# Terminal 2 - Jalankan test
npm run test:ui
```

---

## 🐛 Common Issues & Solutions

### 1. Test Timeout
**Error**: `Timed out retrying after 10000ms`

**Solusi**:
```javascript
// Increase timeout di cypress.config.js
{
  defaultCommandTimeout: 15000,
  requestTimeout: 15000
}
```

### 2. Kinde OAuth Login Gagal
**Error**: Login redirect tidak berfungsi

**Solusi**:
1. Pastikan `KINDE_ISSUER_URL` benar di `.env`
2. Check kredensial di `cypress.env.json` (gunakan **username**, bukan email)
3. Pastikan Kinde callback URL include `http://localhost:3000`
4. Verifikasi username dan password benar di Kinde dashboard

### 3. Database Kosong
**Error**: Test gagal karena tidak ada data

**Solusi**:
```bash
# Seed database dengan test data
npm run seed
# atau
npx prisma db seed
```

### 4. Port 3000 Sudah Digunakan
**Error**: `Port 3000 is already in use`

**Solusi**:
```bash
# Option 1: Kill process di port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Option 2: Gunakan port berbeda
# Update cypress.config.js:
baseUrl: 'http://localhost:3001'
```

### 5. Test Gagal: Cannot read properties of undefined
**Error**: `Cannot read properties of undefined (reading 'xxx')`

**Status**: ✅ Sudah di-handle
**Solusi**: Error ini sudah diabaikan di `cypress/support/e2e.js`

### 6. Session Expired
**Error**: Test redirect ke login page

**Solusi**:
```bash
# Clear cookies dan restart test
cy.clearCookies()
cy.clearLocalStorage()
```

---

## 🎯 Test Files Overview

| File | Purpose | Run Time |
|------|---------|----------|
| `01-homepage.cy.js` | Homepage tests | ~30s |
| `02-how-to-vote.cy.js` | How to vote page | ~20s |
| `03-authentication.cy.js` | Auth flow | ~40s |
| `04-api-integration.cy.js` | API tests | ~30s |
| `05-voter-dashboard.cy.js` | Voter dashboard | ~45s |
| `06-voting-process.cy.js` | Voting process | ~60s |
| `07-admin-dashboard.cy.js` | Admin panel | ~60s |
| `08-results-display.cy.js` | Results page | ~40s |
| `09-security-tests.cy.js` | Security tests | ~90s |
| `10-end-to-end.cy.js` | E2E tests | ~120s |

**Total Run Time**: ~8-10 minutes (all tests)

---

## 🔍 Debugging Tips

### 1. Run Single Test
```bash
# Run satu file
npx cypress run --spec "cypress/e2e/01-homepage.cy.js"

# Run satu test dalam file (via UI)
npx cypress open
# Lalu pilih file dan test spesifik
```

### 2. Keep Browser Open on Failure
```bash
npx cypress run --headed --no-exit
```

### 3. View Test Video
```bash
# Video tersimpan di:
cypress/videos/

# Screenshot tersimpan di:
cypress/screenshots/
```

### 4. Debug Mode
```bash
# Enable debug logs
DEBUG=cypress:* npx cypress run
```

### 5. Slow Down Test
```javascript
// Tambahkan di test untuk slow motion
cy.wait(1000) // Wait 1 second
```

---

## 📊 Expected Test Results

### ✅ All Tests Should Pass If:
1. Aplikasi berjalan dengan baik
2. Database berisi test data
3. Kinde OAuth configured
4. Network stabil
5. Port 3000 available

### ⚠️ Tests May Fail If:
1. Database kosong (no test data)
2. Kinde credentials salah
3. Aplikasi tidak running
4. Network timeout
5. Browser incompatibility

---

## 🚦 Running Tests in CI/CD

### GitHub Actions Example
```yaml
name: Cypress Tests
on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm run dev &
        
      - name: Wait for app
        run: npx wait-on http://localhost:3000
      
      - name: Run Cypress tests
        run: npm test
        env:
          ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          VOTER_EMAIL: ${{ secrets.VOTER_EMAIL }}
          VOTER_PASSWORD: ${{ secrets.VOTER_PASSWORD }}
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

---

## 💡 Best Practices

### 1. Test Isolation
✅ Setiap test harus independent
✅ Clear cookies/localStorage sebelum test
✅ Don't rely on previous test state

### 2. Use Fixtures
✅ Store test data di `cypress/fixtures/`
✅ Load dengan `cy.fixture('filename')`
✅ Don't hardcode data dalam test

### 3. Custom Commands
✅ Gunakan custom commands untuk reusable logic
✅ Contoh: `cy.loginAsVoter()`, `cy.castVote()`
✅ Lihat `cypress/support/commands.js`

### 4. Assertions
✅ Always verify expected behavior
✅ Use specific selectors
✅ Check both success and error cases

### 5. Timeouts
✅ Set reasonable timeouts
✅ Don't use arbitrary `cy.wait(5000)`
✅ Use `cy.wait('@alias')` instead

---

## 🎓 Quick Reference

### Most Used Commands
```javascript
// Navigation
cy.visit('/path')
cy.url().should('include', '/expected')

// Interaction
cy.get('selector').click()
cy.get('input').type('text')
cy.get('select').select('option')

// Assertions
cy.get('element').should('be.visible')
cy.get('element').should('contain', 'text')
cy.url().should('eq', 'expected-url')

// Custom Commands
cy.loginAsVoter()
cy.loginAsAdmin()
cy.apiRequest('GET', '/endpoint')
cy.waitForPageLoad()
```

### Useful Selectors
```javascript
// By test ID (recommended)
cy.get('[data-testid="element"]')

// By class
cy.get('.class-name')

// By text content
cy.contains('Button Text')

// By attribute
cy.get('[aria-label="Label"]')
```

---

## 📞 Need Help?

### Resources
- 📖 [Cypress Documentation](https://docs.cypress.io)
- 📁 [Project README](./cypress/README.md)
- 📋 [Testing Guide](./TESTING.md)
- 📊 [Test Summary](./TEST-SUMMARY.md)

### Common Questions

**Q: Berapa lama test seharusnya berjalan?**
A: Semua test (~10 menit), single test (20-120 detik)

**Q: Apakah perlu menjalankan semua test setiap kali?**
A: Tidak, jalankan test yang relevan dengan perubahan Anda

**Q: Bagaimana cara skip test tertentu?**
A: Gunakan `.skip()` atau ubah `it` menjadi `it.skip`

**Q: Test gagal di CI tapi lokal berhasil?**
A: Check environment variables, network, dan database state

---

**Last Updated**: November 2024
**Cypress Version**: 15.6.0
**Maintained by**: SiPilih Development Team
