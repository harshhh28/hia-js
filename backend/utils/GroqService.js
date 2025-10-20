import Groq from "groq-sdk";

// Model configuration tiers
export const ModelTier = {
  PRIMARY: "PRIMARY",
  SECONDARY: "SECONDARY",
  TERTIARY: "TERTIARY",
  FALLBACK: "FALLBACK",
};

export const MODEL_CONFIG = {
  [ModelTier.PRIMARY]: {
    provider: "groq",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    max_tokens: 2000,
    temperature: 0.7,
  },
  [ModelTier.SECONDARY]: {
    provider: "groq",
    model: "llama-3.3-70b-versatile",
    max_tokens: 2000,
    temperature: 0.7,
  },
  [ModelTier.TERTIARY]: {
    provider: "groq",
    model: "llama-3.1-8b-instant",
    max_tokens: 2000,
    temperature: 0.7,
  },
  [ModelTier.FALLBACK]: {
    provider: "groq",
    model: "llama-3.1-8b-instant",
    max_tokens: 2000,
    temperature: 0.7,
  },
};

export class GroqService {
  constructor() {
    this.groq = new Groq();
    this.currentTier = ModelTier.PRIMARY;
    this.isOffline = false;
  }

  // Check if we can reach Groq API
  async checkConnectivity() {
    try {
      // Simple connectivity test
      const testResponse = await fetch(
        "https://api.groq.com/openai/v1/models",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      );
      return testResponse.ok;
    } catch (error) {
      console.log("Groq API connectivity check failed:", error.message);
      return false;
    }
  }

  // Generate a basic medical analysis when API is offline
  generateOfflineMedicalAnalysis(text) {
    const textLower = text.toLowerCase();

    // Basic analysis based on common medical terms
    let analysis = "OFFLINE MEDICAL ANALYSIS\n\n";
    analysis +=
      "DISCLAIMER: This is a basic offline analysis. Please consult a healthcare provider for proper medical advice.\n\n";

    // Check for common medical indicators
    if (textLower.includes("hemoglobin") || textLower.includes("hb")) {
      analysis += "Blood Analysis Detected:\n";
      analysis += "- Hemoglobin levels found in report\n";
      analysis +=
        "- Please check if values are within normal range (12-16 g/dL for adults)\n\n";
    }

    if (textLower.includes("glucose") || textLower.includes("sugar")) {
      analysis += "Glucose Analysis:\n";
      analysis += "- Blood sugar levels detected\n";
      analysis += "- Normal fasting glucose: 70-100 mg/dL\n";
      analysis += "- Consult doctor if values are outside normal range\n\n";
    }

    if (
      textLower.includes("cholesterol") ||
      textLower.includes("hdl") ||
      textLower.includes("ldl")
    ) {
      analysis += "Cholesterol Analysis:\n";
      analysis += "- Lipid profile detected\n";
      analysis +=
        "- Monitor HDL (good cholesterol) and LDL (bad cholesterol) levels\n";
      analysis += "- Follow dietary recommendations from your doctor\n\n";
    }

    if (textLower.includes("creatinine") || textLower.includes("kidney")) {
      analysis += "Kidney Function:\n";
      analysis += "- Creatinine levels detected\n";
      analysis += "- Normal range: 0.6-1.2 mg/dL\n";
      analysis += "- Elevated levels may indicate kidney issues\n\n";
    }

    analysis += "Recommendations:\n";
    analysis += "- Review all values with your healthcare provider\n";
    analysis += "- Follow up on any abnormal results\n";
    analysis += "- Maintain regular health checkups\n";
    analysis += "- Keep track of your medical history\n\n";

    analysis +=
      "Note: This analysis was generated offline due to API connectivity issues. For comprehensive analysis, please try again when internet connection is restored.";

    return analysis;
  }

  // Generate a basic chat response when API is offline
  generateOfflineChatResponse(question) {
    const questionLower = question.toLowerCase();

    let response =
      "I'm currently experiencing connectivity issues with my AI service. ";

    if (
      questionLower.includes("blood") ||
      questionLower.includes("test") ||
      questionLower.includes("report")
    ) {
      response +=
        "However, I can provide some general guidance about medical reports:\n\n";
      response += "- Always review results with your healthcare provider\n";
      response += "- Normal ranges can vary between laboratories\n";
      response += "- Follow up on any abnormal values\n";
      response += "- Keep copies of all your medical reports\n\n";
    } else if (
      questionLower.includes("symptom") ||
      questionLower.includes("pain")
    ) {
      response += "For symptoms and pain concerns:\n\n";
      response += "- Document your symptoms with details\n";
      response += "- Note the duration and severity\n";
      response += "- Consult your healthcare provider\n";
      response += "- Seek emergency care for severe symptoms\n\n";
    } else {
      response += "For medical questions, please:\n\n";
      response += "- Consult with your healthcare provider\n";
      response += "- Use reliable medical resources\n";
      response += "- Keep emergency numbers handy\n\n";
    }

    response +=
      "Please try again when my AI service is back online for more detailed assistance.";

    return response;
  }

  async generateResponse(prompt, tier = ModelTier.PRIMARY) {
    try {
      // Check connectivity first
      const isConnected = await this.checkConnectivity();
      if (!isConnected) {
        this.isOffline = true;
        throw new Error("API connectivity issues detected");
      }

      const config = MODEL_CONFIG[tier];

      // Add plain text instruction to all prompts
      const enhancedPrompt = `${prompt}

IMPORTANT: Respond in PLAIN TEXT only. Do not use markdown formatting, asterisks (*), underscores (_), bold text (**), or any special formatting. Use simple text with line breaks for readability.`;

      const completion = await this.groq.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        max_tokens: config.max_tokens,
        temperature: config.temperature,
      });

