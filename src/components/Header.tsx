interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-black shadow-xl border-b-4 border-yellow-400 w-full overflow-x-hidden">
      <div className="w-full max-w-full mx-auto px-3 sm:px-5 py-3 sm:py-4 lg:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Interior Cost Calculator
              </h1>
              <p className="text-yellow-300 text-sm sm:text-base lg:text-lg font-medium leading-tight">
                Get accurate estimates for your home interior design
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 