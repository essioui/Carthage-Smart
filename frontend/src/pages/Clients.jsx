import { Link } from 'react-router-dom'

function Clients() {
  return (
    <div className="my-[20px] mx-[40px]">
      
      <div className="flex w-full max-w-xl mx-auto">
        <Link 
        to="register"
          className="w-1/2 text-center py-2 hover:bg-gray-950 transition"
        >
          Register
        </Link>

        <Link
        to="login"
          className="w-1/2 text-center py-2 hover:bg-gray-950 transition"
        >
          Login
        </Link>
      </div>

      <div className="mt-[20px]">
        <p className="text-center max-w-2xl mx-auto">
          The smart energy management and billing application allows you to easily
          and transparently track your consumption, with the option to log in either
          through the traditional method (username + password) or using facial recognition
          for enhanced security and convenience. <br />
          Through a simple and user-friendly interface, you can: <br />
          - View your daily or monthly consumption at any time. <br />
          - Receive accurate forecasts of your future consumption to
            help you plan your expenses.
        </p>
      </div>

    </div>
  )
}

export default Clients
