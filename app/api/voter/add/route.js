import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const KINDE_API_URL = process.env.KINDE_API_URL;
const KINDE_API_KEY = process.env.KINDE_API_KEY;

export async function POST(req) {
    try {
        const { nim, name, email, fakultas, jurusan, angkatan, status, phone } = await req.json();

        // Validasi input
        if (!nim || !name || !email || !fakultas || !jurusan || !angkatan || !status || !phone) {
            console.error("Validation Error: Missing required fields");
            return NextResponse.json({ error: "Semua field wajib diisi (NIM, Name, Email, Password, Fakultas, Jurusan, Angkatan, Status, Phone)" }, { status: 400 });
        }

        console.log("Creating user in Kinde with NIM:", nim);

        // Membuat user di Kinde
        const response = await fetch(`${KINDE_API_URL}/api/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${KINDE_API_KEY}`
            },
            body: JSON.stringify({
                profile: {
                    given_name: name,
                    family_name: ""
                },
                identities: [
                    {
                        type: 'email',
                        is_verified: true,
                        details: {
                            email: email
                        }
                    },
                    {
                        type: 'phone',
                        is_verified: false,
                        details: {
                            phone: phone,
                            phone_country_id: "id"
                        }
                    },
                    {
                        type: 'username',
                        details: {
                            username: nim
                        }
                    }
                ]
            }),
        });

        if (!response.ok) {
            const contentType = response.headers.get("Content-Type");
            let error;
            if (contentType && contentType.includes("application/json")) {
                error = await response.json();
            } else {
                error = await response.text();
            }
            console.error("Error from Kinde API:", error);
            return NextResponse.json({ error: "Error from Kinde API: " + error }, { status: response.status });
        }

        const kindeUser = await response.json();
        console.log("User created in Kinde with ID:", kindeUser.id);

        // Menyimpan voter ke database
        await prisma.voter.create({
            data: {
                kindeId: kindeUser.id,
                nim,
                name,
                email,
                phone, 
                fakultas,
                jurusan,
                angkatan,
                status,
                voted: false,
                createdAt: new Date(),
            }
        });

        console.log("Voter successfully added to MongoDB with NIM:", nim);
        return NextResponse.json({ message: "Voter berhasil ditambahkan" }, { status: 201 });
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}