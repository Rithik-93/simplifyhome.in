# SimplifyHomes CMS Dashboard

A comprehensive Content Management System (CMS) for managing SimplifyHomes product catalog, categories, and users.

## Features

### 🏠 Dashboard
- Overview of total items and categories
- Quick access to item management
- Recent items list

### 📦 Items Management
- **CRUD Operations**: Create, Read, Update, Delete items
- **Advanced Filtering**: Filter by type, category, status
- **Search Functionality**: Search items by name or description
- **Bulk Operations**: Select multiple items for batch actions
- **Status Management**: Activate/deactivate items

### 📂 Categories Management
- **Category Organization**: Group items by categories
- **Type Classification**: Furniture, Single Line, Service types
- **Hierarchical Structure**: Support for nested categories
- **Status Control**: Enable/disable categories

### 👥 Users Management
- **Admin User Management**: Create and manage admin accounts
- **Role-based Access**: Admin and Editor roles
- **Permission Control**: Different access levels
- **User Activity Tracking**: Monitor user actions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simplifyhomes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the CMS**
   - Open your browser and navigate to `http://localhost:5173/cms`
   - The CMS will load with full functionality
   - The main app is available at `http://localhost:5173`

## Usage

### Navigation
- **Dashboard**: Overview and statistics
- **Items**: Manage product catalog
- **Categories**: Organize items into categories
- **Users**: Manage admin users

### Adding Items
1. Navigate to **Items** page
2. Click **"Add Item"** button
3. Fill in the required fields:
   - Name
   - Category
   - Type (Furniture/Single Line/Service)
   - Base Price
   - Description (optional)
4. Set status (Active/Inactive)
5. Click **"Add Item"** to save

### Managing Categories
1. Navigate to **Categories** page
2. Click **"Add Category"** button
3. Fill in:
   - Category Name
   - Type
   - Description (optional)
4. Set status
5. Click **"Add Category"** to save

### User Management
1. Navigate to **Users** page
2. Click **"Add User"** button
3. Fill in:
   - Username
   - Email
   - Role (Admin/Editor)
   - Password
4. Click **"Add User"** to save

## API Integration

The CMS is designed to work with a backend API. The API service is located in `src/services/api.ts` and includes:

### Endpoints Structure
```
/api
├── /items          # Item management
├── /categories     # Category management  
├── /users          # User management
├── /dashboard      # Dashboard data
└── /auth           # Authentication
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api
```

### API Methods
- `itemsAPI.getItems()` - Get all items
- `itemsAPI.createItem()` - Create new item
- `itemsAPI.updateItem()` - Update existing item
- `itemsAPI.deleteItem()` - Delete item
- `categoriesAPI.getCategories()` - Get all categories
- `usersAPI.getUsers()` - Get all users
- `dashboardAPI.getStats()` - Get dashboard statistics

## File Structure

```
src/
├── components/
│   ├── cms/
│   │   ├── CMSApp.tsx           # Main CMS application
│   │   ├── CMSLayout.tsx        # Layout with sidebar
│   │   ├── DashboardPage.tsx    # Dashboard overview
│   │   ├── ItemsPage.tsx        # Items management
│   │   ├── ItemForm.tsx         # Item form modal
│   │   ├── CategoriesPage.tsx   # Categories management
│   │   └── UsersPage.tsx        # Users management
│   └── ui/                      # Reusable UI components
├── services/
│   └── api.ts                   # API service layer
└── types/
    └── index.ts                 # TypeScript type definitions
```

## Customization

### Styling
The CMS uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/index.css`

### Adding New Features
1. Create new components in `src/components/cms/`
2. Add new types in `src/types/index.ts`
3. Add API methods in `src/services/api.ts`
4. Update navigation in `CMSLayout.tsx`

### Database Schema
The CMS expects the following data structure:

#### Items Table
```sql
CREATE TABLE items (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  type ENUM('furniture', 'singleLine', 'service') NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Categories Table
```sql
CREATE TABLE categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('furniture', 'singleLine', 'service') NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);
```

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

### Authentication
- Implement JWT-based authentication
- Secure password hashing (bcrypt)
- Session management
- Role-based access control

### Data Validation
- Server-side validation for all inputs
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security
- Rate limiting
- Input sanitization
- Error handling without sensitive data exposure
- HTTPS enforcement

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
1. Set production API URL
2. Configure database connection
3. Set up authentication
4. Configure CORS settings

### Hosting Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

This project is licensed under the MIT License. 