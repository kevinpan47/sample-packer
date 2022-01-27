const effects = [
  {
    name: 'delay',
    types: [
      {
        name: 'chorus',
        params: [
          {
            name: 'delayTime',
            range: [2, 20]  // measured in ms
          },
          {
            name: 'depth',
            range: [0, 1]
          },
          {
            name: 'wet',
            range: [0,1]
          }
        ]
      },
    ]
  },
  {
    name: 'distortion',
    types: [
      {
        name: 'distortion',
        params: [
          {
            name: 'distortion',
            range: [0, 1]
          },
          {
            name: 'wet',
            range: [0, 1]
          }
        ]
      },
      {
        name: 'chebyshev',
        params: [
          {
            name: 'order',
            range: [0, 100]
          },
          {
            name: 'wet',
            range: [0, 1]
          }
        ]
      }
    ]
  },
  {
    name: 'reverb',
    types: [
      {
        name: 'Freeverb',
        params: [
          {
            name: 'roomSize',
            range: [0, 1]
          },
          {
            name: 'wet',
            range: [0,1]
          },
        ]
      },
      {
        name: 'Reverb',
        params: [
          {
            name: 'decay',
            range: time
          },
          {
            name: 'wet',
            range: [0,1]
          },
        ]
      }
    ]
    
  },
]