'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const products = [
  { id: 'single', name: 'Single Card', price: 9.99 },
  { id: 'triple', name: 'Triple Pack', price: 24.99 },
  { id: 'set_of_5', name: 'Set of 5', price: 39.99 },
]

const colors = ['Black', 'White', 'Silver', 'Gold']
const materials = ['Plastic', 'Metal', 'Wood']

export function ProductSelection({ onDataChange }: { onDataChange: (data: any) => void }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0].id)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0])

  const handleChange = () => {
    onDataChange({
      products: {
        type: selectedProduct,
        color: selectedColor,
        material: selectedMaterial,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your NFC Business Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RadioGroup
            defaultValue={selectedProduct}
            onValueChange={(value) => {
              setSelectedProduct(value)
              handleChange()
            }}
          >
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={product.id} id={product.id} />
                  <Label htmlFor={product.id}>{product.name} - ${product.price}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
              value={selectedColor}
              onValueChange={(value) => {
                setSelectedColor(value)
                handleChange()
              }}
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Select
              value={selectedMaterial}
              onValueChange={(value) => {
                setSelectedMaterial(value)
                handleChange()
              }}
            >
              <SelectTrigger id="material">
                <SelectValue placeholder="Select a material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

