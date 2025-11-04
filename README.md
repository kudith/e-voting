# 🗳️ SiPilih - Sistem E-Voting Berbasis Web

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.5.0-2D3748?style=for-the-badge&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Platform pemungutan suara elektronik yang aman, transparan, dan terenkripsi untuk lingkungan akademik.**

[Demo](https://sipilih.vercel.app) • [Dokumentasi](#dokumentasi) • [Instalasi](#instalasi) • [Kontribusi](#kontribusi)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Arsitektur Keamanan](#arsitektur-keamanan)
- [Flow Voting](#flow-voting)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
- [Struktur Database](#struktur-database)
- [API Routes](#api-routes)
- [Roadmap](#roadmap)
- [Deployment](#deployment)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)
- [Kontak](#kontak)

---

## 🎯 Tentang Proyek

**SiPilih** adalah sistem pemungutan suara elektronik (e-voting) yang dirancang khusus untuk lingkungan akademik dengan fokus pada keamanan, transparansi, dan integritas data. Sistem ini mengimplementasikan **Hybrid Encryption (AES-256-GCM + RSA-4096)** dan **SHA-256 Hashing** untuk memastikan setiap suara tercatat dengan aman dan dapat diverifikasi.

### Latar Belakang

Sistem ini dikembangkan untuk menjawab kebutuhan akan pemilihan umum digital yang:

- **Aman**: Menggunakan enkripsi hybrid AES-256-GCM dan RSA-4096 untuk melindungi data pemilih
- **Transparan**: Setiap vote menghasilkan hash unik yang dapat diverifikasi pemilih
- **Efisien**: Proses real-time untuk pembaruan langsung
- **Accessible**: Interface modern dan responsif untuk berbagai perangkat
- **Auditable**: Vote hash memungkinkan pemilih memverifikasi suara mereka tercatat dengan benar

---

## ✨ Fitur Utama

### 🔐 Keamanan Berlapis

- **Hybrid Encryption**:
  - AES-256-GCM untuk enkripsi data suara
  - RSA-4096 untuk enkripsi AES key
  - Authentication Tag (GCM) untuk integritas data
- **SHA-256 Hashing**: Setiap vote menghasilkan hash unik untuk verifikasi
- **Vote Hash Verification**: Pemilih menerima hash untuk memastikan suara tercatat
- **Autentikasi Multi-Level**: Kinde Auth untuk admin dan pemilih
- **Voter Code System**: Kode unik untuk setiap pemilih
- **Database Transaction**: Atomic operations untuk konsistensi data

### 📊 Manajemen Pemilu

- Dashboard admin komprehensif untuk pengelolaan pemilu
- Sistem kandidat dengan profil lengkap (visi, misi, program kerja)
- Manajemen pemilih berdasarkan fakultas dan jurusan
- Pengaturan periode pemilu dengan status dinamis
- Validasi waktu voting otomatis

### 📈 Statistik & Analytics

- Real-time vote counting
- Tingkat partisipasi pemilih
- Visualisasi data dengan Recharts
- Statistik per kandidat dan per fakultas
- Tracking status voting per pemilih

### 👥 Manajemen User

- **Admin**: Pengelolaan penuh sistem pemilu
- **Voter**: Interface voting yang intuitif dan aman
- Multi-tenant support untuk fakultas dan jurusan
- Eligibility checking otomatis

### 🎨 User Experience

- Modern UI dengan Radix UI dan Tailwind CSS
- Dark mode support dengan next-themes
- Responsive design untuk mobile dan desktop
- Loading states dan error handling yang baik
- Toast notifications dengan Sonner
- Vote confirmation dengan hash display

---

## 🛠️ Teknologi

### Frontend

- **Framework**: [Next.js 15.2.3](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.0.0](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Tabler Icons](https://tabler.io/icons), [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend

- **Runtime**: Node.js
- **Database**: [MongoDB](https://www.mongodb.com/) dengan [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Kinde Auth](https://kinde.com/), [NextAuth.js](https://next-auth.js.org/)

### Data Management

- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)

### Security & Encryption

- **Encryption**: AES-256-GCM, RSA-4096
- **Hashing**: SHA-256, bcryptjs
- **JWT**: jsonwebtoken

---

## 🔒 Arsitektur Keamanan

Sistem saat ini menggunakan **Hybrid Encryption** dan **SHA-256 Hashing** yang sudah sangat aman untuk menjamin kerahasiaan dan integritas data voting.

### 1. Hybrid Encryption Architecture

```mermaid
flowchart TD
    A[Vote Data Plain] -->|electionId, candidateId, voterId, timestamp| B[SHA-256 Hashing]
    B -->|Generate| C[Vote Hash untuk verifikasi]

    A --> D[Generate Random AES-256 Key]
    D -->|256-bit key Unique per vote| E[AES-256-GCM Encryption]

    E -->|Encrypt vote data| F[Encrypted Vote Data]
    E -->|Generate| G[IV Initialization Vector]
    E -->|Generate| H[Auth Tag untuk integrity]

    F --> I[RSA-4096 Encryption]
    D --> I
    I -->|Encrypt AES key dengan Public Key| J[Encrypted AES Key]

    F --> K[(Database Storage)]
    J --> K
    G --> K
    H --> K
    C --> K

    K -->|Store| L[encryptedData]
    K -->|Store| M[encryptedKey]
    K -->|Store| N[iv]
    K -->|Store| O[authTag]
    K -->|Store| P[voteHash]

    style A fill:#e1f5ff
    style C fill:#d4edda
    style K fill:#fff3cd
    style I fill:#f8d7da
```

### 2. Decryption Process (Admin Only)

```mermaid
flowchart TD
    A[(Database)] -->|Retrieve| B[encryptedData, encryptedKey, iv, authTag]

    B --> C[RSA-4096 Decryption]
    C -->|Decrypt AES key dengan Private Key| D[Recovered AES-256 Key]
    C -->|Only admin has private key| C

    D --> E[AES-256-GCM Decryption]
    B --> E

    E -->|Decrypt vote data| F[Decrypted Vote Data]
    E -->|Verify Auth Tag integrity check| F
    E -->|Use IV for decryption| F

    F --> G[Original Vote Data]
    G -->|Output| H[electionId, candidateId, voterId, timestamp]

    style A fill:#fff3cd
    style C fill:#f8d7da
    style E fill:#d4edda
    style H fill:#e1f5ff
```

### 3. Vote Hash Verification

```mermaid
flowchart LR
    A[Pemilih Selesai Voting] --> B[System Generates Vote Hash]
    B -->|SHA-256 voteData| C[Vote Hash Generated]

    C -->|Display to voter| D[Vote Hash: abc123def456... 64 characters]

    D --> E{Pemilih Verifikasi}
    E -->|Check hash| F[Cek di System]
    E -->|Confirm| G[Pastikan Vote Tercatat]
    E -->|Validate| H[Confirm Pilihan Sesuai]

    F --> I[✓ Vote Verified]
    G --> I
    H --> I

    style A fill:#e1f5ff
    style C fill:#d4edda
    style D fill:#fff3cd
    style I fill:#d4edda
```

### 4. Security Benefits

| Lapisan Keamanan         | Fungsi                | Benefit                                          |
| ------------------------ | --------------------- | ------------------------------------------------ |
| **SHA-256 Hash**         | Verifikasi integritas | Pemilih dapat memastikan vote tercatat           |
| **AES-256-GCM**          | Enkripsi data vote    | Data vote tidak bisa dibaca siapapun             |
| **Auth Tag (GCM)**       | Integritas ciphertext | Deteksi manipulasi data terenkripsi              |
| **RSA-4096**             | Enkripsi AES key      | Hanya admin dengan private key yang bisa decrypt |
| **Database Transaction** | Atomicity             | Semua operasi vote succeed atau fail bersamaan   |
| **Timestamp**            | Audit trail           | Tracking waktu voting untuk investigasi          |

---

## 🗳️ Flow Voting

Berikut adalah alur lengkap proses voting dari login hingga konfirmasi vote:

### Complete Voting Flow Diagram

```mermaid
flowchart TD
    Start[Pemilih Login] --> Check[GET /api/voter/checkEligibility]

    Check --> CheckDB{Check VoterElection Table}
    CheckDB -->|Query| DB1[(isEligible, hasVoted, voteHash)]

    DB1 --> HasVoted{hasVoted?}

    HasVoted -->|true| ShowConfirm[Show Vote Confirmation]
    ShowConfirm --> DisplayHash[Display: voteHash<br/>Anda sudah memilih]
    DisplayHash --> End1[End]

    HasVoted -->|false| ShowCandidates[Show Candidate List]
    ShowCandidates --> SelectCandidate[Pemilih Pilih Kandidat]

    SelectCandidate --> SubmitVote[POST /api/vote/submit]
    SubmitVote -->|Send| VoteData{electionId<br/>candidateId<br/>voterId}

    VoteData --> Validation[Server-Side Validation]

    Validation --> V1{Election Active?}
    V1 -->|No| Error1[Return Error 400/403]
    V1 -->|Yes| V2{Time Valid?}

    V2 -->|No| Error2[Return Error 400/403]
    V2 -->|Yes| V3{Voter Eligible?}

    V3 -->|No| Error3[Return Error 400/403]
    V3 -->|Yes| V4{Not Yet Voted?}

    V4 -->|No| Error4[Return Error 400/403]
    V4 -->|Yes| V5{Candidate Exists?}

    V5 -->|No| Error5[Return Error 400/403]
    V5 -->|Yes| Process[Process Vote]

    Process --> CreateData[Create voteData Object]
    CreateData --> GenHash[Generate Vote Hash SHA256]
    GenHash --> HybridEnc[Hybrid Encryption]

    HybridEnc --> AES[a. Generate AES-256 key]
    AES --> EncData[b. Encrypt with AES-256-GCM]
    EncData --> EncKey[c. Encrypt AES key with RSA-4096]

    EncKey --> Transaction[Database Transaction BEGIN]

    Transaction --> T1[1. INSERT Vote Table]
    T1 --> T2[2. UPDATE VoterElection]
    T2 --> T3[3. UPDATE Candidate totalVotes]
    T3 --> T4[4. UPDATE Election totalVotes]
    T4 --> T5[5. UPDATE ElectionStatistics]
    T5 --> Commit[COMMIT TRANSACTION]

    Commit --> Response[Response to Client]
    Response -->|success: true<br/>voteHash: abc123...| Display[Client-Side Display]

    Display --> Success[✅ Terima kasih sudah memilih]
    Success --> HashDisplay[🔐 Vote Hash Anda: abc123...]
    HashDisplay --> Info[ℹ️ Simpan hash untuk verifikasi]
    Info --> Broadcast[Real-time Update Broadcast]
    Broadcast --> End2[End]

    Error1 --> End3[End]
    Error2 --> End3
    Error3 --> End3
    Error4 --> End3
    Error5 --> End3

    style Start fill:#e1f5ff
    style Process fill:#d4edda
    style Transaction fill:#fff3cd
    style Success fill:#d4edda
    style Error1 fill:#f8d7da
    style Error2 fill:#f8d7da
    style Error3 fill:#f8d7da
    style Error4 fill:#f8d7da
    style Error5 fill:#f8d7da
```

### Penjelasan Flow Detail

#### 1. **Login & Akses Vote Page**

```typescript
// Client request
GET /api/voter/checkEligibility?voterId={id}&electionId={id}

// Server response
{
  isEligible: true,
  hasVoted: false,
  voteHash: null, // null jika belum vote
  election: { ... },
  voter: { ... }
}
```

#### 2. **Cek Status Voting**

```mermaid
flowchart LR
    A[Check hasVoted Status] --> B{hasVoted?}
    B -->|true| C[Show Confirmation]
    B -->|false| D[Show Candidates]

    C --> E[Display Vote Hash]
    C --> F[Disable Voting Button]
    C --> G[Message: Anda telah memberikan suara]

    D --> H[Display Candidate List]
    D --> I[Enable Voting Button]
    D --> J[Allow Candidate Selection]

    style B fill:#fff3cd
    style C fill:#f8d7da
    style D fill:#d4edda
```

#### 3. **Pilih Kandidat & Submit Vote**

```typescript
// Client POST request
POST /api/vote/submitVote
{
  electionId: "507f1f77bcf86cd799439011",
  candidateId: "507f1f77bcf86cd799439012",
  voterId: "507f1f77bcf86cd799439013"
}
```

#### 4. **Server-Side Validation**

```typescript
// Validasi yang dilakukan server
const validations = {
  electionExists: await checkElection(electionId),
  electionActive: election.status === "ongoing",
  timeValid: now >= startDate && now <= endDate,
  voterEligible: voterElection.isEligible === true,
  notYetVoted: voterElection.hasVoted === false,
  candidateExists: await checkCandidate(candidateId),
};

if (!Object.values(validations).every((v) => v === true)) {
  return res.status(400).json({ error: "Validation failed" });
}
```

#### 5. **Proses Enkripsi**

```typescript
// 1. Create vote data
const voteData = {
  electionId,
  candidateId,
  voterId,
  timestamp: new Date().toISOString(),
};

// 2. Generate vote hash (SHA-256)
const voteHash = crypto
  .createHash("sha256")
  .update(JSON.stringify(voteData))
  .digest("hex");

// 3. Hybrid encryption
// a. Generate random AES-256 key
const aesKey = crypto.randomBytes(32); // 256 bits

// b. AES-256-GCM encryption
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
let encryptedData = cipher.update(JSON.stringify(voteData), "utf8", "hex");
encryptedData += cipher.final("hex");
const authTag = cipher.getAuthTag().toString("hex");

// c. RSA-4096 encryption of AES key
const encryptedKey = crypto
  .publicEncrypt(
    {
      key: RSA_PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    aesKey
  )
  .toString("base64");
```

#### 6. **Database Transaction**

```typescript
// Prisma transaction untuk atomicity
await prisma.$transaction(async (tx) => {
  // 1. Insert vote
  const vote = await tx.vote.create({
    data: {
      electionId,
      voterId,
      encryptedData,
      encryptedKey,
      iv,
      authTag,
      isCounted: false,
      createdAt: new Date(),
    },
  });

  // 2. Update voter election status
  await tx.voterElection.update({
    where: {
      voterId_electionId: { voterId, electionId },
    },
    data: { hasVoted: true },
  });

  // 3. Increment candidate vote count
  await tx.candidate.update({
    where: { id: candidateId },
    data: { totalVotes: { increment: 1 } },
  });

  // 4. Increment election total votes
  await tx.election.update({
    where: { id: electionId },
    data: { totalVotes: { increment: 1 } },
  });

  // 5. Update election statistics
  await tx.electionStatistics.update({
    where: { electionId },
    data: {
      votersWhoVoted: { increment: 1 },
      participationRate: {
        set: ((votersWhoVoted + 1) / eligibleVoters) * 100,
      },
    },
  });
});
```

#### 7. **Response & Konfirmasi**

```typescript
// Server response
{
  success: true,
  voteHash: "a3f5c8e2b1d4...", // 64 character SHA-256 hash
  message: "Vote berhasil dicatat",
  timestamp: "2025-11-04T03:12:34.000Z"
}

// Client display
✅ Terima kasih telah memberikan suara!

🔐 Vote Hash Anda:
a3f5c8e2b1d4f9e7a6b8c3d2e5f1a4b7c9d3e6f2a8b5c1d7e4f9a2b6c8d3e5f1

ℹ️ Simpan hash ini untuk memverifikasi bahwa suara Anda
   telah tercatat dengan benar dalam sistem.

[📋 Copy Hash]  [✓ Selesai]
```

### Ringkasan Teknis

```mermaid
graph LR
    A[Check Eligibility] --> B[Validate Request]
    B --> C[Generate Hash]
    C --> D[Hybrid Encrypt]
    D --> E[Database Transaction]
    E --> F[Return Vote Hash]
    F --> G[Real-time Update]

    style A fill:#e1f5ff
    style D fill:#f8d7da
    style E fill:#fff3cd
    style G fill:#d4edda
```

**Timeline**: Seluruh proses dari submit hingga konfirmasi memakan waktu ~200-500ms tergantung beban server.

---

## 📦 Prasyarat

Sebelum memulai instalasi, pastikan sistem Anda memiliki:

- **Node.js** >= 18.x
- **npm** >= 9.x atau **yarn** >= 1.22.x
- **MongoDB** database (local atau cloud seperti MongoDB Atlas)
- **Akun Kinde** untuk authentication ([Sign up di sini](https://kinde.com/))

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/kudith/e-voting.git
cd e-voting
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dbname"

# Kinde Auth
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="https://your-domain.kinde.com"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/dashboard"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Encryption Keys (Generate menggunakan generate-keys.js)
RSA_PUBLIC_KEY="your_rsa_public_key"
RSA_PRIVATE_KEY="your_rsa_private_key"
```

### 4. Generate Encryption Keys

```bash
node generate-keys.js
```

Script ini akan menghasilkan pasangan kunci RSA-4096 yang diperlukan untuk hybrid encryption. Copy output ke `.env.local`.

### 5. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Seed database dengan data contoh
node scripts/seed.js
```

### 6. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ⚙️ Konfigurasi

### Prisma Configuration

File konfigurasi Prisma terletak di `prisma/schema.prisma`. Untuk mengubah provider database atau menambahkan model baru, edit file ini lalu jalankan:

```bash
npx prisma generate
npx prisma db push
```

### Component Configuration

Konfigurasi komponen UI menggunakan shadcn/ui terletak di `components.json`:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate"
  }
}
```

### Encryption Configuration

Untuk mengubah level enkripsi, edit file `lib/encryption.js`:

```javascript
// Current: AES-256-GCM + RSA-4096
const ENCRYPTION_CONFIG = {
  aes: {
    algorithm: "aes-256-gcm",
    keyLength: 32, // 256 bits
    ivLength: 16, // 128 bits
  },
  rsa: {
    modulusLength: 4096,
    publicExponent: 65537,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  },
  hash: {
    algorithm: "sha256",
  },
};
```

---

## 📖 Penggunaan

### Sebagai Admin

1. **Login**: Akses `/admin/login` dengan kredensial admin
2. **Buat Pemilu**:
   - Navigasi ke Dashboard Admin
   - Klik "Buat Pemilu Baru"
   - Isi detail pemilu (judul, deskripsi, tanggal mulai/selesai)
3. **Tambah Kandidat**:
   - Masuk ke detail pemilu
   - Tambahkan kandidat dengan foto, visi, misi, dan program
4. **Kelola Pemilih**:
   - Import data pemilih atau tambah manual
   - Atur fakultas dan jurusan
   - Generate voter code otomatis
   - Set eligibility per election
5. **Monitor Pemilu**:
   - Lihat statistik real-time
   - Cek tingkat partisipasi
   - Track vote hash untuk audit
   - Export hasil pemilu (terenkripsi)

### Sebagai Pemilih

1. **Login**: Gunakan voter code yang diberikan admin
2. **Verifikasi Eligibility**:
   - Sistem otomatis cek apakah Anda eligible
   - Cek apakah sudah pernah vote
3. **Pilih Kandidat**:
   - Lihat profil lengkap setiap kandidat
   - Bandingkan visi dan misi
   - Baca program kerja kandidat
   - Cast vote dengan satu klik
4. **Konfirmasi & Verifikasi**:
   - Terima vote hash (SHA-256)
   - **PENTING**: Simpan vote hash Anda
   - Gunakan hash untuk verifikasi bahwa vote tercatat
5. **Verifikasi Vote** (Opsional):
   - Akses halaman verifikasi
   - Input vote hash Anda
   - Sistem konfirmasi vote Anda ada di database

### Verifikasi Vote Hash

Pemilih dapat memverifikasi vote mereka dengan cara:

```typescript
// API endpoint untuk verifikasi
GET /api/vote/verify?hash={voteHash}

// Response jika valid
{
  valid: true,
  message: "Vote ditemukan dan tercatat",
  votedAt: "2025-11-04T03:12:34.000Z",
  electionTitle: "Pemilihan Ketua BEM 2025"
  // TIDAK menampilkan candidateId untuk privacy
}
```

---

## 🗄️ Struktur Database

### Entity Relationship Diagram

```mermaid
erDiagram
    Admin ||--o{ Election : creates
    Election ||--|{ Candidate : has
    Election ||--o{ Vote : contains
    Election ||--o{ VoterElection : tracks
    Election ||--o| ElectionStatistics : has

    Voter ||--o{ VoterElection : participates
    Voter }o--|| Faculty : belongs_to
    Voter }o--|| Major : studies_in

    Candidate ||--o| CandidateStats : has
    Candidate ||--o| SocialMedia : has
    Candidate ||--o{ Education : has
    Candidate ||--o{ Experience : has
    Candidate ||--o{ Achievement : has
    Candidate ||--o{ Program : proposes

    Faculty ||--o{ Major : contains

    Vote ||--o| MerkleTree : linked_to

    Admin {
        ObjectId id PK
        string kindeId UK
        string username UK
        string email UK
        datetime createdAt
        datetime updatedAt
    }

    Voter {
        ObjectId id PK
        string kindeId UK
        string voterCode UK
        string name
        string email UK
        string phone
        ObjectId facultyId FK
        ObjectId majorId FK
        string year
        enum status
        datetime createdAt
        datetime updatedAt
    }

    Election {
        ObjectId id PK
        string title
        string description
        datetime startDate
        datetime endDate
        string status
        int totalVotes
        datetime createdAt
        datetime updatedAt
    }

    Candidate {
        ObjectId id PK
        string name
        string photo
        string vision
        string mission
        string shortBio
        string details
        int voteCount
        ObjectId electionId FK
        datetime createdAt
        datetime updatedAt
    }

    Vote {
        ObjectId id PK
        ObjectId electionId FK
        ObjectId voterId FK
        string encryptedData
        string encryptedKey
        string iv
        string authTag
        string voteHash UK
        boolean isCounted
        datetime createdAt
    }

    VoterElection {
        ObjectId id PK
        ObjectId voterId FK
        ObjectId electionId FK
        boolean isEligible
        boolean hasVoted
    }

    Faculty {
        ObjectId id PK
        string name UK
        string code UK
        datetime createdAt
    }

    Major {
        ObjectId id PK
        string name
        string code UK
        ObjectId facultyId FK
        datetime createdAt
    }

    MerkleTree {
        ObjectId id PK
        string voteHash UK
        int level
        int position
        ObjectId parentId FK
        string parentHash
        boolean isRoot
    }
```

### Model Utama

#### Admin

```prisma
model Admin {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  kindeId   String   @unique
  username  String   @unique
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Voter

```prisma
model Voter {
  id           String      @id @default(auto()) @map("_id") @db.ObjectId
  kindeId      String      @unique
  voterCode    String      @unique
  name         String
  email        String      @unique
  phone        String
  facultyId    String      @db.ObjectId
  majorId      String      @db.ObjectId
  year         String
  status       VoterStatus @default(active)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  faculty      Faculty     @relation("FacultyToVoter", fields: [facultyId], references: [id])
  major        Major       @relation("MajorToVoter", fields: [majorId], references: [id])
  voterElections VoterElection[]
}
```

#### Election

```prisma
model Election {
  id                  String                 @id @default(auto()) @map("_id") @db.ObjectId
  title               String
  description         String
  startDate           DateTime
  endDate             DateTime
  status              String                 @default("ongoing")
  totalVotes          Int                    @default(0)
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt

  candidates          Candidate[]
  votes               Vote[]
  voterElections      VoterElection[]
  statistics          ElectionStatistics?    @relation("ElectionToStatistics")
}
```

#### Candidate

```prisma
model Candidate {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  photo       String
  vision      String
  mission     String
  shortBio    String
  details     String
  voteCount   Int       @default(0)
  electionId  String    @db.ObjectId
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  election    Election  @relation(fields: [electionId], references: [id])
  socialMedia SocialMedia?
  education   Education[]
  experience  Experience[]
  achievements Achievement[]
  programs    Program[]
  stats       CandidateStats?
}
```

#### Vote (Encrypted) - CORE SECURITY MODEL

```prisma
model Vote {
  id            String     @id @default(auto()) @map("_id") @db.ObjectId
  electionId    String     @db.ObjectId
  voterId       String     @db.ObjectId

  // Hybrid Encryption Fields
  encryptedData String     // AES-256-GCM encrypted vote data
  encryptedKey  String     // RSA-4096 encrypted AES key
  iv            String     // Initialization Vector for AES
  authTag       String     // Authentication Tag for GCM

  // Verification & Audit
  voteHash      String     @unique // SHA-256 hash for verification

  isCounted     Boolean    @default(false)
  createdAt     DateTime   @default(now())

  election      Election?  @relation(fields: [electionId], references: [id])
}
```

#### VoterElection - Eligibility & Status Tracking

```prisma
model VoterElection {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  voterId    String   @db.ObjectId
  electionId String   @db.ObjectId
  isEligible Boolean  @default(true)
  hasVoted   Boolean  @default(false)

  voter      Voter    @relation(fields: [voterId], references: [id])
  election   Election @relation(fields: [electionId], references: [id])

  @@unique([voterId, electionId])
}
```

#### MerkleTree (Future Development)

```prisma
model MerkleTree {
  id         String  @id @default(auto()) @map("_id") @db.ObjectId
  voteHash   String  @unique
  level      Int
  position   Int
  parentId   String? @db.ObjectId
  parentHash String?
  isRoot     Boolean @default(false)

  parent     MerkleTree?  @relation("ParentChild", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children   MerkleTree[] @relation("ParentChild")
}
```

**Note**: Model `MerkleTree` sudah disiapkan dalam schema untuk pengembangan masa depan. Saat ini sistem sudah aman dengan hybrid encryption dan SHA-256 hashing.

---

## 🌐 API Routes

### API Architecture

```mermaid
graph TB
    subgraph Client
        A[Web Browser]
        B[Mobile App]
    end

    subgraph "API Layer"
        C[Authentication APIs]
        D[Election APIs]
        E[Voting APIs]
        F[Statistics APIs]
    end

    subgraph "Business Logic"
        G[Validation Layer]
        H[Encryption Service]
        I[Transaction Manager]
    end

    subgraph "Data Layer"
        J[(MongoDB)]
        K[Prisma ORM]
    end

    A --> C
    A --> D
    A --> E
    A --> F
    B --> C
    B --> D
    B --> E
    B --> F

    C --> G
    D --> G
    E --> G
    F --> G

    G --> H
    H --> I
    I --> K
    K --> J

    style C fill:#e1f5ff
    style E fill:#f8d7da
    style I fill:#fff3cd
    style J fill:#d4edda
```

### Authentication

- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `GET /api/auth/session` - Get current session

### Elections

- `GET /api/elections` - Get all elections
- `POST /api/elections` - Create new election (Admin)
- `GET /api/elections/[id]` - Get election details
- `PUT /api/elections/[id]` - Update election (Admin)
- `DELETE /api/elections/[id]` - Delete election (Admin)

### Candidates

- `GET /api/elections/[id]/candidates` - Get candidates
- `POST /api/elections/[id]/candidates` - Add candidate (Admin)
- `PUT /api/candidates/[id]` - Update candidate (Admin)
- `DELETE /api/candidates/[id]` - Delete candidate (Admin)

### Voting (Core API)

- `GET /api/voter/checkEligibility` - Check voter eligibility & status
- `POST /api/vote/submitVote` - Cast encrypted vote (returns voteHash)
- `GET /api/vote/verify?hash={voteHash}` - Verify vote dengan hash
- `GET /api/elections/[id]/results` - Get election results (Admin)

### Voters

- `GET /api/voters` - Get all voters (Admin)
- `POST /api/voters` - Add voter (Admin)
- `POST /api/voters/import` - Bulk import voters (Admin)
- `GET /api/voters/[id]` - Get voter details
- `PUT /api/voters/[id]` - Update voter (Admin)
- `DELETE /api/voters/[id]` - Delete voter (Admin)

### Statistics

- `GET /api/elections/[id]/statistics` - Get election statistics
- `GET /api/dashboard/analytics` - Get dashboard analytics (Admin)
- `GET /api/elections/[id]/participation` - Get participation rate

### Real-time Events

- `vote:cast` - Event when new vote is cast
- `stats:update` - Event when statistics updated
- `election:end` - Event when election ends

---

## 🗺️ Roadmap

```mermaid
timeline
    title SiPilih Development Roadmap

    section v1.0 (Current)
        Hybrid Encryption : AES-256-GCM + RSA-4096
        SHA-256 Hashing : Vote verification
        Real-time Counting : WebSocket updates
        Admin Dashboard : Complete management

    section v1.1 (Q1 2026)
        Email Notifications : Vote confirmation
        SMS OTP : Two-factor auth
        Multi-language : ID/EN support
        PDF Export : Vote receipts

    section v2.0 (Q2-Q4 2026)
        Merkle Tree : Batch verification
        Blockchain Integration : Immutable audit
        Zero-Knowledge Proofs : Privacy enhancement
        Biometric Auth : Fingerprint/Face ID

    section v3.0 (2027)
        AI Analytics : Voting patterns
        Advanced Security : Quantum-resistant crypto
        Mobile App : React Native
        API Gateway : Public API access
```

### ✅ Current Features (v1.0)

- [x] Hybrid Encryption (AES-256-GCM + RSA-4096)
- [x] SHA-256 Vote Hashing
- [x] Vote Hash Verification
- [x] Real-time Vote Counting
- [x] Multi-candidate Support
- [x] Eligibility Checking
- [x] Database Transactions
- [x] Admin Dashboard
- [x] Voter Interface
- [x] Faculty/Major Management

### 🚧 In Development (v1.1 - Q1 2026)

- [ ] Email Notifications (vote confirmation)
- [ ] SMS OTP Verification
- [ ] Multi-language Support (ID/EN)
- [ ] Vote Receipt PDF Export
- [ ] Enhanced Analytics Dashboard
- [ ] Mobile App (React Native)

### 🔮 Future Features (v2.0 - Q2-Q4 2026)

- [ ] **Merkle Tree Implementation**
  - Benefit: Verifikasi batch vote lebih efisien
  - Benefit: Public audit trail tanpa expose data
  - Benefit: Tamper-proof vote structure
- [ ] **Blockchain Integration** (Optional)
  - Store vote hashes on blockchain
  - Immutable audit trail
- [ ] **Zero-Knowledge Proofs**
  - Prove vote validity without revealing content
- [ ] **Biometric Authentication**
  - Fingerprint/Face recognition

### 🎯 Technical Debt & Improvements

- [ ] Unit Tests (Jest + React Testing Library)
- [ ] E2E Tests (Playwright)
- [ ] Performance Optimization (React Query caching)
- [ ] Security Audit (Third-party)
- [ ] Load Testing (k6)
- [ ] CI/CD Pipeline (GitHub Actions)

---

## 🚢 Deployment

### Deployment Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[Browser]
        B[Mobile Device]
    end

    subgraph "CDN Layer"
        C[Vercel Edge Network]
        D[Static Assets]
    end

    subgraph "Application Layer"
        E[Next.js App]
        F[API Routes]
        G[Server Components]
    end

    subgraph "Data Layer"
        H[(MongoDB Atlas)]
        I[Prisma Client]
    end

    subgraph "External Services"
        J[Kinde Auth]
        K[Email Service]
        L[SMS Gateway]
    end

    A --> C
    B --> C
    C --> D
    C --> E

    E --> F
    E --> G
    F --> I
    G --> I
    I --> H

    F --> J
    F --> K
    F --> L

    style E fill:#e1f5ff
    style H fill:#d4edda
    style J fill:#fff3cd
```

### Vercel (Recommended)

1. **Push ke GitHub**:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import di Vercel**:

   - Buka [Vercel Dashboard](https://vercel.com)
   - Klik "New Project"
   - Import repository `kudith/e-voting`

3. **Configure Environment Variables**:

   - Tambahkan semua variabel dari `.env.local`
   - Set `NODE_ENV=production`
   - Pastikan RSA keys sudah di-set dengan benar

4. **Deploy**:
   - Vercel akan otomatis build dan deploy
   - Domain: `https://sipilih.vercel.app`

### Self-Hosted

```bash
# Build aplikasi
npm run build

# Start production server
npm start
```

### Docker

```dockerfile name=Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

```yaml name=docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - KINDE_CLIENT_ID=${KINDE_CLIENT_ID}
      - KINDE_CLIENT_SECRET=${KINDE_CLIENT_SECRET}
      - RSA_PUBLIC_KEY=${RSA_PUBLIC_KEY}
      - RSA_PRIVATE_KEY=${RSA_PRIVATE_KEY}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

volumes:
  mongodb_data:
```

**Run dengan Docker**:

```bash
docker-compose up -d
```

---

## 🧪 Testing

```bash
# Run tests (jika tersedia)
npm test

# Run linter
npm run lint

# Type checking
npx tsc --noEmit

# Test enkripsi
node scripts/test-encryption.js
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut langkah-langkah untuk berkontribusi:

```mermaid
graph LR
    A[Fork Repository] --> B[Create Branch]
    B --> C[Make Changes]
    C --> D[Commit Changes]
    D --> E[Push to Branch]
    E --> F[Open Pull Request]
    F --> G{Code Review}
    G -->|Approved| H[Merge to Main]
    G -->|Changes Requested| C

    style A fill:#e1f5ff
    style F fill:#fff3cd
    style H fill:#d4edda
```

1. **Fork** repository ini
2. **Create branch** untuk fitur Anda (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Code Style Guidelines

- Gunakan ESLint configuration yang sudah ada
- Ikuti konvensi penamaan yang konsisten
- Tulis komentar untuk logika kompleks
- Update dokumentasi jika diperlukan
- Tambahkan tests untuk fitur baru

### Contribution Ideas

- 🐛 Bug fixes
- 📝 Documentation improvements
- ✨ New features (lihat Roadmap)
- 🎨 UI/UX improvements
- 🔒 Security enhancements
- ⚡ Performance optimizations

---

## 📝 Lisensi

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👨‍💻 Kontak

**Developer**: kudith

- GitHub: [@kudith](https://github.com/kudith)
- Project Link: [https://github.com/kudith/e-voting](https://github.com/kudith/e-voting)
- Live Demo: [https://sipilih.vercel.app](https://sipilih.vercel.app)
- Issues: [https://github.com/kudith/e-voting/issues](https://github.com/kudith/e-voting/issues)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Kinde Auth](https://kinde.com/)
- [Vercel](https://vercel.com/) untuk hosting
- [Node.js Crypto](https://nodejs.org/api/crypto.html) untuk encryption
- [MongoDB](https://www.mongodb.com/) untuk database

---

## 🔐 Security Notice

Sistem ini menggunakan enkripsi tingkat enterprise dengan:

- **AES-256-GCM**: Symmetric encryption standar militer
- **RSA-4096**: Asymmetric encryption dengan key length 4096 bits
- **SHA-256**: Cryptographic hashing untuk integritas
- **Database Transactions**: Atomic operations untuk konsistensi

```mermaid
graph TD
    A[Security Layers] --> B[Application Layer]
    A --> C[Transport Layer]
    A --> D[Data Layer]

    B --> B1[Authentication]
    B --> B2[Authorization]
    B --> B3[Input Validation]

    C --> C1[HTTPS/TLS]
    C --> C2[API Rate Limiting]
    C --> C3[CORS Policy]

    D --> D1[Encryption at Rest]
    D --> D2[Hybrid Encryption]
    D --> D3[Hash Verification]

    style A fill:#f8d7da
    style B fill:#fff3cd
    style C fill:#d4edda
    style D fill:#e1f5ff
```

**PENTING**:

- **JANGAN PERNAH** share RSA private key Anda
- Simpan `.env` file dengan aman (jangan commit ke Git)
- Gunakan environment variables untuk production
- Backup database secara rutin
- Monitor suspicious activities melalui logs

Jika menemukan security vulnerability, hubungi maintainer secara private melalui GitHub Security Advisories.

---

## 📊 Status Project

![GitHub last commit](https://img.shields.io/github/last-commit/kudith/e-voting)
![GitHub issues](https://img.shields.io/github/issues/kudith/e-voting)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kudith/e-voting)
![GitHub stars](https://img.shields.io/github/stars/kudith/e-voting?style=social)

**Current Version**: v1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 2025

---

<div align="center">

**Made with ❤️ for secure and transparent elections**

⭐ Star repository ini jika Anda merasa terbantu!

[Report Bug](https://github.com/kudith/e-voting/issues) · [Request Feature](https://github.com/kudith/e-voting/issues) · [Documentation](https://github.com/kudith/e-voting/wiki)

</div>
