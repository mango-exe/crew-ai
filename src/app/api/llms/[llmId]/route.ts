import { NextResponse } from 'next/server'

// set default LLM
export async function PUT (request: Request) {
  try {

  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
