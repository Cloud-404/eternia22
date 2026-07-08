import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing survey ID" }, { status: 400 });
  }

  try {
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { responses: true },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const optionsList: string[] = JSON.parse(survey.options);
    const totalResponses = survey.responses.length;

    // Calculate percentage representation
    const counts: { [key: string]: number } = {};
    optionsList.forEach((opt) => {
      counts[opt] = 0;
    });

    survey.responses.forEach((resp) => {
      if (counts[resp.selectedOption] !== undefined) {
        counts[resp.selectedOption]++;
      }
    });

    const percentages: { [key: string]: number } = {};
    optionsList.forEach((opt) => {
      percentages[opt] = totalResponses > 0 ? (counts[opt] / totalResponses) * 100 : 0;
    });

    return NextResponse.json({
      percentages,
      total: totalResponses,
    });
  } catch (e) {
    console.error("Failed to fetch survey results:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { surveyId, selectedOption } = body;

    if (!surveyId || !selectedOption) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Cast vote transaction
    const response = await prisma.surveyResponse.create({
      data: {
        surveyId,
        selectedOption,
      },
    });

    return NextResponse.json({ success: true, id: response.id });
  } catch (e) {
    console.error("Failed to register survey vote:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
