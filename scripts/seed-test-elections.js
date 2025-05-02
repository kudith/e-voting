// This is a script to seed test election data for development purposes
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test election data...');

  try {
    // 1. Create a test election with candidates
    const activeElection = await prisma.election.create({
      data: {
        title: 'Pemilihan Ketua BEM 2023',
        description: 'Pemilihan Ketua Badan Eksekutif Mahasiswa periode 2023-2024',
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-05-07'),
        status: 'ongoing',
        totalVotes: 250,
        candidates: {
          create: [
            {
              name: 'Ahmad Rizal',
              photo: '/candidates/rizal.jpg',
              vision: 'Menjadikan kampus sebagai pusat inovasi mahasiswa',
              mission: 'Mendorong program inkubasi startup, mengembangkan sistem mentoring, dan memfasilitasi kompetisi',
              shortBio: 'Mahasiswa Teknik Informatika angkatan 2020',
              voteCount: 120,
              details: 'Ahmad Rizal adalah mahasiswa berprestasi dengan pengalaman kepemimpinan yang luas di berbagai organisasi kampus. Ia memiliki visi yang kuat untuk mengembangkan ekosistem inovasi di kampus.'
            },
            {
              name: 'Siti Aminah',
              photo: '/candidates/siti.jpg',
              vision: 'Menciptakan lingkungan kampus yang inklusif dan kolaboratif',
              mission: 'Membangun program pertukaran antar fakultas, menyelenggarakan forum diskusi rutin, dan memperluas networking',
              shortBio: 'Mahasiswa Ilmu Komunikasi angkatan 2019',
              voteCount: 130,
              details: 'Siti Aminah dikenal dengan kepemimpinannya yang inklusif dan kemampuannya membangun jembatan antara berbagai kelompok mahasiswa. Ia berpengalaman dalam mengelola proyek-proyek kolaboratif berskala besar.'
            }
          ]
        },
        statistics: {
          create: {
            totalVoters: 500,
            eligibleVoters: 480,
            votersWhoVoted: 250,
            participationRate: 52.08
          }
        }
      }
    });

    // 2. Create a completed election
    const completedElection = await prisma.election.create({
      data: {
        title: 'Pemilihan Ketua Himpunan Teknik Informatika',
        description: 'Pemilihan Ketua Himpunan Mahasiswa Teknik Informatika periode 2023',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-03-05'),
        status: 'completed',
        totalVotes: 175,
        candidates: {
          create: [
            {
              name: 'Budi Santoso',
              photo: '/candidates/budi.jpg',
              vision: 'Memajukan kualitas akademik dan soft skill mahasiswa TI',
              mission: 'Mengadakan workshop teknologi, membentuk kelompok studi, dan menyelenggarakan kompetisi coding',
              shortBio: 'Mahasiswa Teknik Informatika angkatan 2020',
              voteCount: 85,
              details: 'Budi Santoso adalah programmer berpengalaman yang telah memenangkan berbagai hackathon nasional. Ia memiliki passion untuk mengembangkan komunitas coding di kampus.'
            },
            {
              name: 'Dewi Safitri',
              photo: '/candidates/dewi.jpg',
              vision: 'Membangun komunitas TI yang solid dan berprestasi',
              mission: 'Membentuk tim coding, mengadakan hackathon internal, dan mengembangkan relasi dengan industri',
              shortBio: 'Mahasiswa Teknik Informatika angkatan 2019',
              voteCount: 90,
              details: 'Dewi Safitri memiliki pengalaman magang di beberapa perusahaan teknologi terkemuka. Ia aktif dalam komunitas pengembang dan memiliki jaringan luas di industri IT.'
            }
          ]
        },
        statistics: {
          create: {
            totalVoters: 200,
            eligibleVoters: 195,
            votersWhoVoted: 175,
            participationRate: 89.74
          }
        }
      }
    });

    // 3. Create an upcoming election
    const upcomingElection = await prisma.election.create({
      data: {
        title: 'Pemilihan Ketua Senat Mahasiswa',
        description: 'Pemilihan Ketua Senat Mahasiswa Universitas periode 2024-2025',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),  // 14 days from now
        status: 'upcoming',
        totalVotes: 0,
        candidates: {
          create: [
            {
              name: 'Rahman Hakim',
              photo: '/candidates/rahman.jpg',
              vision: 'Menciptakan senat yang efektif dan responsif',
              mission: 'Mengoptimalkan fungsi legislatif kampus, membangun koordinasi antar organ kemahasiswaan, dan aktif dalam advokasi kebijakan',
              shortBio: 'Mahasiswa Hukum angkatan 2021',
              voteCount: 0,
              details: 'Rahman Hakim adalah mahasiswa Fakultas Hukum yang aktif dalam kegiatan debat dan simulasi parlemen. Ia memiliki pemahaman mendalam tentang tata kelola organisasi dan kebijakan kampus.'
            },
            {
              name: 'Nurul Hidayah',
              photo: '/candidates/nurul.jpg',
              vision: 'Menguatkan peran senat sebagai representasi mahasiswa',
              mission: 'Membangun sistem pengaduan mahasiswa, mengoptimalkan mekanisme check and balance, dan memfasilitasi aspirasi mahasiswa',
              shortBio: 'Mahasiswa FISIP angkatan 2020',
              voteCount: 0,
              details: 'Nurul Hidayah memiliki pengalaman sebagai aktivis mahasiswa yang fokus pada isu-isu kebijakan kampus. Ia dikenal karena kemampuan advokasi dan mediasi yang kuat.'
            },
            {
              name: 'Yoga Pratama',
              photo: '/candidates/yoga.jpg',
              vision: 'Menjadikan senat sebagai wadah integrasi mahasiswa lintas fakultas',
              mission: 'Menyelenggarakan forum lintas fakultas, menginisiasi program kolaboratif, dan membangun database usulan kebijakan',
              shortBio: 'Mahasiswa Ekonomi angkatan 2019',
              voteCount: 0,
              details: 'Yoga Pratama adalah mahasiswa yang aktif dalam berbagai organisasi lintas fakultas. Ia memiliki pengalaman dalam mengelola kegiatan yang melibatkan mahasiswa dari berbagai jurusan.'
            }
          ]
        },
        statistics: {
          create: {
            totalVoters: 800,
            eligibleVoters: 780,
            votersWhoVoted: 0,
            participationRate: 0
          }
        }
      }
    });

    // Create dummy voters for testing
    let voters = [];
    for (let i = 0; i < 500; i++) {
      try {
        const voter = await prisma.voter.create({
          data: {
            kindeId: `dummy-kinde-${i}`,
            voterCode: `VOT${(1000000 + i).toString()}`,
            name: `Voter ${i}`,
            email: `voter${i}@example.com`,
            phone: `08123456${(1000 + i).toString().slice(-4)}`,
            facultyId: "dummy-faculty-id", // Replace with actual faculty ID
            majorId: "dummy-major-id",     // Replace with actual major ID
            year: "2023",
            status: "active"
          }
        });
        voters.push(voter);
      } catch (error) {
        console.log(`Error creating voter ${i}:`, error.message);
        // Continue with the next voter
      }
    }

    // Add some voter elections for the active election
    if (voters.length > 0) {
      for (let i = 0; i < Math.min(500, voters.length); i++) {
        try {
          await prisma.voterElection.create({
            data: {
              electionId: activeElection.id,
              voterId: voters[i].id,
              isEligible: true,
              hasVoted: i < 250  // Set first 250 as having voted
            }
          });
        } catch (error) {
          console.log(`Error creating voter election for active election ${i}:`, error.message);
        }
      }

      // Add some voter elections for the completed election
      for (let i = 0; i < Math.min(200, voters.length); i++) {
        try {
          await prisma.voterElection.create({
            data: {
              electionId: completedElection.id,
              voterId: voters[i].id,
              isEligible: true,
              hasVoted: i < 175  // Set first 175 as having voted
            }
          });
        } catch (error) {
          console.log(`Error creating voter election for completed election ${i}:`, error.message);
        }
      }

      // Add some voter elections for the upcoming election
      for (let i = 0; i < Math.min(800, voters.length); i++) {
        try {
          await prisma.voterElection.create({
            data: {
              electionId: upcomingElection.id,
              voterId: voters[i % voters.length].id,  // Cycle through available voters
              isEligible: i < 780,  // Set 780 as eligible
              hasVoted: false       // No one has voted yet
            }
          });
        } catch (error) {
          console.log(`Error creating voter election for upcoming election ${i}:`, error.message);
        }
      }
    } else {
      console.log("Warning: No voters created. Skipping voter elections creation.");
    }

    console.log('Seed completed successfully!');
    console.log('Created 3 elections with candidates and statistics');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 