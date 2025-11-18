/**
 * Example: Image Upload Component with Compression
 * Contoh penggunaan kompresi gambar untuk komponen upload lainnya
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { compressImage, formatFileSize } from "@/lib/imageCompression";

export default function ImageUploadExample() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar", {
        description: "Maksimal 10MB",
      });
      return;
    }

    try {
      setIsCompressing(true);
      const originalSize = file.size;

      // Kompresi gambar
      toast.info("Mengkompresi gambar...");

      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85,
        mimeType: 'image/jpeg',
      });

      const compressedSize = compressedFile.size;
      const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      // Simpan info kompresi
      setCompressionInfo({
        originalSize: formatFileSize(originalSize),
        compressedSize: formatFileSize(compressedSize),
        compressionRatio: compressionRatio,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);

      setImageFile(compressedFile);
      
      toast.success("Gambar berhasil dikompresi", {
        description: `Ukuran dikurangi ${compressionRatio}% (${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)})`,
      });

      setIsCompressing(false);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Gagal mengkompresi gambar", {
        description: error.message || "Silakan coba lagi",
      });
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setCompressionInfo(null);
    const fileInput = document.getElementById("imageFile");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Gambar berhasil diupload");
        // Reset form
        handleRemoveImage();
      } else {
        toast.error("Gagal upload gambar");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Terjadi kesalahan saat upload");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="imageFile">Upload Gambar</Label>
        
        {/* Preview */}
        {imagePreview && (
          <div className="relative w-full aspect-video rounded-lg border overflow-hidden bg-muted/30">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        <div className="space-y-2">
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("imageFile")?.click()}
            disabled={isCompressing}
          >
            {isCompressing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengkompresi...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {imageFile ? "Ganti Gambar" : "Pilih Gambar"}
              </>
            )}
          </Button>

          {/* File Info */}
          {imageFile && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Image className="h-3 w-3" />
                {imageFile.name} ({formatFileSize(imageFile.size)})
              </p>
              {compressionInfo && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Dikompresi {compressionInfo.compressionRatio}% 
                  ({compressionInfo.originalSize} → {compressionInfo.compressedSize})
                </p>
              )}
            </div>
          )}

          {isCompressing && (
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Mengkompresi gambar...
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Format: JPG, PNG, WebP, GIF. Maksimal 10MB. Gambar akan otomatis dikompresi.
          </p>
        </div>
      </div>

      <Button type="submit" disabled={!imageFile || isCompressing}>
        Upload Gambar
      </Button>
    </form>
  );
}
