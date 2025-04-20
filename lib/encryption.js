import crypto from 'crypto';

// Ambil passphrase dari environment variable, dengan fallback yang aman
const PASSPHRASE = process.env.RSA_PASSPHRASE || 'your-secure-passphrase';
console.log("Using passphrase length:", PASSPHRASE.length); // Debug info

// Fungsi untuk mendapatkan kunci RSA yang valid
function getRSAKeys() {
  try {
    // Cek apakah kunci ada di environment variables
    const publicKeyFromEnv = process.env.RSA_PUBLIC_KEY;
    const privateKeyFromEnv = process.env.RSA_PRIVATE_KEY;

    if (publicKeyFromEnv && privateKeyFromEnv) {
      // Ganti \\n dengan \n untuk memastikan format PEM yang benar
      const publicKey = publicKeyFromEnv.replace(/\\n/g, '\n');
      const privateKey = privateKeyFromEnv.replace(/\\n/g, '\n');
      
      console.log("Found RSA keys in environment variables. Validating...");
      
      // Coba validasi kunci dengan operasi dummy 
      try {
        const testData = Buffer.from('test');
        const testEncrypted = crypto.publicEncrypt(
          { 
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
          }, 
          testData
        );
        
        try {
          // Coba decrypt dengan passphrase dari environment
          crypto.privateDecrypt(
            { 
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
              oaepHash: 'sha256',
              passphrase: PASSPHRASE 
            }, 
            testEncrypted
          );
          
          // Jika sampai di sini, berarti kunci valid dengan passphrase dari env
          console.log('RSA keys successfully loaded and validated');
          return { publicKey, privateKey };
        } catch (decryptError) {
          // Passphrase mungkin salah, coba tanpa passphrase
          console.error('Error with passphrase, trying without passphrase:', decryptError.message);
          
          try {
            crypto.privateDecrypt(
              { 
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
                // No passphrase
              }, 
              testEncrypted
            );
            
            // Berhasil tanpa passphrase
            console.log('RSA keys validated without passphrase');
            return { publicKey, privateKey, noPassphrase: true };
          } catch (noPassphraseError) {
            console.error('Failed validation without passphrase:', noPassphraseError.message);
            // Lanjut ke generate in-memory keys
          }
        }
      } catch (validationError) {
        console.error('Error validating keys from environment variables:', validationError.message);
        // Lanjut ke generate in-memory keys
      }
    } else {
      console.log("No RSA keys found in environment variables");
    }

    console.warn('Generating temporary in-memory RSA keys');
    console.warn('NOTE: For production, add valid RSA_PUBLIC_KEY and RSA_PRIVATE_KEY to your .env file');
    
    // Generate temporary keys
    const keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,  // 2048 bits cukup aman untuk temporary keys
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: PASSPHRASE
      }
    });
    
    // Validasi kunci yang baru dibuat
    try {
      const testData = Buffer.from('test');
      const testEncrypted = crypto.publicEncrypt(
        { 
          key: keypair.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256'
        }, 
        testData
      );
      
      crypto.privateDecrypt(
        { 
          key: keypair.privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
          passphrase: PASSPHRASE 
        }, 
        testEncrypted
      );
      
      console.log('Generated temporary RSA keys validated successfully');
    } catch (tempKeyError) {
      console.error('Error validating temporary keys:', tempKeyError.message);
    }
    
    return keypair;
  } catch (error) {
    console.error('Error getting RSA keys:', error.message);
    throw new Error(`Failed to initialize encryption system: ${error.message}`);
  }
}

// Dapatkan pasangan kunci RSA
const rsaKeyData = getRSAKeys();
const publicKey = rsaKeyData.publicKey;
const privateKey = rsaKeyData.privateKey;
const noPassphrase = rsaKeyData.noPassphrase === true;

// Fungsi untuk enkripsi hybrid
export function hybridEncrypt(data) {
  try {
    // Generate random AES key (32 bytes = 256 bits)
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt data with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    // Encrypt AES key with RSA
    const encryptedKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, 
      aesKey
    );

    return {
      encryptedData: encrypted,
      encryptedKey: encryptedKey.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error(`Failed to encrypt data: ${error.message}`);
  }
}

// Fungsi untuk dekripsi hybrid
export function hybridDecrypt(encryptedData, encryptedKey, iv, authTag) {
  try {
    // Decrypt AES key with RSA
    const encryptedKeyBuffer = Buffer.from(encryptedKey, 'base64');
    
    // Gunakan options yang tepat berdasarkan apakah private key memerlukan passphrase
    const decryptOptions = {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    };
    
    // Tambahkan passphrase hanya jika diperlukan
    if (!noPassphrase) {
      decryptOptions.passphrase = PASSPHRASE;
    }
    
    const decryptedKey = crypto.privateDecrypt(decryptOptions, encryptedKeyBuffer);

    // Decrypt data with AES-256-GCM
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm', 
      decryptedKey, 
      Buffer.from(iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}

// Fungsi untuk menghasilkan hash yang aman
export function generateSecureHash(data) {
  return crypto.createHash('sha512').update(data).digest('hex');
}

// Fungsi untuk memverifikasi hash
export function verifyHash(data, hash) {
  const computedHash = generateSecureHash(data);
  return computedHash === hash;
}

// Export fungsi untuk generate kunci (berguna untuk setup awal)
export function generateAndReturnRSAKeys() {
  const keypair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: PASSPHRASE
    }
  });
  
  return {
    publicKey: keypair.publicKey,
    privateKey: keypair.privateKey,
    passphrase: PASSPHRASE
  };
} 