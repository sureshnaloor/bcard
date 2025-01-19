'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ShippingInfo({ onDataChange }: { onDataChange: (data: any) => void }) {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')

  const handleChange = () => {
    onDataChange({
      shippingInfo: { address, city, state, zipCode, country },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                handleChange()
              }}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  handleChange()
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => {
                  setState(e.target.value)
                  handleChange()
                }}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value)
                  handleChange()
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value)
                  handleChange()
                }}
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

