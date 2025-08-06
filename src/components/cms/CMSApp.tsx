import React, { useState } from 'react'
import CMSLayout from './CMSLayout'
import DashboardPage from './DashboardPage'
import ItemsPage from './ItemsPage'
import CategoriesPage from './CategoriesPage'

const CMSApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'items':
        return <ItemsPage />
      case 'categories':
        return <CategoriesPage />
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