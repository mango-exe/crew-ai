import { NextResponse } from 'next/server'

// get conversation by id
export async function GET (request: Request) {
  try {

  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// delete conversation by id
export async function DELETE (request: Request) {
  try {

  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
