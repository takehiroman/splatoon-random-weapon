import { h, FunctionComponent } from 'preact'
type SelectBoxProps = {
  title: string
  optionList: Array<{ label: string; value: string | number }>
  onChange: (value: string) => void
}

export const SelectBox: FunctionComponent<SelectBoxProps> = ({
  title,
  optionList,
  onChange,
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
        class="w-32 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        id="select-box"
        name="select-box"
        onChange={(e) => onSelectChange(e)}
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
