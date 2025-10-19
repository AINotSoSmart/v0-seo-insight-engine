"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertySelectorProps {
  properties: any[]
  selectedProperty: string | null
  onSelect: (id: string) => void
}

export default function PropertySelector({ properties, selectedProperty, onSelect }: PropertySelectorProps) {
  return (
    <Select value={selectedProperty || ""} onValueChange={onSelect}>
      <SelectTrigger className="w-64 bg-slate-900 border-slate-700">
        <SelectValue placeholder="Select property" />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-700">
        {properties.map((prop) => (
          <SelectItem key={prop.id} value={prop.id.toString()}>
            {prop.property_name || prop.property_url}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
