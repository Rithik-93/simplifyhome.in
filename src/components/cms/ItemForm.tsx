import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import type { CMSCategory, CMSType, RoomType, CreateItemRequest } from '../../types'

interface ItemFormProps {
  categories: CMSCategory[]
  types: CMSType[]
  onSubmit: (item: CreateItemRequest) => void
  onCancel: () => void
}

const ItemForm: React.FC<ItemFormProps> = ({ categories, types, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateItemRequest>({
    name: '',
    description: '',
    availableInRooms: [],
    premiumPricePerSqFt: null,
    luxuryPricePerSqFt: null,
    imageUrl: '',
    categoryId: null,
    typeId: '',
    addonPricing: []
  });

  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<CMSCategory[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isAddonItem, setIsAddonItem] = useState(false)

  useEffect(() => {
    if (selectedTypeId) {
      const filtered = categories.filter(category => category.typeId === selectedTypeId)
      setFilteredCategories(filtered)
      // Reset categoryId if current selection is not in filtered categories
      if (formData.categoryId && !filtered.some(category => category.id === formData.categoryId)) {
        setFormData(prev => ({ ...prev, categoryId: null }))
      }
    } else {
      setFilteredCategories([])
      setFormData(prev => ({ ...prev, categoryId: null }))
    }
  }, [selectedTypeId, categories, formData.categoryId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.name.trim() === '') {
      newErrors.name = 'Item name is required'
    }

    if (!formData.typeId) {
      newErrors.typeId = 'Type is required'
    }

    if (isAddonItem) {
      // For addon items, validate addon pricing
      if (!formData.addonPricing || formData.addonPricing.length === 0) {
        newErrors.addonPricing = 'Addon pricing is required for addon items'
      } else {
        // Validate each addon pricing entry
        formData.addonPricing.forEach((pricing, index) => {
          if (pricing.premiumPrice <= 0) {
            newErrors[`addonPricing.${index}.premiumPrice`] = 'Premium price must be greater than 0'
          }
          if (pricing.luxuryPrice <= 0) {
            newErrors[`addonPricing.${index}.luxuryPrice`] = 'Luxury price must be greater than 0'
          }
        })
      }
    } else {
      // For regular items, validate per sq ft pricing
      if (!formData.premiumPricePerSqFt || formData.premiumPricePerSqFt <= 0) {
        newErrors.premiumPricePerSqFt = 'Premium price must be greater than 0'
      }
      if (!formData.luxuryPricePerSqFt || formData.luxuryPricePerSqFt <= 0) {
        newErrors.luxuryPricePerSqFt = 'Luxury price must be greater than 0'
      }
    }

    if (formData.availableInRooms.length === 0) {
      newErrors.availableInRooms = 'At least one room type must be selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Clean up form data based on item type
      const submitData = { ...formData }
      if (isAddonItem) {
        submitData.premiumPricePerSqFt = null
        submitData.luxuryPricePerSqFt = null
      } else {
        submitData.addonPricing = []
      }
      onSubmit(submitData)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean | RoomType[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleRoomTypeChange = (roomType: RoomType, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        availableInRooms: [...prev.availableInRooms, roomType]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        availableInRooms: prev.availableInRooms.filter(rt => rt !== roomType)
      }))
    }
    
    // Clear error when user makes selection
    if (errors.availableInRooms) {
      setErrors(prev => ({ ...prev, availableInRooms: '' }))
    }
  }

  const handleAddonPricingChange = (index: number, field: string, value: number | RoomType) => {
    setFormData(prev => ({
      ...prev,
      addonPricing: prev.addonPricing?.map((pricing, i) => 
        i === index ? { ...pricing, [field]: value } : pricing
      ) || []
    }))
    
    // Clear error when user starts typing
    const errorKey = `addonPricing.${index}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }))
    }
  }

  const addAddonPricing = () => {
    setFormData(prev => ({
      ...prev,
      addonPricing: [...(prev.addonPricing || []), {
        roomType: 'BHK_1',
        premiumPrice: 0,
        luxuryPrice: 0
      }]
    }))
  }

  const removeAddonPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addonPricing: prev.addonPricing?.filter((_, i) => i !== index) || []
    }))
  }

  const roomTypeOptions = [
    { value: 'BHK_1' as RoomType, label: '1 BHK' },
    { value: 'BHK_2' as RoomType, label: '2 BHK' },
    { value: 'BHK_3' as RoomType, label: '3 BHK' },
    { value: 'BHK_4' as RoomType, label: '4 BHK' },
    { value: 'BHK_5' as RoomType, label: '5 BHK' },
    { value: 'BHK_6' as RoomType, label: '6 BHK' }
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">
          Add New Item
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter item name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="Enter image URL (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <Select
                value={selectedTypeId}
                onChange={(e) => {
                  setSelectedTypeId(e.target.value)
                  handleInputChange('typeId', e.target.value)
                  if (errors.typeId) {
                    setErrors(prev => ({ ...prev, typeId: '' }))
                  }
                }}
                className={errors.typeId ? 'border-red-500' : ''}
              >
                <option value="">Select a type</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Select>
              {errors.typeId && (
                <p className="text-red-500 text-sm mt-1">{errors.typeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <Select
                value={formData.categoryId || ''}
                onChange={(e) => handleInputChange('categoryId', e.target.value || null)}
                className={errors.categoryId ? 'border-red-500' : ''}
                disabled={!selectedTypeId}
              >
                <option value="">Select a category (optional)</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>
          </div>

          {/* Item Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Item Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!isAddonItem}
                  onChange={() => setIsAddonItem(false)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Regular Item (Per Sq Ft Pricing)
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={isAddonItem}
                  onChange={() => setIsAddonItem(true)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Addon Item (Fixed Pricing)
                </span>
              </label>
            </div>
          </div>

          {/* Conditional Pricing Fields */}
          {!isAddonItem ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Premium Price per Sq Ft (₹) *
                </label>
                <Input
                  type="number"
                  value={formData.premiumPricePerSqFt || ''}
                  onChange={(e) => handleInputChange('premiumPricePerSqFt', parseFloat(e.target.value) || null)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.premiumPricePerSqFt ? 'border-red-500' : ''}
                />
                {errors.premiumPricePerSqFt && (
                  <p className="text-red-500 text-sm mt-1">{errors.premiumPricePerSqFt}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Luxury Price per Sq Ft (₹) *
                </label>
                <Input
                  type="number"
                  value={formData.luxuryPricePerSqFt || ''}
                  onChange={(e) => handleInputChange('luxuryPricePerSqFt', parseFloat(e.target.value) || null)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.luxuryPricePerSqFt ? 'border-red-500' : ''}
                />
                {errors.luxuryPricePerSqFt && (
                  <p className="text-red-500 text-sm mt-1">{errors.luxuryPricePerSqFt}</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Addon Pricing *
              </label>
              {formData.addonPricing && formData.addonPricing.length > 0 && (
                <div className="space-y-3">
                  {formData.addonPricing.map((pricing, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                      <div className="flex items-center space-x-4">
                        <Select
                          value={pricing.roomType}
                          onChange={(e) => handleAddonPricingChange(index, 'roomType', e.target.value as RoomType)}
                        >
                          {roomTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Select>
                        <span className="text-sm font-medium text-gray-700">Premium:</span>
                        <Input
                          type="number"
                          value={pricing.premiumPrice || ''}
                          onChange={(e) => handleAddonPricingChange(index, 'premiumPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-24 ${errors[`addonPricing.${index}.premiumPrice`] ? 'border-red-500' : ''}`}
                        />
                        <span className="text-sm font-medium text-gray-700">Luxury:</span>
                        <Input
                          type="number"
                          value={pricing.luxuryPrice || ''}
                          onChange={(e) => handleAddonPricingChange(index, 'luxuryPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-24 ${errors[`addonPricing.${index}.luxuryPrice`] ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddonPricing(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddonPricing}
                className="mt-3"
              >
                Add Addon Pricing
              </Button>
              {errors.addonPricing && (
                <p className="text-red-500 text-sm mt-1">{errors.addonPricing}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter item description (optional)"
              rows={3}
            />
          </div>

          {/* Available Room Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available in Room Types *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roomTypeOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availableInRooms.includes(option.value)}
                    onChange={(e) => handleRoomTypeChange(option.value, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.availableInRooms && (
              <p className="text-red-500 text-sm mt-1">{errors.availableInRooms}</p>
            )}
          </div>



          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Item
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ItemForm 