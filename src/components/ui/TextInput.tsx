'use client'

import { useInputFocus } from '@/hooks'
import { Input, type InputProps } from 'react-daisyui'
import cn from 'classnames'

import { z } from 'zod'
import { isAddress } from 'viem'

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
  const { inputRef, inputIndex, onDone, isTouched, setIsTouched } =
    useInputFocus()

  const setValidity = (msg: string) => {
    inputRef.current!.setCustomValidity(msg)
  }

  const scanValidity = () => {
    let valid = true
    if (!!inputRef.current) {
      const value = inputRef.current.value
      switch (props.type) {
        case 'url':
          valid = z.string().url().safeParse(value).success
          setValidity(valid ? '' : 'Invalid URL')
          break
        case 'email':
          valid = z.string().email().safeParse(value).success
          setValidity(valid ? '' : 'Invalid Email')
          break
        case 'address':
          valid = isAddress(value)
          setValidity(valid ? '' : 'Invalid Address')
          break
        default:
          valid = inputRef.current.validity.valid
          break
      }
    }

    return valid
  }

  const isInvalid = invalid || !scanValidity()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTouched) setIsTouched(true)
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onDone()
    }
  }

  return (
    <>
      <label className={cn('label', !label && 'hidden')}>
        <span className="label-text">{label}</span>
      </label>

      <Input
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder ?? 'Type Here'}
        onChange={handleChange}
        ref={inputRef}
        data-inputindex={inputIndex}
        {...(isTouched && isInvalid && { color: 'warning' })}
        {...props}
      />
    </>
  )
}

export default TextInput
