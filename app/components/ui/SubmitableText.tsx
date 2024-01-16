'use client'

import { useState } from 'react'
import { Button, Input, type InputProps } from 'react-daisyui'
import { BsCopy } from 'react-icons/bs'

type EditableInputProps = {
  variant: 'Add' | 'Edit'
  header: string
  label?: string
  data?: string
  setValue: (value: string) => void
  onSubmit: () => void
  invalid: boolean
  isPending?: boolean
  buttonLabel?: string
  defaultIsEditing?: boolean
}

export default function SubmitableText({
  label,
  header,
  data,
  setValue,
  onSubmit,
  variant,
  invalid,
  isPending,
  buttonLabel,
  defaultIsEditing,
  ...props
}: EditableInputProps &
  Omit<
    InputProps,
    'onChange' | 'placeholder' | 'value' | 'onSubmit' | 'color'
  >) {
  const [isEditing, setIsEditing] = useState(defaultIsEditing ?? false)
  const [inputValue, setInputValue] = useState('')

  const toggle = () => setIsEditing((prev) => !prev)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
    toggle()
  }

  const Toggler = () => (
    <Button size={'sm'} color="primary" onClick={toggle} loading={isPending}>
      {!isEditing ? (!data ? 'Add' : buttonLabel ?? variant) : 'Cancel'}
    </Button>
  )

  return (
    <>
      <div className={'w-full flex justify-between items-center'}>
        <h4>{header}</h4>
        <Toggler />
      </div>

      {isEditing && (
        <form className="form-control w-full" onSubmit={handleSubmit}>
          {!!label && (
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
          )}
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

          <Button
            className="mt-3"
            size={'sm'}
            color="primary"
            type="submit"
            disabled={invalid}
          >
            Submit
          </Button>
        </form>
      )}

      {variant === 'Edit' && !isEditing && !!data && (
        <div className={'flex w-full gap-3 items-center'}>
          <p>{data}</p>
          <Button
            variant="outline"
            size={'sm'}
            onClick={() => navigator.clipboard.writeText(data)}
          >
            <BsCopy />
          </Button>
        </div>
      )}
    </>
  )
}
