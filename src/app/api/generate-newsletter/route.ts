import {
  createTitleAgent,
  editorAgent,
  generateTopic,
  projectPlanner,
  researchAgent,
} from "@/config/openAI";
import { error } from "console";

interface PlanInterface {
  newsletterSections: [{ title: string; description: string }];
}


export async function POST(req: Request) {
  //get topic,tone,audience

  try {
    const { topic, tone, audience } = await req.json();

    // create topic
    const tableOfContent = await generateTopic({ topic, tone, audience });
    //console.log("🚀 ~ POST ~ tableOfContent:", tableOfContent);
    if (!tableOfContent) throw Error("something went wrong");
    const planner = await projectPlanner({ tableOfContent, tone, audience });

    if (!planner) throw Error("something went wrong");

    const projectPlan: PlanInterface = JSON.parse(planner);

    const response = await Promise.all(
      projectPlan.newsletterSections.map((section) => {
        const data = {
          title: section.title,
          description: section.description,
          tone: tone,
          audience: audience,
        };
        const res = researchAgent(data);
        return res;
      })
    );

    // if(!response || response) throw Error("Null Response")
    //@ts-ignore
    const formattedResponse = await editorAgent(response);

    if (!formattedResponse) throw Error("error in formatting");

    const newsletterSubject = await createTitleAgent(formattedResponse,audience,tone);
    

   

    return Response.json({success:true,
      data:formattedResponse,
      readyToSend:true,
      subject:newsletterSubject
    });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return Response.json("something went wrong");
  }
}