      return completion.choices[0]?.message?.content;
    } catch (error) {
      console.error(`Error with ${tier} model:`, error);

      // Check if it's a connectivity issue
      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("connectivity") ||
        error.cause?.code === "ENOTFOUND"
      ) {
        this.isOffline = true;
        console.log("Switching to offline mode due to connectivity issues");
        throw new Error("API connectivity issues - switching to offline mode");
      }

      // Try fallback models if primary fails
      if (tier !== ModelTier.FALLBACK) {
        const fallbackTier =
          tier === ModelTier.PRIMARY
            ? ModelTier.SECONDARY
            : tier === ModelTier.SECONDARY
            ? ModelTier.TERTIARY
            : ModelTier.FALLBACK;

        console.log(`Trying fallback model: ${fallbackTier}`);
        return await this.generateResponse(prompt, fallbackTier);
      }

      throw error;
    }
  }

  async generateMedicalAnalysis(prompt) {
    try {
      // Use chunking for large medical reports
      return await this.generateResponseForLargeText(prompt, ModelTier.PRIMARY);
    } catch (error) {
      if (this.isOffline || error.message.includes("connectivity")) {
        console.log(
          "Using offline medical analysis due to connectivity issues"
        );
        // Extract text from prompt for offline analysis
        const textMatch = prompt.match(
          /Please analyze the following medical report:\s*\n\s*\n(.*?)(?:\n\nProvide a comprehensive|$)/s
        );
        const medicalText = textMatch ? textMatch[1] : prompt;
        return this.generateOfflineMedicalAnalysis(medicalText);
      }
      throw error;
    }
  }

  async generateChatResponse(prompt) {
    try {
      // Use SECONDARY tier for chat responses
      return await this.generateResponse(prompt, ModelTier.SECONDARY);
    } catch (error) {
      if (this.isOffline || error.message.includes("connectivity")) {
        console.log("Using offline chat response due to connectivity issues");
        // Extract user question from prompt
        const questionMatch = prompt.match(
          /The user has provided the following prompt:\s*(.*?)(?:\n\nPlease generate|$)/s
        );
        const userQuestion = questionMatch ? questionMatch[1] : prompt;
        return this.generateOfflineChatResponse(userQuestion);
      }
      throw error;
    }
  }

  // Helper method to estimate token count (rough approximation)
  estimateTokenCount(text) {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Method to handle large texts by chunking
  async generateResponseForLargeText(
    prompt,
    tier = ModelTier.PRIMARY,
    maxChunkSize = 6000
  ) {
    try {
      const estimatedTokens = this.estimateTokenCount(prompt);

      if (estimatedTokens <= maxChunkSize) {
        // Text is small enough, process normally
        return await this.generateResponse(prompt, tier);
      }

      // Text is too large, need to chunk it
      console.log(
        `Text too large (${estimatedTokens} tokens), chunking for processing...`
      );

      // Split the prompt into chunks
      const chunks = this.splitTextIntoChunks(prompt, maxChunkSize);
      const responses = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkPrompt = `This is part ${i + 1} of ${
          chunks.length
        } of a medical report. Please analyze this section:

${chunk}

IMPORTANT: Respond in PLAIN TEXT only. Do not use markdown formatting, asterisks (*), underscores (_), bold text (**), or any special formatting. Use simple text with line breaks for readability.`;

        try {
          const response = await this.generateResponse(chunkPrompt, tier);
          responses.push(`--- Part ${i + 1} Analysis ---\n${response}\n`);
        } catch (error) {
          console.error(`Error processing chunk ${i + 1}:`, error);
          responses.push(
            `--- Part ${i + 1} Analysis ---\nError processing this section.\n`
          );
        }
      }

      return responses.join("\n");
    } catch (error) {
      if (this.isOffline || error.message.includes("connectivity")) {
        console.log(
          "Using offline analysis for large text due to connectivity issues"
        );
        // Extract medical text from prompt for offline analysis
        const textMatch = prompt.match(
          /Please analyze the following medical report:\s*\n\s*\n(.*?)(?:\n\nProvide a comprehensive|$)/s
        );
        const medicalText = textMatch ? textMatch[1] : prompt;
        return this.generateOfflineMedicalAnalysis(medicalText);
      }
      throw error;
    }
  }

  // Helper method to split text into chunks
  splitTextIntoChunks(text, maxChunkSize) {
    const chunks = [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    let currentChunk = "";

    for (const sentence of sentences) {
      const sentenceWithPunctuation = sentence.trim() + ".";
      const testChunk =
        currentChunk + (currentChunk ? " " : "") + sentenceWithPunctuation;

      if (this.estimateTokenCount(testChunk) <= maxChunkSize) {
        currentChunk = testChunk;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentenceWithPunctuation;
        } else {
          // Single sentence is too large, split by words
          const words = sentenceWithPunctuation.split(" ");
          let wordChunk = "";

          for (const word of words) {
            const testWordChunk = wordChunk + (wordChunk ? " " : "") + word;
            if (this.estimateTokenCount(testWordChunk) <= maxChunkSize) {
              wordChunk = testWordChunk;
            } else {
              if (wordChunk) {
                chunks.push(wordChunk.trim());
                wordChunk = word;
              } else {
                chunks.push(word); // Single word is too large, add as is
              }
            }
          }
          currentChunk = wordChunk;
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
