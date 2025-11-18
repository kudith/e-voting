/**
 * Image Compression Utility
 * Mengkompresi gambar sebelum disimpan atau diupload
 */

/**
 * Kompresi gambar menggunakan canvas
 * @param {File} file - File gambar yang akan dikompresi
 * @param {Object} options - Opsi kompresi
 * @param {number} options.maxWidth - Lebar maksimal (default: 1200)
 * @param {number} options.maxHeight - Tinggi maksimal (default: 1200)
 * @param {number} options.quality - Kualitas kompresi 0-1 (default: 0.8)
 * @param {string} options.mimeType - Tipe MIME output (default: image/jpeg)
 * @returns {Promise<File>} File gambar yang sudah dikompresi
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    // Validasi file
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File bukan gambar yang valid'));
      return;
    }

    // Buat image element
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    reader.onerror = (error) => {
      reject(new Error('Gagal membaca file: ' + error));
    };

    img.onload = () => {
      try {
        // Hitung dimensi baru dengan mempertahankan aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Buat canvas untuk resize dan compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        
        // Tambahkan background putih untuk PNG dengan transparansi
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Gambar image ke canvas dengan ukuran baru
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas ke blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal mengkompresi gambar'));
              return;
            }

            // Buat File object baru dari blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + getExtensionFromMimeType(mimeType),
              {
                type: mimeType,
                lastModified: Date.now(),
              }
            );

            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      } catch (error) {
        reject(new Error('Error saat kompresi: ' + error.message));
      }
    };

    img.onerror = () => {
      reject(new Error('Gagal memuat gambar'));
    };

    // Mulai membaca file
    reader.readAsDataURL(file);
  });
}

/**
 * Get file extension from MIME type
 * @param {string} mimeType - MIME type
 * @returns {string} File extension dengan dot
 */
function getExtensionFromMimeType(mimeType) {
  const extensions = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return extensions[mimeType] || '.jpg';
}

/**
 * Kompresi gambar dengan multiple quality attempts
 * Akan mencoba kompresi dengan quality yang berbeda sampai ukuran target tercapai
 * @param {File} file - File gambar
 * @param {number} targetSizeKB - Target ukuran dalam KB (default: 500)
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<File>} Compressed file
 */
export async function compressImageToTargetSize(file, targetSizeKB = 500, options = {}) {
  let quality = 0.9;
  let compressedFile = file;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    compressedFile = await compressImage(file, {
      ...options,
      quality,
    });

    const fileSizeKB = compressedFile.size / 1024;

    // Jika sudah mencapai target size atau quality terlalu rendah, stop
    if (fileSizeKB <= targetSizeKB || quality <= 0.3) {
      break;
    }

    // Kurangi quality untuk attempt berikutnya
    quality -= 0.15;
    attempts++;
  }

  return compressedFile;
}

/**
 * Validasi ukuran file
 * @param {File} file - File yang akan divalidasi
 * @param {number} maxSizeMB - Ukuran maksimal dalam MB
 * @returns {boolean} True jika valid
 */
export function validateFileSize(file, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validasi tipe file
 * @param {File} file - File yang akan divalidasi
 * @param {string[]} allowedTypes - Array tipe MIME yang diizinkan
 * @returns {boolean} True jika valid
 */
export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) {
  return allowedTypes.includes(file.type);
}

/**
 * Format file size untuk display
 * @param {number} bytes - Ukuran dalam bytes
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
