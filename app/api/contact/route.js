import { handlePost } from "@/features/contact/server/handler";

export async function POST(request) {
  return handlePost(request);
}
