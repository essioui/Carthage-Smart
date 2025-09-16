export default function Header() {
  return (
    <header className="flex items-center justify-between p-3 bg-gray-900">
      <div>
        <img 
          src="/images/carthage.jpg" 
          alt="Carthage Logo" 
          className="w-52 h-20"
        />
      </div>
      <h1 className="text-6xl font-bold text-white absolute left-1/2 transform -translate-x-1/2 animate-pulse">
        Carthage Smart
      </h1>
    </header>
  )
}
