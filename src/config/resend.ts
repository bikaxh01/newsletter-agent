import { CreateBatchOptions, Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
    maxDuration: 500,
  };

export async function sendEmail(
  emails: string[],
  newsLetter: string,
  subject: string
) {
  try {
    const emailArr:CreateBatchOptions = emails.map((email) => {
      return {
        from: "Newsletter <noreplay@bikash.cloud>",
        to: [email],
        subject: subject,
        html: newsLetter,
      };
    });
  
    const { data, error } = await resend.batch.send(emailArr);
  
    if (error) {
      return console.error({ error });
    }
  
    console.log({ data });
  } catch (error) {
    console.log("🚀 ~ error:", error)
    
  }
}
