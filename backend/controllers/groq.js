import Groq from "groq-sdk";
import ApiResponse from "../utils/ApiResponse.js";
import { getPrompt } from "../utils/Prompt.js";

const groq = new Groq();

const handleGroqResponse = async (req, res) => {
  try {
    if (!req.body) {
      return ApiResponse.error(res, "Body is required", 400);
    }

    const { prompt } = req.body;

    if (!prompt) {
      return ApiResponse.error(res, "Prompt is required", 400);
    }

    const promptToSend = getPrompt(prompt);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: promptToSend,
        },
      ],
    });

    const response = completion.choices[0]?.message?.content;

    return ApiResponse.success(
      res,
      {
        response,
      },
      "Response generated successfully"
    );
  } catch (error) {
    console.error("Error generating response:", error);
    return ApiResponse.serverError(res, "Failed to generate response");
  }
};

export { handleGroqResponse };
