import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal
} from '@/app/components/ui/dialog'
import { Switch } from '@/app/components/ui/switch'

import Image from 'next/image'

import { useLLMStore } from '@/lib/stores/llms-store'
import { LLMPopulatedWithModels } from '@/lib/types/schema/llm.types'
import { LLMModel } from '@/lib/types/schema/llm-model.types'
import { PopulatedUserLLMPreferences } from '@/lib/types/schema/user-llm-preferences'

export default function ModelsDialog ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
  const [selectedLLM, setSelectedLLM] = useState<LLMPopulatedWithModels | null>(null)
  const [selectedLLMModel, setSelectedLLMModel] = useState<LLMModel | null>(null)
  const { availableLLMS, getLLMS, llmsPreferences, setDefaultLLM, setLLMModel } = useLLMStore(state => state)

  const [selectedLLMPreferences, setSelectedLLMPreferences] = useState<PopulatedUserLLMPreferences | null>(null)

  useEffect(() => {
    getLLMS()
  }, [])

  useEffect(() => {
    setSelectedLLM(availableLLMS[0] || null)
  }, [availableLLMS])

  useEffect(() => {
    setSelectedLLMPreferences(llmsPreferences.find(preference => preference.llm.id === selectedLLM?.id) || null)
  }, [llmsPreferences, selectedLLM])

  const handleIsDefaultChange = (llmId: string) => {
    setDefaultLLM(llmId)
  }

  const handleSetLLMModel = (llmModel: LLMModel) => {
    setLLMModel(selectedLLM?.id.toString() as string, llmModel.id.toString())
  }

  const llmTemplate = (llm: LLMPopulatedWithModels) => {
    const isSelected = selectedLLM?.id === llm.id

    return (
      <div
        key={llm.id}
        className={`cursor-pointer rounded-full p-2 transition
                    ${isSelected ? 'ring-2 ring-white' : ''}`}
        onClick={() => setSelectedLLM(llm)}
      >
        <Image
          width={40}
          height={40}
          src={`/${llm.name}.svg`}
          alt='Missing icon'
        />
      </div>
    )
  }

  const llmModelTemplate = (llmModel: LLMModel) => {
    const isSelected = llmsPreferences.find(preference => preference.llmModel.id === llmModel?.id)

    return (
      <div
        className={`transition-colors duration-200 text-white/80 hover:bg-white/10 hover:text-white rounded-3xl p-2 cursor-pointer select-none
                    ${(isSelected != null) ? 'bg-white/20 text-white' : ''}`}
        onDoubleClick={() => handleSetLLMModel(llmModel)}
      >
        {llmModel.modelName}
      </div>
    )
  }

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className='glass-surface'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Available LLMs</DialogTitle>
            <div className='w-full flex flex-row justify-evenly gap-x-10'>
              {availableLLMS.map(llmTemplate)}
            </div>
            <div>
              <div className='text-xl font-bold'>Available models</div>
              <div
                className='h-[10em] flex flex-col gap-y-1 items-center overflow-auto
                           thin-white-scrollbar'
              >
                {(selectedLLM != null) && selectedLLM.availableModels.map(llmModelTemplate)}
              </div>

            </div>
            {(selectedLLMPreferences != null) && (
              <div>
                <div className='text-xl font-bold'>LLM preferences</div>
                <div className='flex flex-row items-center gap-x-1'>
                  <span className='font-bold mr-1'>Is default LLM:</span>
                  <span>{selectedLLMPreferences?.isDefault ? 'Yes' : 'No'}</span>
                  <Switch checked={selectedLLMPreferences?.isDefault} onCheckedChange={() => handleIsDefaultChange(selectedLLM?.id?.toString() as string)} />
                </div>
                <div>
                  <span className='font-bold mr-1'>LLM selected model:</span>
                  <span>{selectedLLMPreferences?.llmModel.modelName}</span>
                </div>
              </div>)}
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
