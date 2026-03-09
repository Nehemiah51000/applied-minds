import * as React from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

type CategoryOption = { label: string; value: string }

interface ICategoryComboboxProps {
  options: CategoryOption[];
  value?: CategoryOption | null
  onValueChange?: (value: CategoryOption | null) => void
}

export function CategoryCombobox({
  options,
  value,
  onValueChange,
}: ICategoryComboboxProps) {
  type Option = CategoryOption

  return (
    <Combobox
      items={options}
      value={(value ?? null) as unknown as Option | null}
      onValueChange={onValueChange as unknown as
        | ((value: unknown) => void)
        | undefined}
      itemToStringValue={(option) => (option as Option).label}
    >
      <ComboboxInput placeholder='Select a category' />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(option) => {
            const o = option as Option
            return (
              <ComboboxItem key={o.value} value={o}>
                {o.label}
            </ComboboxItem>
            )
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
