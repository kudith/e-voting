const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Passphrase default (akan digunakan jika lingkungan tidak menyediakan)
const DEFAULT_PASSPHRASE = 'kanjut-anjinggasngjdsng-lieurrrr';

// Fungsi untuk mendapatkan passphrase dari environment variable atau menggunakan default
function getPassphrase() {
  return process.env.RSA_PASSPHRASE || DEFAULT_PASSPHRASE;
}

// Generate RSA key pair dengan passphrase
function generateRSAKeysWithPassphrase() {
  const passphrase = getPassphrase();
  
  console.log(`Generating RSA key pair WITH passphrase (${passphrase.length} characters)...`);
  
  const keypair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // 2048 bit cukup aman dan memiliki performa lebih baik
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: passphrase
    }
  });
  
  return {
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey,
    passphrase: passphrase
  };
}

// Generate RSA key pair tanpa passphrase
function generateRSAKeysWithoutPassphrase() {
  console.log('Generating RSA key pair WITHOUT passphrase...');
  
  const keypair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  return {
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey
  };
}

// Format kunci untuk .env file
function formatForEnv(key) {
  return key.replace(/\n/g, '\\n');
}

// Verifikasi kunci dengan melakukan test encrypt/decrypt
function verifyKeys(keys, withPassphrase = true) {
  try {
    const testData = Buffer.from('test-verification-data');
    
    // Enkripsi menggunakan public key
    const encrypted = crypto.publicEncrypt(
      { 
        key: keys.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, 
      testData
    );
    
    // Dekripsi menggunakan private key
    const decryptOptions = {
      key: keys.privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    };
    
    // Tambahkan passphrase jika menggunakan kunci dengan passphrase
    if (withPassphrase) {
      decryptOptions.passphrase = keys.passphrase;
    }
    
    const decrypted = crypto.privateDecrypt(decryptOptions, encrypted);
    
    // Verifikasi bahwa data yang didekripsi sama dengan data asli
    if (decrypted.toString() !== testData.toString()) {
      throw new Error('Verification failed: decrypted data does not match original');
    }
    
    console.log('Keys successfully verified with test encryption/decryption');
    return true;
  } catch (error) {
    console.error('Error verifying keys:', error.message);
    return false;
  }
}

// Simpan kunci ke file (opsional)
function saveKeysToFiles(keys, withPassphrase = true) {
  const keysDir = path.join(__dirname, 'keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }
  
  const suffix = withPassphrase ? '-with-passphrase' : '-no-passphrase';
  
  // Simpan public key
  fs.writeFileSync(
    path.join(keysDir, `public-key${suffix}.pem`), 
    keys.publicKey,
    { mode: 0o644 } // Readable untuk semua
  );
  
  // Simpan private key dengan izin yang lebih ketat
  fs.writeFileSync(
    path.join(keysDir, `private-key${suffix}.pem`), 
    keys.privateKey,
    { mode: 0o600 } // Hanya readable untuk owner
  );
  
  console.log(`Keys saved to files in ${keysDir} directory`);
}

// Generate kedua jenis kunci
console.log("\n======= GENERATING RSA KEYS =======");

// 1. Generate dan verifikasi kunci dengan passphrase
const keysWithPassphrase = generateRSAKeysWithPassphrase();
const withPassphraseValid = verifyKeys(keysWithPassphrase, true);

// 2. Generate dan verifikasi kunci tanpa passphrase
const keysWithoutPassphrase = generateRSAKeysWithoutPassphrase();
const withoutPassphraseValid = verifyKeys(keysWithoutPassphrase, false);

// Opsional: simpan kunci ke file
// saveKeysToFiles(keysWithPassphrase, true);
// saveKeysToFiles(keysWithoutPassphrase, false);

// Tampilkan hasil untuk .env
console.log("\n======= RSA KEYS FOR .ENV =======");
console.log("# Salin kunci-kunci berikut ke file .env Anda");
console.log("# PERINGATAN: Jaga kerahasiaan file .env dan jangan commit ke version control!\n");

if (withPassphraseValid) {
  console.log("## OPSI 1: Kunci dengan Passphrase (lebih aman)");
  console.log(`RSA_PUBLIC_KEY="${formatForEnv(keysWithPassphrase.publicKey)}"`);
  console.log(`RSA_PRIVATE_KEY="${formatForEnv(keysWithPassphrase.privateKey)}"`);
  console.log(`RSA_PASSPHRASE="${keysWithPassphrase.passphrase}"`);
  console.log("# Pastikan untuk mengubah passphrase default di atas untuk keamanan!\n");
}

if (withoutPassphraseValid) {
  console.log("## OPSI 2: Kunci tanpa Passphrase (lebih sederhana)");
  console.log(`RSA_PUBLIC_KEY="${formatForEnv(keysWithoutPassphrase.publicKey)}"`);
  console.log(`RSA_PRIVATE_KEY="${formatForEnv(keysWithoutPassphrase.privateKey)}"`);
  console.log("# Tidak perlu mengatur RSA_PASSPHRASE untuk kunci ini\n");
}

console.log("======= PETUNJUK PENGGUNAAN =======");
console.log("1. Salin salah satu set kunci (OPSI 1 ATAU OPSI 2) ke file .env Anda");
console.log("2. Restart server agar perubahan diterapkan");
console.log("3. Jika menggunakan OPSI 1, pastikan RSA_PASSPHRASE diubah dari nilai default");
console.log("==============================="); 