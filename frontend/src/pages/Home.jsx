import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='mx-auto py-14 px-4"'>
      <div className="flex justify-center items-start">
        <p className="text-center max-w-6xl">
          Towards a smart and better future, our application aims to transform
          energy consumption into an innovative digital experience that combines
          smart billing, consumption forecasting, and data analytics, providing
          customers with greater transparency and giving management strategic
          insights to improve efficiency and reduce costs. <br />
          The project aims to create and operate an intelligent system for managing
          and billing energy consumption through an interactive web application. <br />
          The smart billing application is not just a billing system, but a comprehensive
          energy management platform that leverages artificial intelligence and machine
          learning to provide a holistic and accurate view of customer consumption.
        </p>
      </div>

      <div className="flex items-center justify-between max-w-xl mx-auto py-20 px-4">

        <Link
          to="clients"
          className="w-60 px-16 py-4 bg-gray-500 text-white rounded hover:bg-gray-950 transition"
        >
          <b>Clients</b>
        </Link>

        <h3 className="text-2xl font-bold text-center flex-shrink-0 px-2 flex items-center gap-2">
          <span className="animate-moveX text-gray-600">&lt;&lt;&lt;</span>
          Are you
          <span className="animate-moveX text-gray-600">&gt;&gt;&gt;</span>
        </h3>

        <Link
          to="admins"
          className="w-60 px-16 py-4 bg-gray-500 text-white rounded hover:bg-gray-950 transition"
        >
          <b>Admins</b>
        </Link>
      </div>
    </div>
  )
}

export default Home
