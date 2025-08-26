import React, { useState, useEffect } from 'react'
import { Package, Edit, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import cmsApi from '../../services/cmsApi'
import type { DashboardStats, CMSItem } from '../../types'

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [allItems, setAllItems] = useState<CMSItem[]>([])

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch dashboard stats and all items in parallel
      const [statsResponse, itemsResponse] = await Promise.all([
        cmsApi.getDashboardStats(),
        cmsApi.getItems({ limit: 100 }) // Get up to 100 items
      ])
      
      setStats(statsResponse.data)
      setAllItems(itemsResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Helper function to safely format dates
  const formatDate = (dateString: string | Date): string => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total Items',
      value: stats?.totalItems?.toString() || '0',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Types',
      value: stats?.totalTypes?.toString() || '0',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Categories',
      value: stats?.totalCategories?.toString() || '0',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'BHK Coverage',
      value: `${Object.keys(stats?.itemsByRoomType || {}).length}/6`,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome to your Interior Calculator CMS dashboard</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

            {/* All Items */}
      <Card>
        <CardHeader>
          <CardTitle>All Items ({allItems.length})</CardTitle>
          <CardDescription>All items in your catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading items...</span>
            </div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Pricing Type</TableHead>
                  <TableHead>Premium Price</TableHead>
                  <TableHead>Luxury Price</TableHead>
                  <TableHead>Room Types</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allItems.map((item: CMSItem) => {
                  const isAddonItem = item.addonPricing && item.addonPricing.length > 0;
                  const hasPerSqFtPricing = item.premiumPricePerSqFt && item.luxuryPricePerSqFt;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.type?.name || item.category?.type?.name || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isAddonItem ? "secondary" : "default"}>
                          {isAddonItem ? 'Addon' : 'Per Sq Ft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isAddonItem ? (
                          <div className="text-sm">
                            {item.addonPricing?.map((pricing, index) => (
                              <div key={index} className="mb-1">
                                <span className="font-medium">{pricing.roomType.replace('BHK_', '')} BHK:</span>
                                <br />
                                <span className="text-gray-600">₹{pricing.premiumPrice.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>₹{item.premiumPricePerSqFt?.toLocaleString() || '0'}/sq ft</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isAddonItem ? (
                          <div className="text-sm">
                            {item.addonPricing?.map((pricing, index) => (
                              <div key={index} className="mb-1">
                                <span className="font-medium">{pricing.roomType.replace('BHK_', '')} BHK:</span>
                                <br />
                                <span className="text-gray-600">₹{pricing.luxuryPrice.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>₹{item.luxuryPricePerSqFt?.toLocaleString() || '0'}/sq ft</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.availableInRooms.map((rt: string) => (
                            <Badge key={rt} variant="secondary" className="text-xs">
                              {rt.replace('BHK_', '')} BHK
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage 