import React, { useState } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

import type { CMSCategory, CMSType, CreateCategoryRequest } from '../../types'

interface CategoriesPageProps {
  categories?: CMSCategory[]
  types: CMSType[]
  onCreateCategory?: (category: CreateCategoryRequest) => void
  onUpdateCategory?: (id: string, category: Partial<CreateCategoryRequest>) => void
  onDeleteCategory?: (id: string) => void
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories: propCategories = [],
  types,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CMSCategory | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    typeId: ''
  })

  // Use prop categories or fallback to mock data
  const [categories, setCategories] = useState<CMSCategory[]>(propCategories.length > 0 ? propCategories : [])

  const handleAddCategory = () => {
    if (onCreateCategory) {
      onCreateCategory(formData)
    } else {
      // Fallback for local state
      const newCategory: CMSCategory = {
        id: Date.now().toString(),
        name: formData.name,
        typeId: formData.typeId,
        type: types.find(t => t.id === formData.typeId) as CMSType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setCategories(prev => [newCategory, ...prev])
    }
    setShowForm(false)
    resetForm()
  }

  const handleEditCategory = () => {
    if (editingCategory) {
      if (onUpdateCategory) {
        onUpdateCategory(editingCategory.id, formData)
      } else {
        // Fallback for local state
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? { 
                ...cat, 
                ...formData, 
                type: types.find(t => t.id === formData.typeId) as CMSType,
                updatedAt: new Date().toISOString() 
              }
            : cat
        ))
      }
      setEditingCategory(null)
      setShowForm(false)
      resetForm()
    }
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category? All types and items in this category will also be affected.')) {
      if (onDeleteCategory) {
        onDeleteCategory(id)
      } else {
        // Fallback for local state
        setCategories(prev => prev.filter(cat => cat.id !== id))
      }
    }
  }

  const handleEdit = (category: CMSCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      typeId: category.typeId
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      typeId: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name.trim()) {
      alert('Please enter a category name')
      return
    }
    
    if (!formData.typeId) {
      alert('Please select a type')
      return
    }
    
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
        <Button 
          onClick={() => setShowForm(true)} 
          disabled={types.length === 0}
          title={types.length === 0 ? 'No types available. Please create a type first.' : ''}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {types.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>No types available.</strong> Please create a type first before adding categories.
          </p>
        </div>
      )}

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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Type: {category.type?.name || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">
                  Items: {category.items?.length || 0}
                </div>
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

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            {types.length === 0 ? (
              <div>
                <p className="text-gray-500 mb-2">No categories found</p>
                <p className="text-sm text-gray-400">Create a type first, then add categories</p>
              </div>
            ) : (
              <p className="text-gray-500">No categories found</p>
            )}
          </CardContent>
        </Card>
      )}

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
                    <select
                      value={formData.typeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, typeId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a type</option>
                      {types.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
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