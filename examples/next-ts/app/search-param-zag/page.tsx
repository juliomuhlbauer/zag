"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Portal, normalizeProps, useMachine } from "@zag-js/react"
import * as select from "@zag-js/select"
import { useEffect, useId, useState } from "react"
import { COUNTRIES } from "../../countries"

export default function ZagExample() {
  const [itemsSize, setItemsSize] = useState(10)

  const items = COUNTRIES.slice(0, itemsSize - 1)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <label>Items size: {itemsSize}</label>
      <input
        type="range"
        max={COUNTRIES.length}
        value={itemsSize}
        onChange={(e) => setItemsSize(Number(e.target.value))}
      />

      <ZagSelect items={items} />
    </div>
  )
}

function ZagSelect({
  items,
}: {
  items: {
    label: string
    value: string
  }[]
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const selectedCountry = searchParams?.get("country")

  useEffect(() => {
    console.log("search param value:", selectedCountry)
  }, [selectedCountry])

  console.log("selected:", selectedCountry)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <h1>{selectedCountry}</h1>

      <Select
        items={items}
        value={selectedCountry || undefined}
        setValue={(value) => {
          router.push(`${pathname}?country=${value}`)
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              router.push(`${pathname}?country=${item.value}`)
            }}
          >
            Change to {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Select({
  items = [],
  value,
  setValue,
}: {
  items: {
    label: string
    value: string
  }[]
  value: string | undefined
  setValue: (value: string) => void
}) {
  const collection = select.collection({
    items: items,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  const [state, send] = useMachine(
    select.machine({
      id: useId(),
      collection,
      value: value ? [value] : undefined,
      onValueChange: (details) => {
        const cityValue = details.value[0]

        console.log("changed to:", cityValue)

        setValue(details.value[0])
      },
    }),
    {
      context: {
        value: value ? [value] : undefined,
      },
    },
  )

  const api = select.connect(state, send, normalizeProps)

  return (
    <div {...api.rootProps}>
      <div {...api.controlProps}>
        <label {...api.labelProps}>Label</label>
        <button {...api.triggerProps}>{api.valueAsString || "Select a city"}</button>
      </div>

      <Portal>
        <div {...api.positionerProps}>
          <ul
            {...api.contentProps}
            style={{
              backgroundColor: "white",
            }}
          >
            {items.map((item) => (
              <li key={item.value} {...api.getItemProps({ item })}>
                <span>{item.label}</span>
                <span {...api.getItemIndicatorProps({ item })}>✓</span>
              </li>
            ))}
          </ul>
        </div>
      </Portal>
    </div>
  )
}
