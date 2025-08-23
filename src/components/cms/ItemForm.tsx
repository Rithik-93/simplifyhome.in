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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    availableInRooms: [] as RoomType[],
    pricePerSqFt: 0,
    imageUrl: '',
    categoryId: ''
  })

  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<CMSCategory[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter categories based on selected type
  useEffect(() => {
    if (selectedTypeId) {
      const filtered = categories.filter(category => category.typeId === selectedTypeId)
      setFilteredCategories(filtered)
      // Reset categoryId if current selection is not in filtered categories
      if (formData.categoryId && !filtered.some(category => category.id === formData.categoryId)) {
        setFormData(prev => ({ ...prev, categoryId: '' }))
      }
    } else {
      setFilteredCategories([])
      setFormData(prev => ({ ...prev, categoryId: '' }))
    }
  }, [selectedTypeId, categories, formData.categoryId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!selectedTypeId) {
      newErrors.typeId = 'Type is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (formData.pricePerSqFt <= 0) {
      newErrors.pricePerSqFt = 'Price per sq ft must be greater than 0'
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
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean | RoomType[]) => {
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

  const roomTypeOptions = [
    { value: 'BHK_1' as RoomType, label: '1 BHK' },
    { value: 'BHK_2' as RoomType, label: '2 BHK' },
    { value: 'BHK_3' as RoomType, label: '3 BHK' },
    { value: 'BHK_4' as RoomType, label: '4 BHK' }
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
                Category *
              </label>
              <Select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className={errors.categoryId ? 'border-red-500' : ''}
                disabled={!selectedTypeId}
              >
                <option value="">Select a category</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Sq Ft (₹) *
            </label>
            <Input
              type="number"
              value={formData.pricePerSqFt}
              onChange={(e) => handleInputChange('pricePerSqFt', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.pricePerSqFt ? 'border-red-500' : ''}
            />
            {errors.pricePerSqFt && (
              <p className="text-red-500 text-sm mt-1">{errors.pricePerSqFt}</p>
            )}
          </div>

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