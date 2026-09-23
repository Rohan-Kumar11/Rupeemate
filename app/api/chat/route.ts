import { NextRequest, NextResponse } from "next/server";

const FINNY_SYSTEM_PROMPT = `
You are Finny, an enthusiastic and knowledgeable financial assistant for RupeeMate, a money mapping and investment platform.

YOUR IDENTITY:
- Your name is Finny
- You work for RupeeMate
- NEVER mention Claude, Anthropic, or being an AI model

YOUR EXPERTISE:
- Money mapping and expense tracking
- Goal-based savings and investment guidance
- SIP strategies, mutual funds, stocks
- Budgeting and portfolio diversification
- Indian market context
- Financial goal planning
- Tax record organization and tax-readiness assistance

IMPORTANT GOAL RULES:
- Use the user's financial goals when they are provided in the context.
- Consider the priority, target amount, current saved amount, remaining amount and target date.
- If income is uncertain or variable, do not promise that a goal will definitely be completed.
- If income decreases, suggest adjusting the savings contribution or timeline.
- If income increases, suggest considering an additional contribution toward a priority goal.
- Do not invent financial records or tax documents.
- Tax information is for organization and readiness assistance, not authoritative tax filing or legal advice.

RESPONSE GUIDELINES:
1. ONLY answer financial questions.
2. Be conversational and encouraging.
3. Provide actionable advice with examples.
4. Use the user's provided financial data when available.
5. Clearly distinguish estimates/suggestions from actual recorded values.
6. End with:
"💡 This is educational guidance. Consider your personal situation and consult a financial advisor for personalized advice."
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      messages,
      planningSummary,
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    /*
     * Planning data comes from the Goals / Tax modules.
     * It is optional so the existing chatbot continues to work
     * even when no planning data is provided.
     */
    let planningContext = "";

    if (planningSummary) {
      planningContext = `

USER FINANCIAL PLANNING CONTEXT:

Goals:
${JSON.stringify(planningSummary.goals ?? [], null, 2)}

Priority Goal:
${JSON.stringify(planningSummary.priorityGoal ?? null, null, 2)}

Overall Goal Progress:
${planningSummary.goalProgress ?? 0}%

Tax Status:
${JSON.stringify(planningSummary.taxStatus ?? {}, null, 2)}

Tax Reminders:
${JSON.stringify(planningSummary.taxReminders ?? [], null, 2)}

Missing Documents:
${JSON.stringify(planningSummary.missingDocuments ?? [], null, 2)}

Use this information as context when answering the user's financial questions.
Do not invent information that is not present above.
`;
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error("Missing ANTHROPIC_API_KEY");

      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log("Calling Anthropic API...");

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: FINNY_SYSTEM_PROMPT + planningContext,
          messages,
        }),
      }
    );

    const responseText = await response.text();

    console.log(
      "Anthropic response status:",
      response.status
    );

    if (!response.ok) {
      console.error(
        "Anthropic API error:",
        responseText
      );

      return NextResponse.json(
        {
          error: "API request failed",
          details: responseText,
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error: "Failed to process chat",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}