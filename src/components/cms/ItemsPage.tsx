import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import type { CMSItem } from '../../types'
import ItemForm from './ItemForm'
import cmsApi from '../../services/cmsApi'

// Helper function to safely format dates
const formatDate = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

const ItemsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<CMSItem[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Load items from API
  const loadItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      }
      
      if (searchTerm) params.search = searchTerm
      if (filterType !== 'all') params.type = filterType
      if (filterCategory !== 'all') params.category = filterCategory
      
      const response = await cmsApi.getItems(params)
      
      setItems(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items')
      console.error('Error loading items:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load items on component mount and when filters change
  useEffect(() => {
    loadItems()
  }, [pagination.page, searchTerm, filterType, filterCategory])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        loadItems()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const categories = ['Master Bedroom', 'Kitchen', 'Services', 'Living Room', 'Children Bedroom', 'Guest Bedroom', 'Pooja Room']

  const handleAddItem = async (newItem: Omit<CMSItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await cmsApi.createItem(newItem)
      setItems(prev => [response.data, ...prev])
      setShowForm(false)
      // Show success message (you can add a toast notification here)
    } catch (err) {
      console.error('Error creating item:', err)
      // Show error message (you can add a toast notification here)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await cmsApi.deleteItem(id)
        setItems(prev => prev.filter(item => item.id !== id))
        // Show success message
      } catch (err) {
        console.error('Error deleting item:', err)
        // Show error message
      }
    }
  }



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog and services</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="furniture">Furniture</option>
              <option value="singleLine">Single Line</option>
              <option value="service">Service</option>
            </Select>
            
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({pagination.total})</CardTitle>
          <CardDescription>Manage your product catalog and services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading items...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{item.basePrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.isActive ? 'success' : 'inactive'}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
                              </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

      {/* Item Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ItemForm
              categories={categories}
              onSubmit={handleAddItem}
              onCancel={() => {
                setShowForm(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemsPage 