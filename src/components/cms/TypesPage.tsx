import React, { useState } from 'react'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import type { CMSType, CMSCategory, CreateTypeRequest } from '../../types'

interface TypesPageProps {
  categories: CMSCategory[]
  types: CMSType[]
  onCreateType: (type: CreateTypeRequest) => void
  onUpdateType: (id: string, type: Partial<CreateTypeRequest>) => void
  onDeleteType: (id: string) => void
}

const TypesPage: React.FC<TypesPageProps> = ({ 
  categories, 
  types, 
  onCreateType, 
  onUpdateType, 
  onDeleteType 
}) => {
  const [showForm, setShowForm] = useState(false)
  const [editingType, setEditingType] = useState<CMSType | null>(null)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Type name is required'
    }

    // Check for duplicate name
    const isDuplicate = types.some(type => 
      type.name.toLowerCase() === formData.name.toLowerCase() &&
      type.id !== editingType?.id
    )

    if (isDuplicate) {
      newErrors.name = 'Type name already exists'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      if (editingType) {
        onUpdateType(editingType.id, formData)
      } else {
        onCreateType(formData)
      }
      resetForm()
      setShowForm(false)
    }
  }

  const handleEdit = (type: CMSType) => {
    setEditingType(type)
    setFormData({
      name: type.name
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this type? All categories and items of this type will also be affected.')) {
      onDeleteType(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: ''
    })
    setEditingType(null)
    setErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getCategoriesForType = (typeId: string) => {
    if (!categories || !Array.isArray(categories)) return []
    return categories.filter(category => category.typeId === typeId)
  }

  const getItemCountForType = (typeId: string) => {
    const typeCategories = getCategoriesForType(typeId)
    return typeCategories.reduce((total, category) => total + (category.items?.length || 0), 0)
  }

  // Don't render if data is not loaded yet
  if (!types || !categories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading types...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Types Management</h1>
          <p className="text-gray-600 mt-2">Manage item types and their categories</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type) => {
          const typeCategories = getCategoriesForType(type.id)
          const itemCount = getItemCountForType(type.id)
          
          return (
            <Card key={type.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {typeCategories.length} Categories
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Items: {itemCount}
                  </div>
                  {typeCategories.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Categories: {typeCategories.map(cat => cat.name).join(', ')}
                    </div>
                  )}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(type)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(type.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {types.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No types found</p>
          </CardContent>
        </Card>
      )}

      {/* Type Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">
                  {editingType ? 'Edit Type' : 'Add New Type'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter type name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingType ? 'Update Type' : 'Add Type'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default TypesPage
