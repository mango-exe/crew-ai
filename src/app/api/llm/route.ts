import { NextResponse } from 'next/server'

// get llm with available models
export async function GET (request: Request) {
  try {

  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
