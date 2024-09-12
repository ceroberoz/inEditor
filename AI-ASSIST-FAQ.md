# AI Assist FAQ

## How does the AI Assist module work?

The AI Assist module is designed to generate improved LinkedIn posts using multiple AI models. Here's a high-level overview of the process:

## How does the AI Assist module work?

The AI Assist module is designed to generate improved LinkedIn posts using multiple AI models. Here's a high-level overview of the process:

```ascii
                  +----------------+
                  |   HTTP Request | [ASYNC] 📡
                  |    (Prompt)    |
                  +--------+-------+
                           |
                           v
                  +----------------+
                  |  Check Cache   | [ASYNC] 🔍
                  +--------+-------+
                           |
             +-------------+-------------+
             |                           |
             v                           v
    +----------------+          +----------------+
    | Return Cached  | [SYNC] 💾| Generate Multi | [ASYNC] 🤖
    |    Response    |          | Model Responses|
    +----------------+          +-------+--------+
             ^                          |
             |                          |
             |          +---------------v---------------+
             |          |               |               |
             |          v               v               v
             |  +----------------+ +----------+  +----------------+
             |  | Retry w/Backoff| |Rate Limit|  |  Other Errors  |
             |  +--------+-------+ +----+-----+  +--------+-------+
             |           | ⏳            | ⏱️           | ❌
             |           |              |                 |
             |           +--------------+-----------------+
             |                          |
             |                          v
             |                 +----------------+
             |                 |   Evaluate     | [SYNC] 📊
             |                 |   Responses    |
             |                 +-------+--------+
             |                         |
             |                         v
             |                 +----------------+
             |                 | Select Best    | [SYNC] 🏆
             |                 |     Model      |
             |                 +-------+--------+
             |                         |
             |                         v
             |                 +----------------+
             |                 |    Combine     | [SYNC] 🔗
             |                 |   Responses    |
             |                 +-------+--------+
             |                         |
             |                         v
             |                 +----------------+
             |                 | Generate Final | [ASYNC] ✨
             |                 |    Response    |
             |                 +-------+--------+
             |                         |
             |                         v
             |                 +----------------+
             |                 |  Cache Final   | [ASYNC] 💾
             |                 |    Response    |
             |                 +-------+--------+
             |                         |
             |                         v
             |                 +----------------+
             +---------------->|  HTTP Response | [ASYNC] 📤
                               |  (AI-generated |
                               |     content)   |
                               +----------------+
                                        ^
                                        |
                               +--------+-------+
                               |   Error Handler| 🚨
                               +----------------+
```

Emoji Legend:
- 📡 HTTP Request
- 🔍 Check Cache
- 💾 Cache operations
- 🤖 Generate Multi Model Responses
- ⏳ Retry with Backoff
- ⏱️ Rate Limit
- ❌ Other Errors
- 📊 Evaluate Responses
- 🏆 Select Best Model
- 🔗 Combine Responses
- ✨ Generate Final Response
- 📤 HTTP Response
- 🚨 Error Handler

## What are the main steps in the process?

1. Receive an HTTP request with a prompt for a LinkedIn post.
2. Check if a cached response exists for the given prompt.
3. If a cached response is found, return it immediately.
4. If no cache hit, generate responses using multiple AI models.
5. Evaluate the responses using similarity metrics.
6. Select the best-performing model based on the evaluation.
7. Combine responses from all models.
8. Generate a final response using the best model and the combined input.
9. Cache the final response for future use.
10. Return the AI-generated content as an HTTP response.

## What AI models are used?

The module uses three free AI models in order of preference:
1. meta-llama/llama-3-8b-instruct:free
2. mistralai/mistral-7b-instruct:free
3. google/gemma-2-9b-it:free

## How does the caching mechanism work?

The module uses Deno KV (Key-Value store) to cache responses. Each prompt is used as a key, and the generated response is stored as the value. Cached responses expire after 24 hours.

## How are responses evaluated?

Responses are evaluated using three metrics:
1. Length score: Compares the length of the response to the reference.
2. Jaccard similarity: Measures the overlap of words between the response and reference.
3. Cosine similarity: Calculates the cosine of the angle between the word frequency vectors of the response and reference.

These scores are combined to determine the best-performing model.

## What happens if there's an error or rate limiting?

The module implements a retry mechanism with exponential backoff for API calls. If a rate limit error occurs, it will wait and retry the request up to 3 times with increasing delays.

## How is the final response generated?

The final response is generated by:
1. Combining the responses from all models.
2. Creating a new prompt that includes the original prompt and the combined responses.
3. Using the best-performing model to generate a final, improved LinkedIn post based on this combined input.

