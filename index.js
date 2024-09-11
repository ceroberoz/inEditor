const OpenAI = require("openai");
const natural = require('natural');
const stringSimilarity = require('string-similarity'); // New package for similarity scoring

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    // "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    // "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
});

// System message template for LinkedIn post creation
const SYSTEM_MESSAGE = `You are an expert LinkedIn post creator. Your task is to improve or create LinkedIn posts with the following structure:

1. Headline (1 line):
   - Attention-grabbing and relevant to the content
   - Use emojis sparingly if appropriate

2. Body (3-5 paragraphs):
   - Start with a hook or interesting fact
   - Present the main content or idea clearly
   - Use short paragraphs for readability
   - Include relevant personal experiences or insights
   - Use bullet points or numbered lists for easy scanning

3. Call to Action (1-2 lines):
   - Encourage engagement (e.g., comments, likes, shares)
   - Ask a question or prompt discussion
   - Provide a clear next step for readers

General Guidelines:
- Use simple, professional English
- Maintain a friendly and approachable tone
- Keep the total post under 1,300 characters
- Use line breaks between sections for clarity
- Include 2-3 relevant hashtags at the end

Please format the improved post clearly, separating the Headline, Body, and Call to Action sections.`;


async function getAIResponse(model, prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: prompt }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`Error with model ${model}:`, error);
    return "Failed to get response from AI"; // Return a fallback message
  }
}

function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function evaluateResponse(response, referenceResponse) {
  try {
    const lengthScore = Math.min(response.length / referenceResponse.length, 1); // Normalize length
    const lexicalScore = natural.JaroWinklerDistance(referenceResponse, response);
    const jaccardScore = jaccardSimilarity(referenceResponse, response); // Using Jaccard similarity
    const cosineScore = stringSimilarity.compareTwoStrings(referenceResponse, response); // Using Cosine similarity

    // Combine scores (adjust weights as needed)
    const combinedScore = (lengthScore + lexicalScore + jaccardScore + cosineScore) / 4; // Normalize if needed

    return combinedScore;
  } catch (error) {
    console.error("Error during manual evaluation:", error);
    return 0; // Return zero score on failure
  }
}

async function main() {
  const prompt = "Please help me improve this LinkedIn topic: tech winter and america";
  const referenceResponse = "This is tech winter and america topic that we expect from the AI.";

  const models = [
    "meta-llama/llama-3-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-2-9b-it:free",
  ];

  const responses = await Promise.all(
    models.map(model => getAIResponse(model, prompt))
  );

  const scores = responses.map(response => evaluateResponse(response, referenceResponse));

  scores.forEach((score, index) => {
    console.log(`\nModel: ${models[index]}`);
    console.log(`Response: "${responses[index]}"`);
    console.log(`Score: ${score}`);
  });

  const bestIndex = scores.reduce((bestIdx, score, idx) => (score > scores[bestIdx] ? idx : bestIdx), 0);

  console.log("\nBest Response:");
  console.log(`Model: ${models[bestIndex]}`);
  console.log(`Response: "${responses[bestIndex]}"`);
  console.log(`Score: ${scores[bestIndex]}`);
}

main();
