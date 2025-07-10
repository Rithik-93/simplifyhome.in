interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-black shadow-xl border-b-4 border-yellow-400">
      <div className="w-full mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://simplifyhome.in/wp-content/uploads/2024/11/Simplify-Home-Logo-1-TM-1-1.png" 
              alt="SimplifyHomes" 
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Interior Cost Calculator
              </h1>
              <p className="text-yellow-300 text-lg font-medium">
                Get accurate estimates for your home interior design
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-400 font-semibold text-lg">simplifyhomes.in</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 