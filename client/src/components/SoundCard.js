

const SoundCard = (props) => {
  return (
    <div className="bg-gray-100 shadow overflow-hidden sm:rounded-lg border-2">
      <div className="flex items-start py-4 rounded sm:px-4 lg:flex-row sm:flex-col">
        <table className="table-fixed w-11/12 sm:flex-col">
          <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-200">
            <tr>
              <th className="w-5/12 p-2 whitespace-nowrap">
                <div claclassNamess="font-semibold text-left">Name</div>
              </th>
              <th className="w-1/12 p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Link</div>
              </th>
              <th className="w-1/12 p-2 whitespace-nowrap">
                <div className="font-semibold text-center">License</div>
              </th>
              <th className="w-2/12 p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Duration</div>
              </th>
              <th className="w-1/12 p-2 whitespace-nowrap">
                <div className="font-semibold text-center">ID</div>
              </th>
              <th className="w-3/12 p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Waveform</div>
              </th>
              <th className="w-5/12 p-2 whitespace-nowrap">
                <div className="font-semibold text-center">Audio</div>
              </th>
            </tr>
          </thead>
          <tbody className="text-s divide-y divide-gray-100">
            <tr>
              <td className="p-2 break-words whitespace-nowrap overflow-hidden overflow-ellipsis">
                <div className="flex items-center">
                  <div className="font-bold text-gray-800">{props.sound.name}</div>
                </div>
              </td>
              <td className="p-2 whitespace-nowrap items-center">
                <a className="cursor-pointer" href={props.sound.url} target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </td>
              <td className="p-2 whitespace-nowrap items-center">
                <a className="cursor-pointer" href={props.sound.license} target="_blank">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </a>
              </td>
              <td className="p-2 whitespace-nowrap">
                <div className="text-center">{props.sound.duration}s</div>
              </td>
              <td className="p-2 whitespace-nowrap">
                <div className="text-center font-medium text-green-500">{props.sound.id}</div>
              </td>
              <td className="p-2 whitespace-nowrap content-center object-contain">
                <img className="rounded-lg mx-auto" src={props.sound.image}/>
              </td>
              <td className="p-2 whitespace-nowrap object-contain">
                <audio
                  className="mx-auto"
                  controls
                >
                  <source src={props.sound.mp3link} type="audio/mpeg"/>
                  Your browser does not support the audio element.
                </audio> 
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-sm flex w-40 pl-4">
          <table className="mx-auto">
            <tr>
              <button className="w-full bg-yellow-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div className="text-right">
                  Get New
                </div>
              </button>
            </tr>
            <br/>
            <tr>
              <button
                onClick={() => props.delete(props.sound.id)}
                className="w-full bg-red-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div className="text-right">
                  Remove
                </div>
              </button>
            </tr>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SoundCard