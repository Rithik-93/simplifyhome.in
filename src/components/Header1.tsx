interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-black shadow-xl border-b-4 border-yellow-400 w-full overflow-x-hidden">
      <div className="w-full max-w-full mx-auto px-3 sm:px-5 py-3 sm:py-4 lg:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <img 
              src="https://simplifyhome.in/wp-content/uploads/2024/11/Simplify-Home-Logo-1-TM-1-1.png" 
              alt="SimplifyHomes" 
              className="h-8 sm:h-10 lg:h-11 w-auto flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white leading-tight truncate">
                Interior Cost Calculator
              </h1>
              <p className="text-yellow-300 text-xs sm:text-sm lg:text-sm font-medium leading-tight hidden sm:block truncate">
                Get accurate estimates for your home interior design
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-yellow-400 font-semibold text-xs sm:text-sm lg:text-sm">
              <span className="hidden sm:inline">simplifyhomes.in</span>
              <span className="sm:hidden">simplifyhomes</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 