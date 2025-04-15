const axios = require('axios');

// Faculty and major data
const faculties = [
  {
    id: "67f7e7a361c423087020eeef",
    name: "Teknik",
    majors: [
      { id: "67f7e7c861c423087020eef9", name: "Informatika" },
      { id: "67f7e84061c423087020ef0e", name: "Sipil" },
      { id: "67f7e85f61c423087020ef15", name: "Sistem Informasi" },
      { id: "67f7e85f61c423087020ef14", name: "Elektro" }
    ]
  },
  {
    id: "67f7e7ec61c423087020ef00",
    name: "FISIP",
    majors: [
      { id: "67f7e81661c423087020ef06", name: "Ilmu Politik" },
      { id: "67f7e86b61c423087020ef1a", name: "Hukum" }
    ]
  },
  {
    id: "67f7eb877cd3c2c68baf47e3",
    name: "Kedokteran",
    majors: [
      { id: "67f7ec687cd3c2c68baf47e6", name: "Dokter Gigi" },
      { id: "67f7f62eeaba4be699b2e2ce", name: "Dokter Hewan" }
    ]
  }
];

// Function to generate random name
function generateRandomName() {
  const firstNames = ['Adi', 'Budi', 'Citra', 'Deni', 'Eka', 'Fajar', 'Gita', 'Hadi', 'Indra', 'Joko'];
  const lastNames = ['Pratama', 'Santoso', 'Wijaya', 'Kusuma', 'Nugroho', 'Putra', 'Saputra', 'Hidayat', 'Susanto', 'Rahman'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Function to generate random email
function generateRandomEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  
  return `${name.toLowerCase().replace(' ', '.')}${randomNum}@${domain}`;
}

// Function to generate random phone number
function generateRandomPhone() {
  const prefixes = ['+6281', '+6282', '+6283', '+6285', '+6287', '+6288', '+6289'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNum = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  return `${prefix}${randomNum}`;
}

// Function to get random faculty and major
function getRandomFacultyAndMajor() {
  const faculty = faculties[Math.floor(Math.random() * faculties.length)];
  const major = faculty.majors[Math.floor(Math.random() * faculty.majors.length)];
  
  return { facultyId: faculty.id, majorId: major.id };
}

// Function to create a voter
async function createVoter(index) {
  const name = generateRandomName();
  const { facultyId, majorId } = getRandomFacultyAndMajor();
  
  const voterData = {
    name,
    email: generateRandomEmail(name),
    facultyId,
    majorId,
    year: "2025",
    status: "active",
    phone: generateRandomPhone()
  };
  
  try {
    const response = await axios.post('http://localhost:3000/api/voter/createVoter', voterData);
    console.log(`Voter ${index + 1} created successfully: ${name}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to create voter ${index + 1}:`, error.response?.data || error.message);
    return null;
  }
}

// Main function to create multiple voters
async function createMultipleVoters(count) {
  console.log(`Starting to create ${count} voters...`);
  
  const results = [];
  for (let i = 0; i < count; i++) {
    const result = await createVoter(i);
    results.push(result);
    
    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const successCount = results.filter(r => r !== null).length;
  console.log(`Completed! Successfully created ${successCount} out of ${count} voters.`);
}

// Create 50 voters
createMultipleVoters(50); 