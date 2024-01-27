'use client'

import { useInputFocus } from '@/hooks/useInputFocus'
import { useState } from 'react'
import { Button, Input, type InputProps } from 'react-daisyui'
import { FiEdit } from 'react-icons/fi'

type EditableInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  initialIsEditing?: boolean
}

export default function EditableText({
  label,
  onChange,
  value,
  invalid = false,
  initialIsEditing = true,
  ...props
}: EditableInputProps &
  Omit<InputProps, 'onChange' | 'placeholder' | 'value' | 'color'>) {
  const [isEditing, setIsEditing] = useState(initialIsEditing)
  const [inputValue, setInputValue] = useState('')
  const { inputRef, inputIndex, onDone } = useInputFocus(isEditing)

  const toggle = () => {
    if (isEditing && !invalid) {
      setIsEditing(false)
      onDone()
    } else {
      setIsEditing(true)
    }
  }

  return (
    <>
      <div className={'w-full flex justify-between items-center mb-3'}>
        <h3>{label}</h3>
        <Button size={'sm'} variant="outline" onClick={toggle} tabIndex={-1}>
          {!isEditing ? <FiEdit size={20} /> : 'Done'}
        </Button>
      </div>

      {isEditing ? (
        <form
          className="form-control w-full"
          onSubmit={(e) => {
            e.preventDefault()
            toggle()
          }}
        >
          <Input
            {...props}
            {...(invalid && { color: 'warning' })}
            value={inputValue}
            placeholder={'Type Here'}
            onChange={(e) => {
              onChange(e.target.value)
              setInputValue(e.target.value)
            }}
            ref={inputRef}
            data-index={inputIndex}
          />
        </form>
      ) : (
        <p>{value}</p>
      )}
    </>
  )
}
