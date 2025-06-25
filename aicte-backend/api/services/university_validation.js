const axios = require("axios");
const Groq = require("groq-sdk");

const groqApiKey = "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";
const client = new Groq({ apiKey: groqApiKey });

async function verifyUniversity(universityDetails) {
  const { name, email, campus_address, admin_phone, category } = universityDetails;

  const prompt = `
    Verify the authenticity of the following university:
    Name: ${name}
    Email: ${email}
    Campus Address: ${campus_address}
    Admin Phone: ${admin_phone}
    Category: ${category}

    Please perform the following checks:
    1. Verify if the campus address is a real location.
    2. Check if the university name matches any known educational institutions in that location.
    3. Validate if the email domain is consistent with typical educational institution domains.
    4. Assess if the provided information is consistent with a genuine university.

    Based on these checks, determine if this appears to be an authentic university.
    Respond with a JSON object containing a 'valid' key set to true if it seems authentic, or false if it doesn't.
    Also include a 'reason' key explaining your decision.
  `;

  try {
    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
      response_format: { type: "json_object" },
    });

    // Parse and return the JSON response
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error verifying university:", error.message);
    return { valid: false, reason: "Error occurred during verification process." };
  }
}

module.exports = {verifyUniversity}