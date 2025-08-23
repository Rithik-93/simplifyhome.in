import React, { useState, useEffect } from 'react'
import CMSLayout from './CMSLayout'
import DashboardPage from './DashboardPage'
import ItemsPage from './ItemsPage'
import CategoriesPage from './CategoriesPage'
import TypesPage from './TypesPage'
import cmsApi from '../../services/cmsApi'
import type { CMSCategory, CMSType } from '../../types'

const CMSApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [types, setTypes] = useState<CMSType[]>([])
  const [categories, setCategories] = useState<CMSCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Load types and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [typesResponse, categoriesResponse] = await Promise.all([
          cmsApi.getTypes(),
          cmsApi.getCategories()
        ])
        
        setTypes(typesResponse.data || [])
        setCategories(categoriesResponse.data || [])
      } catch (error) {
        console.error('Error loading CMS data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Type management functions
  const handleCreateType = async (typeData: any) => {
    try {
      const response = await cmsApi.createType(typeData)
      setTypes(prev => [response.data, ...prev])
    } catch (error) {
      console.error('Error creating type:', error)
    }
  }

  const handleUpdateType = async (id: string, typeData: any) => {
    try {
      const response = await cmsApi.updateType(id, { ...typeData, id })
      setTypes(prev => prev.map(type => type.id === id ? response.data : type))
    } catch (error) {
      console.error('Error updating type:', error)
    }
  }

  const handleDeleteType = async (id: string) => {
    try {
      await cmsApi.deleteType(id)
      setTypes(prev => prev.filter(type => type.id !== id))
      // Also remove categories that belong to this type
      setCategories(prev => prev.filter(cat => cat.typeId !== id))
    } catch (error) {
      console.error('Error deleting type:', error)
    }
  }

  // Category management functions
  const handleCreateCategory = async (categoryData: any) => {
    try {
      const response = await cmsApi.createCategory(categoryData)
      setCategories(prev => [response.data, ...prev])
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleUpdateCategory = async (id: string, categoryData: any) => {
    try {
      const response = await cmsApi.updateCategory(id, { ...categoryData, id })
      setCategories(prev => prev.map(cat => cat.id === id ? response.data : cat))
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await cmsApi.deleteCategory(id)
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading CMS...</p>
        </div>
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'items':
        return <ItemsPage categories={categories} types={types} />
      case 'types':
        return (
          <TypesPage 
            categories={categories}
            types={types}
            onCreateType={handleCreateType}
            onUpdateType={handleUpdateType}
            onDeleteType={handleDeleteType}
          />
        )
      case 'categories':
        return (
          <CategoriesPage 
            categories={categories}
            types={types}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )
      default:
        return <DashboardPage />
    }
  }

  return (
    <CMSLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </CMSLayout>
  )
}

export default CMSApp