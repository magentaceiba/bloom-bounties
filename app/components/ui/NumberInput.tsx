import { formatAmountString } from '@/lib/utils'
import cn from 'classnames'

export default function NumberInput({
  step = 1,
  defaultValue = 1,
  min = 0,
  max = undefined,
  precision = 0,
  onChange,
  value,
  label,
  ...props
}: {
  step?: number
  defaultValue?: number
  min?: number
  precision?: number
  max?: number
  onChange: (string: string) => void
  value?: string | number
  label?: string
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onChange'
>) {
  const handleIncrement = () => {
    let newValue = (Number(value) ?? defaultValue) + step
    if (max !== undefined) newValue = Math.min(newValue, max)
    onChange(formatAmountString(newValue.toString()))
  }

  const handleDecrement = () => {
    let newValue = (Number(value) ?? defaultValue) - step
    if (min !== undefined) newValue = Math.max(newValue, min)
    onChange(formatAmountString(newValue.toString()))
  }

  props.className = cn('w-max', props?.className)

  return (
    <div {...props}>
      {!!label && (
        <>
          <h2 className="text-sm">{label}</h2>
          <hr className="my-3" />
        </>
      )}
      <div className="flex gap-3">
        <button onClick={handleDecrement} className="btn">
          -
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(formatAmountString(e.target.value))}
          className="input input-bordered"
        />
        <button onClick={handleIncrement} className="btn">
          +
        </button>
      </div>
    </div>
  )
}
