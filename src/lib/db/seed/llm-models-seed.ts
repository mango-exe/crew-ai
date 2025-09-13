import 'reflect-metadata'

import axios from 'axios'

import { Container } from 'typedi'
import { DBConnection } from '@/lib/db/index'

import { llms } from '@/lib/db/schema/llm'
import { llmModels } from '@/lib/db/schema/llm-model'

const dbConnection = Container.get(DBConnection)

async function listAllModels () {
  const mistralReq = axios.get('https://api.mistral.ai/v1/models', {
    headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` }
  })

  const geminiReq = axios.get(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`
  )

  const openaiReq = axios.get('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
  })

  try {
    const [mistralResp, geminiResp, openaiResp] = await Promise.all([
      mistralReq,
      geminiReq,
      openaiReq
    ])

    return {
      mistral: mistralResp.data.data.map((m: any) => m.id),
      gemini: geminiResp.data.models.map((m: any) => m.name),
      openai: openaiResp.data.data.map((m: any) => m.id)
    }
  } catch (err: any) {
    console.error('Error fetching models:', err.message)
    return { mistral: [], gemini: [], openai: [] }
  }
}

export async function seedLLMModels () {
  console.log('🔄 Starting model sync...')

  try {
    const providers = await dbConnection.client.select().from(llms)
    const providerMap: Record<string, number> = {}
    providers.forEach((p) => (providerMap[p.name] = p.id))

    const providerNames = ['openai', 'mistral', 'gemini']

    for (const name of providerNames) {
      if (!providerMap[name]) {
        const result = await dbConnection.client
          .insert(llms)
          .values({ name, isDefault: false })
          .$returningId()

        providerMap[name] = result[0].id
        console.log(`➕ Added missing provider: ${name}`)
      }
    }

    const { openai, mistral, gemini } = await listAllModels()

    const rows = [
      ...openai.map((m) => ({
        llmId: providerMap.openai,
        modelName: m,
        isMultiModal: /vision|gpt-4o/.test(m)
      })),
      ...mistral.map((m) => ({
        llmId: providerMap.mistral,
        modelName: m,
        isMultiModal: false
      })),
      ...gemini.map((m) => ({
        llmId: providerMap.gemini,
        modelName: m.replace('models/', ''),
        isMultiModal: /vision|flash-lite/.test(m)
      }))
    ]

    // Insert or update models
    for (const row of rows) {
      await dbConnection.client
        .insert(llmModels)
        .values(row)
        .onDuplicateKeyUpdate({ set: { modelName: row.modelName } })
    }

    console.log('✅ Model sync complete')
  } catch (err: any) {
    console.error('❌ Error syncing models:', err.message)
  }
}
