import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateNpmField() {
  try {
    console.log('Starting NPM field migration...');
    
    // Use raw MongoDB query to find voters without npm
    const votersWithoutNpm = await prisma.voter.findRaw({
      filter: { npm: null }
    });

    console.log(`Found ${votersWithoutNpm.length} voters without NPM field`);

    // Update each voter with NPM extracted from email
    for (const voter of votersWithoutNpm) {
      // Extract NPM from email (assuming format: 237006081@student.unsil.ac.id)
      const email = voter.email;
      const npmMatch = email.match(/^(\d{9})@/);
      const npm = npmMatch ? npmMatch[1] : `VOT${voter._id.$oid.slice(-6)}`; // fallback to voter ID if no match

      console.log(`Updating voter ${voter._id.$oid}: ${email} -> NPM: ${npm}`);
      
      try {
        // Use MongoDB update command
        await prisma.$runCommandRaw({
          update: 'Voter',
          updates: [
            {
              q: { _id: { $oid: voter._id.$oid } },
              u: { $set: { npm: npm } }
            }
          ]
        });
        console.log(`✓ Updated voter ${voter._id.$oid}`);
      } catch (updateError) {
        console.error(`✗ Failed to update voter ${voter._id.$oid}:`, updateError.message);
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateNpmField();
