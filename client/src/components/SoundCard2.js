
const SoundCard2 = (props) => {
  return(
    <div className="mb-10 mx-4">
      <div className="bg-gray-100 opacity-80 scale-80 transition duration-400 transform hover:opacity-100 hover:scale-110 ease-in-out rounded-lg shadow-xl break-inside inline-flex flex-col w-full">
        {/* Header */}
        <header className="bg-gray-200 rounded-t-lg px-2 py-3 w-auto align-middle flex-wrap inline-block flex-row overflow-hidden whitespace-nowrap overflow-ellipsis">
          <div className="float-right inline-flex">
            <div className="px-2">
              <a
                onClick={() => {console.log('clicked refresh')}}
                className="bg-gray-400 transition duration-300 ease-in-out transform hover:translate-y-1 hover:bg-blue-500 p-2 font-semibold text-white inline-flex space-x-2 rounded cursor-pointer"
                href={props.sound.url}
                target="_blank"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="px-2">
              <button
                onClick={() => {console.log('clicked refresh')}}
                className="bg-gray-400 transition duration-300 ease-in-out transform hover:translate-y-1 hover:bg-yellow-500 p-2 font-semibold text-white inline-flex space-x-2 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="px-2">
              <button
                onClick={() => props.delete(props.sound.id)}
                className="bg-gray-400 transition duration-300 ease-in-out transform hover:translate-y-1 hover:bg-red-500 p-2 font-semibold text-white inline-flex space-x-2 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="float-left pl-6 w-full overflow-hidden flex-row">
            <span className="font-bold text-2xl inline-block">
              {props.sound.name.substr(0, 45)}
              {props.sound.name.length >= 45 && "..."}
            </span>
            <div className="font-medium text-green-500">
              {props.sound.id}
            </div>
          </div>
        </header>
        {/* Content */}
        <div className="py-5 px-8 inline-flex flex-col md:flex-row w-full">
          <div className="p-2 content-left">
            <img className="rounded-lg mx-auto" src={props.sound.image}/>
          </div>
          <div className="inline-grid my-auto">
            <div className="inline-flex">
              <div className="mr-1 font-semibold uppercase text-gray-400 align-baseline">Duration:</div>
              <div>{props.sound.duration}s</div>
            </div>
            <div className="inline-flex">
              <div className="mr-1 font-semibold uppercase text-gray-400 align-baseline">License:</div>
              <a
                href={props.sound.license}
                target="_blank"
              >
                {props.sound.license.includes('by/') && 'CC BY'}
                {props.sound.license.includes('by-nc/') && 'CC BY-NC'}
                {props.sound.license.includes('zero/') && 'CC0'} 
              </a>
            </div>
            <div className="inline-flex">
              <div className="mr-1 font-semibold uppercase text-gray-400 align-baseline">Created:</div>
              <div>{new Date(props.sound.created).toUTCString().substring(5, 16).replaceAll(" ", ", ")}</div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-2">
          {props.sound.tags.map((tag, i) => <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"obj={tag} key={i}>{tag}</div>)}
        </div>
        <footer className="rounded-b-lg bg-gray-100 text-sm text-gray-500 object-contain">
          <audio
            className="mx-auto w-full yellow-100"
            controls
          >
            <source src={props.sound.mp3link} type="audio/mpeg"/>
            Your browser does not support the audio element.
          </audio> 
        </footer>
      </div>
    </div>
  );
}

export default SoundCard2