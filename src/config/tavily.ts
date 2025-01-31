
import {tavily} from '@tavily/core'


const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function getWebResult ({query}:{query:string}){
  
    const response = await tvly.search(query,{searchDepth:"basic",
        includeAnswer:true,
        topic:'news',
        includeRawContent:true,
        maxResults:3
    });

    return response
}
