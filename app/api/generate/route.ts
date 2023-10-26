import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { todos } = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "When Responding, welcome the user as 'my good sir' and write a motivating greeting that conveys the following feeling: 'Get Shit Done.' Limit the response to 200 characters.",
      },
      {
        role: "user",
        content: `Provide the summary for the following TO-DOs. Count the number of todos in each category(todo, wip, done). Then, Tell the user about the most important ones as per your understanding.
          Here is the data: ${JSON.stringify(todos)}`,
      },
    ],
    stream: false,
  });

  return NextResponse.json(response.choices[0].message);

  // try {
  //   return NextResponse.json({}, { status: 200 });
  // } catch (error) {
  //   if (error.response: Error) {
  //     console.error(error.response.status, error.response.data);
  //     return NextResponse.json({ error: error.response.data }, { status: 500 });
  //   } else {
  //     console.error(`Error with OpenAI API request: ${error.message}`);
  //     return NextResponse.json(
  //       { error: "An error occurred during your request." },
  //       { status: 500 }
  //     );
  //   }
  // }
}
