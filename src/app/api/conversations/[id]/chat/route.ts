import { NextResponse } from 'next/server'

// new chat in conversation
export async function POST (request: Request) {
  try {

  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
