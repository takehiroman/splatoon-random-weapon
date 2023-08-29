import { h, FunctionComponent } from 'preact'
type SelectBoxProps = {
  title: string
  optionList: Array<{ label: string; value: string | number }>
  onChange?: (e: any) => void
}

export const SelectBox: FunctionComponent<SelectBoxProps> = ({
  title,
  optionList,
  onChange,
}) => {
  return (
    <div class="flex flex-col">
      <label class="text-gray-700" for="select-box">
        {title}
      </label>
      <select
        class="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
        id="select-box"
        name="select-box"
        onChange={onChange && ((e) => onChange(e))}
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
