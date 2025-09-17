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
            This system contributes to enhancing operational efficiency, improving the accuracy
            of forecasts, and facilitating strategic decision-making.
            Key objectives for management:
            Automated energy consumption monitoring: Ensure precise and reliable tracking of consumption
            with real-time analytical reports.
            Future consumption forecasting: Leverage machine learning algorithms to predict energy demand
            and plan resources in advance.
            Support proactive maintenance decisions: Use cluster-based predictions to identify critical
            points and intervene at the right time.
            Customer clustering: Facilitate the management of different areas and tailor
            strategies suitable for each customer group.
            help you plan your expenses.
        </p>
      </div>

    </div>
  )
}

export default Clients
