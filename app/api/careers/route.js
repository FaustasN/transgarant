import { handlePost } from "@/features/careers/server/handler";

export async function POST(request) {
  return handlePost(request);
}
