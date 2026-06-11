import { NextResponse } from "next/server";
import { uploadQnaImage } from "@/lib/qna";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic"];

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없어요" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "이미지 파일만 올릴 수 있어요 (jpg, png, gif, webp)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "이미지는 8MB 이하로 올려 주세요" }, { status: 400 });
  }
  const url = await uploadQnaImage(file);
  return NextResponse.json({ ok: true, url });
}
