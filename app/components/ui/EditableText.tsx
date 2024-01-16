'use client'

import { useState } from 'react'
import { Button, Input, type InputProps } from 'react-daisyui'
import { FiEdit } from 'react-icons/fi'

type EditableInputProps = {
  label: string
  value: string
  setValue: (value: string) => void
  invalid: boolean
}

export default function EditableText({
  label,
  setValue,
  invalid,
  value,
  ...props
}: EditableInputProps &
  Omit<InputProps, 'onChange' | 'placeholder' | 'value' | 'color'>) {
  const [isEditing, setIsEditing] = useState(true)
  const [inputValue, setInputValue] = useState('')

  const toggle = () => setIsEditing((prev) => !prev)

  return (
    <>
      <div className={'w-full flex justify-between items-center mb-3'}>
        <h4>{label}</h4>
        <Button size={'xs'} color="primary" onClick={toggle}>
          {!isEditing ? <FiEdit size={20} /> : 'Done'}
        </Button>
      </div>

      {isEditing ? (
        <form className="form-control w-full" onSubmit={toggle}>
          <Input
            {...props}
            {...(invalid && { color: 'warning' })}
            value={inputValue}
            placeholder={'Type Here'}
            onChange={(e) => {
              setValue(e.target.value)
              setInputValue(e.target.value)
            }}
          />
        </form>
      ) : (
        <p>{value}</p>
      )}
    </>
  )
}
