import React, { useState } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

import type { CMSCategory } from '../../types'

const CategoriesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CMSCategory | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'furniture' as 'furniture' | 'singleLine' | 'service',
    description: '',
    isActive: true
  })

  // Mock data - replace with actual API calls
  const [categories, setCategories] = useState<CMSCategory[]>([
    {
      id: '1',
      name: 'Master Bedroom',
      type: 'furniture',
      description: 'Furniture items for master bedroom',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Kitchen',
      type: 'furniture',
      description: 'Modular kitchen and kitchen accessories',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Services',
      type: 'singleLine',
      description: 'Installation and service items',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Living Room',
      type: 'service',
      description: 'Living room furniture and accessories',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Children Bedroom',
      type: 'furniture',
      description: 'Furniture for children\'s bedroom',
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])

  const handleAddCategory = () => {
    const newCategory: CMSCategory = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCategories(prev => [newCategory, ...prev])
    setShowForm(false)
    resetForm()
  }

  const handleEditCategory = () => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...formData, id: cat.id, createdAt: cat.createdAt, updatedAt: new Date().toISOString() }
          : cat
      ))
      setEditingCategory(null)
      setShowForm(false)
      resetForm()
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
    }
  }

  const handleEdit = (category: CMSCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || '',
      isActive: category.isActive
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'furniture',
      description: '',
      isActive: true
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      handleEditCategory()
    } else {
      handleAddCategory()
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Organize your items into categories</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge 
                  variant={category.isActive ? 'success' : 'inactive'}
                  className="text-xs"
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="outline" className="capitalize">
                    {category.type}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
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
                      Category Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter category name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      required
                    >
                      <option value="furniture">Furniture</option>
                      <option value="singleLine">Single Line</option>
                      <option value="service">Service</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter category description (optional)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false)
                        setEditingCategory(null)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCategory ? 'Update Category' : 'Add Category'}
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

export default CategoriesPage 