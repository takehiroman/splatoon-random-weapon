import { h, FunctionComponent } from 'preact'
type SelectBoxProps = {
  title: string
  optionList: Array<{ label: string; value: string | number }>
  onChange: (value: string) => void
  value?: string
}

export const SelectBox: FunctionComponent<SelectBoxProps> = ({
  title,
  optionList,
  onChange,
  value,
}) => {
  const onSelectChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    onChange(target.value)
  }
  return (
    <div class="flex flex-col">
      <label class="text-gray-700" for="select-box">
        {title}
      </label>
      <select
        class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        id="select-box"
        name="select-box"
        onChange={(e) => onSelectChange(e)}
        value={value}
      >
        {optionList.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
