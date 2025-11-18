import { NextResponse } from "next/server";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Check if Cloudinary credentials are available
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variables." 
        },
        { status: 500 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kompresi gambar menggunakan sharp
    // Ini adalah backup kompresi di server-side untuk memastikan semua gambar terkompresi
    let processedBuffer;
    try {
      processedBuffer = await sharp(buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();

      console.log(`Image compressed: ${buffer.length} bytes -> ${processedBuffer.length} bytes (${((1 - processedBuffer.length / buffer.length) * 100).toFixed(1)}% reduction)`);
    } catch (sharpError) {
      console.warn("Sharp compression failed, using original buffer:", sharpError.message);
      // Jika sharp gagal (misalnya format tidak didukung), gunakan buffer asli
      processedBuffer = buffer;
    }

    // Create form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", new Blob([processedBuffer]), file.name);
    cloudinaryFormData.append("upload_preset", uploadPreset);
    cloudinaryFormData.append("folder", "e-voting/candidates");

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      console.error("Cloudinary upload error:", errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to upload image to Cloudinary",
          details: errorData 
        },
        { status: 500 }
      );
    }

    const result = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to upload photo",
        message: error.message 
      },
      { status: 500 }
    );
  }
}
