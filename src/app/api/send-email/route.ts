import { sendEmail } from "@/config/resend";

export async function POST(req: Request) {
  const { emails,newsLetter,subject } = await req.json();
  console.log("🚀 ~ POST ~ emails:", emails)
  await sendEmail(emails,newsLetter,subject);

  return Response.json("sent");
}
