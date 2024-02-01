'use client'

import { useInputFocus } from '@/hooks/useInputFocus'
import { formatAmountString } from '@/lib/utils'
import cn from 'classnames'
import { Input, type InputProps } from 'react-daisyui'

import { z } from 'zod'

export default function NumberInput({
  onChange,
  label,
  invalid = false,
  ...props
}: {
  onChange: (string: string) => void
  label?: string
  invalid?: boolean
} & Omit<InputProps, 'onChange' | 'color' | 'type' | 'inputMode'>) {
  const minNumber = Number(props.min)
  const maxNumber = Number(props.max)
  const stepNumber = Number(props.step)

  const { inputRef, inputIndex, onDone, isTouched, setIsTouched } =
    useInputFocus()

  const handleIncrementOrDecrement = (inc?: boolean) => {
    let newValue =
      Number(inputRef.current?.value) + (!!inc ? stepNumber : -stepNumber)
    const newString = formatAmountString(newValue.toString())

    if (!!inputRef.current) inputRef.current.value = newString
    onChange(newString)
    if (!isTouched) setIsTouched(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatAmountString(e.target.value))
    if (!isTouched) setIsTouched(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onDone()
    }
  }

  const setValidity = (msg: string) => {
    inputRef.current!.setCustomValidity(msg)
  }

  const scanValidity = () => {
    let valid = true
    let validityMessage = ''

    if (!!inputRef.current) {
      const value = Number(inputRef.current.value)

      try {
        z.number()
          .min(minNumber, `Must be at least ${minNumber}`)
          .max(maxNumber, `Must be at most ${maxNumber}`)
          .parse(value)

        validityMessage = ''
      } catch (e: any) {
        valid = false
        if (e instanceof z.ZodError) {
          validityMessage = e.errors[0]?.message
        }
      }

      setValidity(validityMessage)
    }

    return valid
  }

  const isInvalid = invalid || !scanValidity()

  return (
    <>
      <label className={cn('label', !label && 'hidden')}>
        <span className="label-text">{label}</span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            handleIncrementOrDecrement(false)
          }}
          className="btn"
          tabIndex={-1}
        >
          -
        </button>

        <Input
          className="w-full"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          type="number"
          inputMode="decimal"
          onChange={handleChange}
          data-inputindex={inputIndex}
          {...(isTouched && isInvalid && { color: 'warning' })}
          {...props}
        />

        <button
          type="button"
          onClick={() => {
            handleIncrementOrDecrement(true)
          }}
          className="btn"
          tabIndex={-1}
        >
          +
        </button>
      </div>
    </>
  )
}
