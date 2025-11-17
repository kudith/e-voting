import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function DELETE(req) {
  try {
    const body = await req.json(); // Ambil body dari request
    const { ids } = body; // Ambil array `ids` dari body

    // Validasi jika `ids` tidak diberikan atau kosong
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Election IDs are required." },
        { status: 400 }
      );
    }

    console.log(`Deleting elections with IDs: ${ids.join(", ")}`);

    // Step 1: Dapatkan semua candidate IDs yang terkait dengan elections
    const candidates = await prisma.candidate.findMany({
      where: { electionId: { in: ids } },
      select: { id: true }
    });

    const candidateIds = candidates.map(c => c.id);
    console.log(`Found ${candidateIds.length} candidates to delete`);

    if (candidateIds.length > 0) {
      // Step 2: Hapus semua data terkait kandidat dalam urutan yang benar
      
      // Hapus CandidateStats
      const deletedStats = await prisma.candidateStats.deleteMany({
        where: { candidateId: { in: candidateIds } }
      });
      console.log(`Deleted ${deletedStats.count} candidate stats`);

      // Hapus SocialMedia
      const deletedSocialMedia = await prisma.socialMedia.deleteMany({
        where: { candidateId: { in: candidateIds } }
      });
      console.log(`Deleted ${deletedSocialMedia.count} social media records`);

      // Hapus Education
      const deletedEducation = await prisma.education.deleteMany({
        where: { candidateId: { in: candidateIds } }
      });
      console.log(`Deleted ${deletedEducation.count} education records`);

      // Hapus Experience
      const deletedExperience = await prisma.experience.deleteMany({
        where: { candidateId: { in: candidateIds } }
      });
      console.log(`Deleted ${deletedExperience.count} experience records`);

      // Hapus Achievement
      const deletedAchievements = await prisma.achievement.deleteMany({
        where: { candidateId: { in: candidateIds } }
      });
      console.log(`Deleted ${deletedAchievements.count} achievements`);

      // Hapus Program
      const deletedPrograms = await prisma.program.deleteMany({
        where: { candidateId: { in: candidateIds } }
      });
      console.log(`Deleted ${deletedPrograms.count} programs`);

      // Step 3: Hapus semua kandidat
      const deletedCandidates = await prisma.candidate.deleteMany({
        where: { electionId: { in: ids } }
      });
      console.log(`Deleted ${deletedCandidates.count} candidates`);
    }

    // Step 4: Hapus Vote yang terkait dengan elections
    const deletedVotes = await prisma.vote.deleteMany({
      where: { electionId: { in: ids } }
    });
    console.log(`Deleted ${deletedVotes.count} votes`);

    // Step 5: Hapus VoterElection yang terkait dengan elections
    const deletedVoterElections = await prisma.voterElection.deleteMany({
      where: { electionId: { in: ids } }
    });
    console.log(`Deleted ${deletedVoterElections.count} voter elections`);

    // Step 6: Hapus ElectionStatistics yang terkait dengan elections
    const deletedStatistics = await prisma.electionStatistics.deleteMany({
      where: { electionId: { in: ids } }
    });
    console.log(`Deleted ${deletedStatistics.count} election statistics`);

    // Step 7: Hapus semua election berdasarkan array `ids`
    const deletedElections = await prisma.election.deleteMany({
      where: { id: { in: ids } }
    });
    console.log(`Deleted ${deletedElections.count} elections`);

    // Kembalikan respons sukses
    return NextResponse.json(
      {
        message: "Elections and all associated data deleted successfully.",
        deletedElectionsCount: deletedElections.count,
        deletedCandidatesCount: candidateIds.length,
        deletedVotesCount: deletedVotes.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An error occurred while deleting elections:", error);

    // Tangani error lainnya
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
