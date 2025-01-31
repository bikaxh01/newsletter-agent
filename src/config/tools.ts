import { ChatCompletionTool } from "openai/resources/index.mjs";
import { getWebResult } from "./tavily";


export const Task: any = {
    getWebResult:getWebResult
  };

export const News_Expert_Tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getWebResult",
      description: "get web search result with content",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "To get relevant content ",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];


