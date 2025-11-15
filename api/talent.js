import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const systemPrompt = `
You are TalentScout Pro, a hiring assistant.

Rules:
- Write like a human (professional but conversational).
- Support resume screening, JD creation, boolean search, InMails, email templates.
- Compare resume vs JD and provide match score + skill gaps.
- Generate outreach for recruiters.
- Provide RBC hybrid rules when relevant.
- Produce boolean optimized for LinkedIn Recruiter, Google X-ray, GitHub.
- Provide interview questions with expected answers + red flags.
- Keep structure clean and output organized.

Always return:
1. Candidate Match Score
2. Skills Match vs Gaps
3. JD Summary
4. Full Job Description
5. Boolean Search String
6. LinkedIn InMail Outreach
7. Email Outreach Template
8. Interview Questions & Red Flags
`;

  const { jobTitle, jobDescription, resume } = req.body;

  const finalPrompt = `
Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate Resume:
${resume}

Follow all TalentScout Pro rules and generate the complete output.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: finalPrompt }
      ]
    });

    const result = completion.choices[0].message.content;

    res.status(200).json({ output: result });

  } catch (err) {
    res.status(500).json({ output: "Error: " + err.message });
  }
}
