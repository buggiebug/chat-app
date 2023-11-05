const data = [
  {
    _id: "653e0fecf618c488b9333205",
    chatName: "sender",
    isGroupChat: false,
    users: [
      {
        _id: "6504ba8cb4994011a7991de9",
        email: "mishrashubh38@gmail.com",
        name: "Shubham",
      },
      {
        _id: "650546e0389d91d2a5fa69e9",
        email: "mutthbaz@gmail.com",
        name: "Bug",
      },
    ],
    createdAt: "2023-10-29T07:55:24.781Z",
    updatedAt: "2023-10-29T07:55:24.781Z",
    __v: 0,
  },
  {
    _id: "653e0f9df618c488b93331e2",
    chatName: "sender",
    isGroupChat: false,
    users: [
      {
        _id: "6504ba8cb4994011a7991de9",
        email: "mishrashubh38@gmail.com",
        name: "Shubham",
      },
      {
        _id: "650ecdacff8e7db9f0bd1d0e",
        email: "bug9369@gmail.com",
        name: "Bug",
      },
    ],
    createdAt: "2023-10-29T07:54:05.913Z",
    updatedAt: "2023-10-29T07:54:05.913Z",
    __v: 0,
  },
  {
    _id: "6511a3f81ce470e4011af03a",
    chatName: "Developer's zone",
    isGroupChat: true,
    users: [
      {
        _id: "650368e4af5e04e2d016f222",
        email: "ravorol243@recutv.com",
        name: "Ravorol",
      },
      {
        _id: "650546e0389d91d2a5fa69e9",
        email: "mutthbaz@gmail.com",
        name: "Bug",
      },
      {
        _id: "650ecbc4ff8e7db9f0bd1ce9",
        email: "yoxeyej735@bnovel.com",
        name: "Rex",
      },
      {
        _id: "650ecdacff8e7db9f0bd1d0e",
        email: "bug9369@gmail.com",
        name: "Bug",
      },
      {
        _id: "6511a1dc1ce470e4011aefff",
        email: "gahoba9852@alvisani.com",
        name: "Gahoba",
      },
      {
        _id: "6504ba8cb4994011a7991de9",
        email: "mishrashubh38@gmail.com",
        name: "Shubham",
      },
    ],
    groupAdmin: "6504ba8cb4994011a7991de9",
    createdAt: "2023-09-25T15:15:04.748Z",
    updatedAt: "2023-10-24T09:44:00.491Z",
    __v: 0,
    latestMessage: null,
  },
  {
    _id: "650b33adcb446eb43108b4ba",
    chatName: "sender",
    isGroupChat: false,
    users: [
      {
        _id: "6504ba8cb4994011a7991de9",
        email: "mishrashubh38@gmail.com",
        name: "Shubham",
      },
      {
        _id: "650368e4af5e04e2d016f222",
        email: "ravorol243@recutv.com",
        name: "Ravorol",
      },
    ],
    createdAt: "2023-09-20T18:02:21.657Z",
    updatedAt: "2023-10-24T09:38:25.516Z",
    __v: 0,
    latestMessage: null,
  },
];

const data2 = {
  _id: "5",
  chatName: "sender",
  isGroupChat: false,
  users: [
    {
      _id: "6504ba8cb4994011a7991de9",
      email: "mishrashubh38@gmail.com",
      name: "Shubham",
    },
    {
      _id: "650546e0389d91d2a5fa69e9",
      email: "mutthbaz@gmail.com",
      name: "Bug",
    },
  ],
  createdAt: "2023-10-29T07:55:24.781Z",
  updatedAt: "2023-10-29T07:55:24.781Z",
  __v: 0,
};

console.log(data.some(e=>e._id === data2._id));
