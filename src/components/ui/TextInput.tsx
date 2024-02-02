'use client'

import { Input, type InputProps } from 'react-daisyui'
import cn from 'classnames'

import { isAddress } from 'viem'
import { useState, useRef } from 'react'
import { useIsHydrated } from '@/hooks'

export type TextInputProps = {
  onChange: (value: string) => void
  invalid?: boolean
  label?: string
} & Omit<InputProps, 'onChange' | 'color'>

const TextInput = ({
  onChange,
  label,
  invalid = false,
  ...props
}: TextInputProps) => {
  const [isTouched, setIsTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useIsHydrated()

  const setValidity = (msg: string) => {
    inputRef.current!.setCustomValidity(msg)
  }

  const scanValidity = () => {
    let valid = inputRef.current?.validity.valid ?? true

    if (isHydrated) return valid

    if (!!inputRef.current) {
      let validityMessage = ''
      const value = inputRef.current.value
      switch (props.type) {
        case 'address':
          valid = isAddress(value)
          if (!valid) setValidity('Invalid Address')
          break
      }

      inputRef.current.setCustomValidity(validityMessage)
    }

    return valid
  }

  const isInvalid = invalid || !scanValidity()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTouched) setIsTouched(true)
    onChange(e.target.value)
  }

  return (
    <>
      <label className={cn('label', !label && 'hidden')}>
        <span className="label-text">{label}</span>
      </label>

      <Input
        // onKeyDown={handleKeyDown}
        placeholder={props.placeholder ?? 'Type Here'}
        onChange={handleChange}
        ref={inputRef}
        // data-inputindex={inputIndex}
        {...(isTouched && isInvalid && { color: 'warning' })}
        {...props}
      />
    </>
  )
}

export default TextInput
