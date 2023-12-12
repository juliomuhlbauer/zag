"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Portal } from "../../ark/portal"
import { Select } from "../../ark/select"
import { COUNTRIES } from "../../countries"

export default function ArkExample() {
  const [itemsSize, setItemsSize] = useState(10)

  const items = COUNTRIES.slice(0, itemsSize)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <label>Items size: {itemsSize}</label>

      <input
        type="range"
        max={COUNTRIES.length}
        value={itemsSize}
        onChange={(e) => setItemsSize(Number(e.target.value))}
      />

      <ArkSelect items={items} />
    </div>
  )
}

function ArkSelect({ items }: { items: { label: string; value: string }[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const selectedCountry = searchParams?.get("country")

  useEffect(() => {
    console.log("search param value:", selectedCountry)
  }, [selectedCountry])

  console.log(selectedCountry)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <h1>Search Param with Ark</h1>

      <h1>{selectedCountry}</h1>

      <Select.Root
        items={items}
        value={selectedCountry ? [selectedCountry] : []}
        onValueChange={(details) => {
          router.push(`${pathname}?country=${details.value[0]}`)
        }}
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a city" />
          </Select.Trigger>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content style={{ backgroundColor: "white" }}>
              <Select.ItemGroup id="city">
                {items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

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
