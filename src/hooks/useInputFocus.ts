'use client'

import { useAppContext } from '@/providers'
import { useRef, useEffect, useState } from 'react'

export function useInputFocus(tracker?: any) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputIndex, setInputIndex] = useState(0)
  const [isTouched, setIsTouched] = useState(false)
  const { inputsChangeCounter, getNewInputIndex, getNextInputRef } =
    useAppContext().inputFocus

  useEffect(() => {
    if (!!inputRef.current) setInputIndex(getNewInputIndex(inputRef.current))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputsChangeCounter])

  const onDone = () => {
    // Check if inputRef is the last input in the parent form
    const form = inputRef.current?.form
    if (form && !form.checkValidity()) return

    setTimeout(() => {
      getNextInputRef(inputIndex)?.focus()
    }, 0.1)
  }

  useEffect(() => {
    if (inputRef.current && tracker) {
      inputRef.current.focus()
    }
  }, [tracker])

  return {
    isTouched,
    setIsTouched,
    inputRef,
    inputIndex,
    onDone,
  }
}

export function useInputFocusHandler() {
  const [inputs, setInputs] = useState<HTMLInputElement[]>([])
  const [inputsChangeCounter, setInputsChangeCounter] = useState(0)

  const updateInputs = () => {
    if (typeof document !== 'undefined') {
      const newInputs = Array.from(
        document.querySelectorAll('input[data-inputindex]')
      )
      setInputsChangeCounter((prev) => prev + 1)
      // @ts-ignore
      setInputs(newInputs)
    }
  }

  useEffect(() => {
    // Create a MutationObserver instance to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList) => {
      let runCondition = false
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          ;(['addedNodes', 'removedNodes'] as const).map((key) => {
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
  }, [])

  const getNewInputIndex = (inputRef: HTMLInputElement) =>
    inputs.findIndex((i) => i === inputRef)

  const nonHiddenInputs = inputs.filter(
    (input) => input && input.offsetParent !== null
  )

  const getNextInputRef = (inputIndex: number) => {
    const nextIndex = nonHiddenInputs.findIndex(
      (input) => input && parseInt(input.dataset.inputindex!) > inputIndex
    )
    return nonHiddenInputs[nextIndex]
  }

  return { inputsChangeCounter, getNewInputIndex, getNextInputRef }
}
