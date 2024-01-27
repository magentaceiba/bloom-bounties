'use client'

import { useRef, useEffect, useState } from 'react'

export function useInputFocus(tracker?: any) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputIndex, setInputIndex] = useState(0)
  const [inputs, setInputs] = useState<HTMLInputElement[]>([])

  const handleSetInputs = () => {
    const newInputs = Array.from(document.querySelectorAll('input[data-index]'))
    // @ts-ignore
    setInputs(newInputs)
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        handleSetInputs()
      })

      observer.observe(document, { childList: true, subtree: true })

      handleSetInputs()

      return () => observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof document])

  useEffect(() => {
    setInputIndex(inputs.findIndex((i) => i === inputRef.current))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs])

  const onDone = () => {
    if (typeof document !== 'undefined') {
      const nextIndex = inputs.findIndex(
        (input) => parseInt(input.dataset.index!) > inputIndex
      )

      if (nextIndex !== -1) inputs[nextIndex].focus()
      // If it's the last one, focus on the first
      else inputs[0].focus()
    }
  }

  useEffect(() => {
    if (inputRef.current && tracker) {
      inputRef.current.focus()
    }
  }, [tracker])

  return {
    inputRef,
    inputIndex,
    onDone,
  }
}
