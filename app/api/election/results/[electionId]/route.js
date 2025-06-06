import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hybridDecrypt } from "@/lib/encryption";

// Endpoint: /api/election/results/[electionId]
export async function GET(request, { params }) {
  // Extract electionId directly from params object
  const { electionId } = params;

  if (!electionId) {
    return NextResponse.json({ 
      success: false, 
      error: "Missing electionId parameter" 
    }, { status: 400 });
  }

  try {
    console.log(`Fetching results for election ID: ${electionId}`);
    
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        candidates: {
          select: {
            id: true,
            name: true,
            photo: true,
            voteCount: true,
          },
        },
        statistics: true,
        voterElections: {
          include: {
            voter: {
              select: {
                id: true,
                faculty: { select: { name: true } },
                major: { select: { name: true } },
              }
            },
          }
        },
        votes: true,
      },
    });

    if (!election) {
      return NextResponse.json({ 
        success: false, 
        error: "Election not found" 
      }, { status: 404 });
    }

    // Build map of voterId to faculty/major
    const voterMap = {};
    for (const ve of election.voterElections) {
      voterMap[ve.voterId] = {
        faculty: ve.voter?.faculty?.name || null,
        major: ve.voter?.major?.name || null,
      };
    }

    // Statistik kandidat per fakultas/jurusan
    const candidateFacultyStats = {};
    const candidateMajorStats = {};
    // { [candidateId]: { [faculty]: { count, percentage }, ... }, ... }
    // { [candidateId]: { [major]: { count, percentage }, ... }, ... }

    // Hitung total voter per fakultas/major
    const totalFacultyVoters = {};
    const totalMajorVoters = {};
    for (const ve of election.voterElections) {
      if (ve.voter?.faculty?.name) {
        totalFacultyVoters[ve.voter.faculty.name] = (totalFacultyVoters[ve.voter.faculty.name] || 0) + 1;
      }
      if (ve.voter?.major?.name) {
        totalMajorVoters[ve.voter.major.name] = (totalMajorVoters[ve.voter.major.name] || 0) + 1;
      }
    }

    // Dekripsi semua vote untuk dapatkan candidateId, voterId
    for (const candidate of election.candidates) {
      candidateFacultyStats[candidate.id] = {};
      candidateMajorStats[candidate.id] = {};
    }
    
    for (const v of election.votes) {
      try {
        const decryptedData = hybridDecrypt(
          v.encryptedData,
          v.encryptedKey,
          v.iv,
          v.authTag
        );
        const voteData = JSON.parse(decryptedData);
        const candidateId = voteData.candidateId;
        const voterId = v.voterId;
        const faculty = voterMap[voterId]?.faculty;
        const major = voterMap[voterId]?.major;
        if (candidateId && faculty) {
          candidateFacultyStats[candidateId][faculty] = (candidateFacultyStats[candidateId][faculty] || 0) + 1;
        }
        if (candidateId && major) {
          candidateMajorStats[candidateId][major] = (candidateMajorStats[candidateId][major] || 0) + 1;
        }
      } catch (e) {
        // skip error
        console.log("Error decrypting vote:", e.message);
      }
    }
    
    // Hitung persentase
    for (const candidateId in candidateFacultyStats) {
      for (const faculty in candidateFacultyStats[candidateId]) {
        const count = candidateFacultyStats[candidateId][faculty];
        candidateFacultyStats[candidateId][faculty] = {
          count,
          percentage: totalFacultyVoters[faculty] > 0 ? (count / totalFacultyVoters[faculty] * 100).toFixed(2) : "0.00",
        };
      }
    }
    
    for (const candidateId in candidateMajorStats) {
      for (const major in candidateMajorStats[candidateId]) {
        const count = candidateMajorStats[candidateId][major];
        candidateMajorStats[candidateId][major] = {
          count,
          percentage: totalMajorVoters[major] > 0 ? (count / totalMajorVoters[major] * 100).toFixed(2) : "0.00",
        };
      }
    }

    // Statistik umum
    const sortedCandidates = [...election.candidates].sort((a, b) => b.voteCount - a.voteCount);
    const winner = sortedCandidates[0] || null;
    const voteChart = sortedCandidates.map((c) => ({
      id: c.id,
      name: c.name,
      photo: c.photo,
      voteCount: c.voteCount,
      percentage: election.totalVotes > 0 ? (c.voteCount / election.totalVotes * 100).toFixed(2) : "0.00",
    }));

    let facultyStats = {};
    let majorStats = {};
    let voted = 0;
    let notVoted = 0;
    
    if (election.voterElections && election.voterElections.length > 0) {
      for (const ve of election.voterElections) {
        if (ve.hasVoted) voted++; else notVoted++;
        if (ve.voter?.faculty?.name) {
          facultyStats[ve.voter.faculty.name] = (facultyStats[ve.voter.faculty.name] || 0) + (ve.hasVoted ? 1 : 0);
        }
        if (ve.voter?.major?.name) {
          majorStats[ve.voter.major.name] = (majorStats[ve.voter.major.name] || 0) + (ve.hasVoted ? 1 : 0);
        }
      }
    }

    let timeline = [];
    if (election.votes && election.votes.length > 0) {
      const dateMap = {};
      for (const v of election.votes) {
        const d = new Date(v.createdAt).toISOString().slice(0, 10);
        dateMap[d] = (dateMap[d] || 0) + 1;
      }
      timeline = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
      timeline.sort((a, b) => a.date.localeCompare(b.date));
    }

    // Map status from database status (ongoing, completed, upcoming) to UI status (ACTIVE, COMPLETED, UPCOMING)
    let mappedStatus;
    switch (election.status) {
      case "ongoing":
        mappedStatus = "ACTIVE";
        break;
      case "completed":
        mappedStatus = "COMPLETED";
        break;
      case "upcoming":
        mappedStatus = "UPCOMING";
        break;
      default:
        mappedStatus = election.status;
    }

    const totalVoters = election.voterElections.length;
    const votedPercentage = totalVoters > 0 ? (voted / totalVoters * 100).toFixed(2) : "0.00";

    const result = {
        id: election.id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
      status: mappedStatus,
        totalVotes: election.totalVotes,
      statistics: election.statistics || null,
      candidates: voteChart,
      winner: winner ? {
        id: winner.id,
        name: winner.name,
        photo: winner.photo,
        voteCount: winner.voteCount,
        percentage: election.totalVotes > 0 ? (winner.voteCount / election.totalVotes * 100).toFixed(2) : "0.00",
      } : null,
      participation: {
        totalVoters,
        voted,
        notVoted,
        percentage: votedPercentage,
      },
      participationByFaculty: facultyStats,
      participationByMajor: majorStats,
      timeline,
      candidateFacultyStats,
      candidateMajorStats,
    };

    return NextResponse.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error("Error fetching election results:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