## What's the format for sending a request to the AI Assist module?

The AI Assist module expects an HTTP POST request with a JSON body. Here's an example:

```http
POST /ai-assist HTTP/1.1
Host: your-api-domain.com
Content-Type: application/json

{
  "prompt": "Share insights on the importance of work-life balance in tech careers"
}
```

The `prompt` field should contain the topic or concept for which you want to generate a LinkedIn post.

## What does the response look like?

The AI Assist module returns a JSON response. Here's an example:

```json
{
  "bestModel": "meta-llama/llama-3-8b-instruct:free",
  "bestResponse": "🌟 Balancing Code and Life: The Key to Tech Career Success\n\nIn the fast-paced world of technology, it's easy to get caught up in the never-ending cycle of coding, debugging, and shipping. But here's a truth bomb: your best work comes when you're at your best self.\n\n🧘‍♂️ Why work-life balance matters in tech:\n• Prevents burnout and boosts creativity\n• Improves problem-solving skills\n• Enhances overall job satisfaction\n• Leads to better physical and mental health\n\nRemember, you're not just a developer – you're a human being with passions, relationships, and a life outside your IDE.\n\n💡 Pro tip: Set boundaries, prioritize self-care, and make time for activities that recharge you. Your code (and your future self) will thank you.\n\nWhat's your go-to method for maintaining work-life balance in your tech career? Share your tips in the comments!\n\n#TechLifeBalance #CareerWellness #DeveloperLifestyle\n\nAI model used: meta-llama/llama-3-8b-instruct:free\nUser prompt: Share insights on the importance of work-life balance in tech careers",
  "scores": [0.85, 0.79, 0.82]
}
```

The response includes:
- `bestModel`: The name of the AI model that produced the highest-scoring response.
- `bestResponse`: The final, improved LinkedIn post generated by the AI.
- `scores`: An array of scores for each model's performance (corresponding to the order of models used).

## How should I interpret the response?

The `bestResponse` field contains the generated LinkedIn post, which you can use directly or further refine. It typically includes:

1. A catchy headline
2. The main body with key points and insights
3. A call to action
4. Relevant hashtags
5. Information about the AI model used and the original prompt

The `scores` array helps you understand how each model performed, with higher scores indicating better performance.

## Can I customize the output format?

The current implementation provides a fixed output format. If you need a different format, you'll need to modify the `SYSTEM_MESSAGE` constant in the `aiAssist.ts` file to adjust the instructions given to the AI models.

## How do I handle errors in the response?

If an error occurs, the API will return a JSON response with an error field. For example:

```json
{
  "error": "Invalid prompt"
}
```

Common error scenarios include:
- Invalid or missing prompt
- Rate limiting errors
- Unexpected server errors

Always check for the presence of an `error` field in the response and handle it appropriately in your application.

## What's included in the HTTP response?

The HTTP response includes:
- The best-performing model
- The final AI-generated response
- Scores for each model's performance

## How do I handle the TypeScript errors in the diagnostic output?

The TypeScript errors in the diagnostic output are primarily due to the TypeScript compiler not recognizing Deno-specific modules and globals. To resolve these:

1. Add a triple-slash reference to Deno types at the top of your file:
   ```typescript
   /// <reference types="https://deno.land/x/types/index.d.ts" />
   ```

2. Ensure you're running the code with Deno, not a standard TypeScript compiler.

3. For module resolution errors, you may need to configure your IDE to recognize Deno modules or use a Deno-specific plugin for your editor.

These errors don't prevent the code from running in a Deno environment but may affect IDE functionality and type checking.

## What environment variables are required?

The following environment variables are required:
- `OPENROUTER_API_KEY`: Your API key for OpenRouter
- `YOUR_SITE_URL`: The URL of your website
- `YOUR_SITE_NAME`: The name of your website or application

Ensure these are set in your environment or in a `.env` file before running the application.

## How can I extend or modify the AI Assist module?

To extend or modify the AI Assist module:

1. Add new AI models to the `models` array if you want to use different or additional models.
2. Modify the `SYSTEM_MESSAGE` or `USER_PROMPT` constants to change the instructions given to the AI models.
3. Adjust the evaluation metrics in the `evaluateResponse` function if you want to change how responses are scored.
4. Modify the caching mechanism or duration by changing the `CACHE_EXPIRATION` constant or the caching logic in `getCachedResponse` and `setCachedResponse` functions.

Remember to test thoroughly after making any modifications to ensure the module still functions as expected.