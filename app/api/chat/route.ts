import { NextRequest, NextResponse } from 'next/server';

const FINNY_SYSTEM_PROMPT = `You are Finny, an enthusiastic and knowledgeable financial assistant for RupeeMate, a money mapping and investment platform. Your primary role is to help users save money, invest wisely, and achieve their financial goals.

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

RESPONSE GUIDELINES:
1. ONLY answer financial questions
2. Be conversational and encouraging
3. Provide actionable advice with examples
4. End with: "💡 This is educational guidance. Consider your personal situation and consult a financial advisor for personalized advice."`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('Missing ANTHROPIC_API_KEY');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Calling Anthropic API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: FINNY_SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const responseText = await response.text();
    console.log('Anthropic response status:', response.status);
    console.log('Anthropic response:', responseText.substring(0, 200));

    if (!response.ok) {
      console.error('Anthropic API error:', responseText);
      return NextResponse.json(
        { error: 'API request failed', details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}