import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "menu-images";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Create a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;

    const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      console.error("Error uploading file to Supabase Storage:", error);
      return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
