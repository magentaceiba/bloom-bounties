'use client'

import { useAppContext } from '@/providers'
import { useRef, useEffect, useState } from 'react'

export function useInputFocus() {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputIndex = useRef(0)
  const [isTouched, setIsTouched] = useState(false)
  const { getNewInputIndex, getNextInputRef } = useAppContext().inputFocus

  if (!!inputRef.current) {
    const newInputIndex = getNewInputIndex(inputRef.current)
    if (!!newInputIndex) inputIndex.current = newInputIndex
  }

  const onDone = () => {
    // Check if inputRef is the last input in the parent form
    const form = inputRef.current?.form
    if (form && !form.checkValidity()) return

    setTimeout(() => {
      getNextInputRef(inputIndex.current)?.focus()
    }, 0.1)
  }

  return {
    isTouched,
    setIsTouched,
    inputRef,
    inputIndex,
    onDone,
  }
}

export function useInputFocusHandler() {
  const [inputs, setInputs] = useState<HTMLInputElement[] | null>(null)

  const updateInputs = () => {
    const newInputs = Array.from(
      document.querySelectorAll('input[data-inputindex]')
    ) as HTMLInputElement[]
    setInputs(newInputs)
  }

  useEffect(() => {
    // Create a MutationObserver instance to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList) => {
      let runCondition = false
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList')
          (['addedNodes', 'removedNodes'] as const).forEach((key) => {
            Array.from(mutation[key]).forEach((node) => {
              if (
                node instanceof HTMLElement &&
                node.querySelector('input[data-inputindex]')
              ) {
                runCondition = true
              }
            })
          })
      }

      if (runCondition) updateInputs()
    })

    // Start observing the document with the configured parameters
    observer.observe(document, {
      childList: true,
      subtree: true,
    })

    updateInputs()

    // Clean up: disconnect the observer when the component is unmounted
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof document])

  const getNewInputIndex = (inputRef: HTMLInputElement) =>
    inputs?.findIndex((i) => i === inputRef)

  const getNextInputRef = (inputIndex: number) => {
    const nonHiddenInputs = inputs?.filter(
        (input) => input.offsetParent !== null
      ),
      nextIndex = nonHiddenInputs?.findIndex(
        (input) => input && parseInt(input.dataset.inputindex!) > inputIndex
      )

    if (!nextIndex) return undefined

    return nonHiddenInputs?.[nextIndex]
  }

  return { getNewInputIndex, getNextInputRef }
}
