import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import {
  create_title_prompt,
  editor_Prompt,
  News_Expert_Prompt,
  Project_Planner,
  ProjectPlannerPromptInterface,
  research_Prompt,
} from "./prompts";
import { News_Expert_Tools, Task } from "./tools";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

interface generateTopicInterface {
  topic: string;
  tone: string;
  audience: string;
}

interface researchAgentInterface {
  title: string;
  description: string;
  tone: string;
  audience: string;
}

export async function generateTopic({
  topic,
  tone,
  audience,
}: generateTopicInterface) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: News_Expert_Prompt },
    {
      role: "user",
      content: `TOPIC:${topic} TONE:${tone} Target Audience:${audience}`,
    },
  ];

  for (let i = 0; i < 5; i++) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools: News_Expert_Tools,
    });

    if (completion.choices[0].finish_reason == "tool_calls") {
      const toolsToBeCalled = completion.choices[0].message.tool_calls;
      if (!toolsToBeCalled) return;
      for (const tool of toolsToBeCalled) {
        //call the function
        const name = tool.function.name;
        const toolId = tool.id;

        const args = JSON.parse(tool.function.arguments);
        const func = await Task[name](args);

        messages.push({
          role: "assistant",
          content: null,
          tool_calls: toolsToBeCalled,
        });

        // Push the tool response message to the messages array
        messages.push({
          role: "tool",
          tool_call_id: toolId,
          content: JSON.stringify(func),
        });
      }
    }

    if (completion.choices[0].finish_reason == "stop") {
      return completion.choices[0].message.content;
    }
  }
}
export async function researchAgent({
  title,
  description,
  tone,
  audience,
}: researchAgentInterface) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: research_Prompt },
    {
      role: "user",
      content: `Section Title:${title} Description:${description} TONE:${tone} Target Audience:${audience}`,
    },
  ];

  try {
    for (let i = 0; i < 5; i++) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        tools: News_Expert_Tools,
      });

      if (completion.choices[0].finish_reason == "tool_calls") {
        const toolsToBeCalled = completion.choices[0].message.tool_calls;
        if (!toolsToBeCalled) return;
        messages.push({
          role: "assistant",
          content: null,
          tool_calls: toolsToBeCalled,
        });

        for (const tool of toolsToBeCalled) {
          //call the function
          const name = tool.function.name;
          const toolId = tool.id;

          const args = JSON.parse(tool.function.arguments);
          const func = await Task[name](args);

          if (!func) {
            return;
          }

          // Push the tool response message to the messages array
          messages.push({
            role: "tool",
            tool_call_id: toolId,
            content: JSON.stringify(func),
          });
        }
      }

      if (completion.choices[0].finish_reason == "stop") {
        return completion.choices[0].message.content;
      }
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}

export async function projectPlanner({
  tableOfContent,
  tone,
  audience,
}: ProjectPlannerPromptInterface) {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: Project_Planner({ tone, audience, tableOfContent }),
    },
  ];
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return completion.choices[0].message.content;
}

export const editorAgent = async function (contents: {
  title: string;
  output: string;
}) {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: editor_Prompt,
      },
      {
        role: "user",
        content: JSON.stringify(contents),
      },
    ];
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    return completion.choices[0].message.content;
  } catch (error) {}
};

export const createTitleAgent = async function (newsletter: string,audience:string,tone:string) {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: create_title_prompt(tone,audience),
      },
      {
        role: "user",
        content: `newsletter:${newsletter}`,
      },
    ];
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    return completion.choices[0].message.content;
  } catch (error) {}
};
