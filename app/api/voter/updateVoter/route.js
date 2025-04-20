import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

// Schema untuk update voter (semua optional, kecuali ID)
const updateVoterSchema = z.object({
  id: z.string().min(1, "Voter ID is required"),
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+\d{1,3}\d{9,12}$/, "Phone number must include country code (e.g., +628234567890)")
    .optional(),
  facultyId: z.string().optional(),
  majorId: z.string().optional(),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number").optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function PATCH(req) {
  try {
    const body = await req.json();
    const data = updateVoterSchema.parse(body);

    const existingVoter = await prisma.voter.findUnique({
      where: { id: data.id },
    });

    if (!existingVoter) {
      return NextResponse.json({ error: "Voter not found" }, { status: 404 });
    }

    // Jika facultyId dan majorId diubah, pastikan valid
    if (data.facultyId) {
      const faculty = await prisma.faculty.findUnique({
        where: { id: data.facultyId },
      });
      if (!faculty) {
        return NextResponse.json({ error: "Invalid facultyId" }, { status: 400 });
      }
    }

    if (data.majorId) {
      const major = await prisma.major.findUnique({
        where: { id: data.majorId },
      });
      if (!major) {
        return NextResponse.json({ error: "Invalid majorId" }, { status: 400 });
      }

      if (data.facultyId && major.facultyId !== data.facultyId) {
        return NextResponse.json({
          error: "The specified major does not belong to the given faculty",
        }, { status: 400 });
      }

      if (!data.facultyId && major.facultyId !== existingVoter.facultyId) {
        return NextResponse.json({
          error: "The specified major does not belong to the current faculty",
        }, { status: 400 });
      }
    }

    // Update data di Kinde jika ada perubahan pada name, email, phone, atau username
    if (data.name || data.email || data.phone) {
      const kindeUpdateData = {};
      if (data.name) kindeUpdateData.given_name = data.name;
      if (data.email) kindeUpdateData.email = data.email;
      if (data.phone) kindeUpdateData.phone = data.phone;

      console.log("Updating Kinde user with data:", kindeUpdateData);
      console.log("Kinde API URL:", KINDE_API_URL);
      console.log("Kinde user ID:", existingVoter.kindeId);

      try {
        // Update user profile data
        const kindeRes = await fetch(`${KINDE_API_URL}/api/v1/user?id=${existingVoter.kindeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${KINDE_API_KEY}`,
          },
          body: JSON.stringify(kindeUpdateData),
        });

        if (!kindeRes.ok) {
          const errorText = await kindeRes.text();
          console.error("Kinde API error:", errorText);
          return NextResponse.json(
            { error: "Failed to update Kinde user", detail: errorText },
            { status: 500 }
          );
        }

        const kindeResponse = await kindeRes.json();
        console.log("Kinde API response:", kindeResponse);

        // If email is being updated, handle email identity
        if (data.email && data.email !== existingVoter.email) {
          console.log("Email is being updated, handling email identity");
          console.log("Current email:", existingVoter.email);
          console.log("New email:", data.email);
          
          // First, get the user's identities to find the current email identity
          const identitiesUrl = `${KINDE_API_URL}/api/v1/users/${existingVoter.kindeId}/identities`;
          console.log("Fetching identities from URL:", identitiesUrl);
          
          const identitiesRes = await fetch(identitiesUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${KINDE_API_KEY}`,
            },
          });

          if (identitiesRes.ok) {
            const identitiesData = await identitiesRes.json();
            console.log("User identities response:", JSON.stringify(identitiesData, null, 2));
            
            // Check if identities array exists
            if (!identitiesData.identities || !Array.isArray(identitiesData.identities)) {
              console.error("No identities array found in response");
              console.log("Full response structure:", Object.keys(identitiesData));
            } else {
              console.log(`Found ${identitiesData.identities.length} identities`);
              
              // Find the current email identity
              const currentEmailIdentity = identitiesData.identities.find(
                (identity) => identity.type === "email" && identity.value === existingVoter.email
              );
              
              // Add the new email identity
              const addIdentityUrl = `${KINDE_API_URL}/api/v1/users/${existingVoter.kindeId}/identities`;
              console.log("Adding new identity with URL:", addIdentityUrl);
              
              const addIdentityRes = await fetch(addIdentityUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${KINDE_API_KEY}`,
                },
                body: JSON.stringify({
                  value: data.email,
                  type: "email"
                }),
              });

              console.log("Add identity response status:", addIdentityRes.status);
              
              if (!addIdentityRes.ok) {
                const errorText = await addIdentityRes.text();
                console.error("Kinde identity API error. Status:", addIdentityRes.status);
                console.error("Error details:", errorText);
                // Continue with the update even if adding identity fails
              } else {
                const addIdentityResponse = await addIdentityRes.json();
                console.log("Kinde identity API response:", JSON.stringify(addIdentityResponse, null, 2));
                
                // Get the ID of the newly created identity
                const newIdentityId = addIdentityResponse.identity?.id;
                
                if (newIdentityId) {
                  console.log("New identity ID:", newIdentityId);
                  
                  // Make the new identity primary
                  const updateIdentityUrl = `${KINDE_API_URL}/api/v1/identities/${newIdentityId}`;
                  console.log("Updating identity to primary with URL:", updateIdentityUrl);
                  
                  const updateIdentityRes = await fetch(updateIdentityUrl, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${KINDE_API_KEY}`,
                    },
                    body: JSON.stringify({
                      is_primary: true
                    }),
                  });
                  
                  console.log("Update identity response status:", updateIdentityRes.status);
                  
                  if (updateIdentityRes.ok) {
                    const updateResponse = await updateIdentityRes.json();
                    console.log("Successfully updated identity to primary:", JSON.stringify(updateResponse, null, 2));
                  } else {
                    const errorText = await updateIdentityRes.text();
                    console.error("Error updating identity to primary. Status:", updateIdentityRes.status);
                    console.error("Error details:", errorText);
                  }
                } else {
                  console.error("No identity ID found in response");
                }
              }
            }
          } else {
            const errorText = await identitiesRes.text();
            console.error("Failed to fetch user identities. Status:", identitiesRes.status);
            console.error("Error details:", errorText);
          }
        }
      } catch (error) {
        console.error("Error updating Kinde user:", error);
        return NextResponse.json(
          { error: "Failed to update Kinde user", detail: error.message },
          { status: 500 }
        );
      }
    }

    // Lakukan update di database lokal
    const updatedVoter = await prisma.voter.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        facultyId: data.facultyId,
        majorId: data.majorId,
        year: data.year,
        status: data.status,
      },
    });

    return NextResponse.json({
      message: "Voter updated successfully",
      voter: updatedVoter,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}