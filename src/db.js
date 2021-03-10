
const users = [
    {
      id: "1",
      name: "Sara",
      email: "saraha@example.com",
      age: 53,
    },
    {
      id: "2",
      name: "Matt",
      email: "matt@example.com",
    },
    {
      id: "3",
      name: "Bob",
      email: "bob@example.com",
      age: 22,
    },
  ];
  
 const posts = [
    {
      id: "10",
      title: "first post third idea",
      body: "This is my first post, but I cant wait to write a second one",
      published: true,
      author: "1",
    },
    {
      id: "12",
      title: "second post apple",
      body: "This is my second post",
      published: true,
      author: "1",
    },
    {
      id: "3",
      title: "third post",
      body: "This is my third post",
      published: false,
      author: "2",
    },
  ];
  
  const comments = [
    {
      id: "10",
      text: "comment1",
      author: "3",
      post: "1",
    },
    {
      id: "11",
      text: "comment2",
      author: "3",
      post: "1",
    },
    {
      id: "12",
      text: "comment3",
      author: "2",
      post: "2",
    },
    {
      id: "13",
      text: "comment4",
      author: "1",
      post: "1",
    },
  ];

  const db ={
      users, 
      posts, 
      comments
  }

  export {db as default}