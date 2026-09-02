import { handlePost } from "@/features/quote/server/handler";

export async function POST(request) {
  return handlePost(request);
}
