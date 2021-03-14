import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "PRISMAPASS"
});

export { prisma as default }

//prisma.query  prisma.mutation  prisma.subscription  prisma.exists

//1. Create a new post
//2. Fetch all of the info about the user(author)

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });
//   if (!userExists) {
//     throw new Error("User not found");
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     "{ author {id name email posts {id title published}} }"
//   );

//   return post.author;
// };

// createPostForUser("ckly0h6za00no0995s9znuiqz", {
//   title: "Recipe Book",
//   body: "Food",
//   published: true,
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

//Create "updatePostForUser" that accepts postId & data
//Update the post (get author id back)

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId});
//     if (!postExists) {
//       throw new Error("Post not found");
//     }
//   const updatedPost = await prisma.mutation.updatePost(
//     {
//       where: { id: postId },
//       data,
//     },
//     "{ author {id name email posts{ id title body published}}} "
//   );

//   return updatedPost.author;
// };

// updatePostForUser('cklz80avp001h099590q1bffv', {
//     title: "Brand New Title"
// }).then((user) =>{
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error)=>{
//     console.log(error.message)
// })

//old .then version

// prisma.mutation.createPost({
//     data: {
//         title: "GraphQL101",
//         body: "",
//         published: false,
//         author: {
//             connect: {
//                 id: "ckly1zmgf019p0995qob1dg74"
//             }
//         }
//     }
// }, '{ id title body published}').then((data)=>{
//     console.log(data)
//     return prisma.query.users(null, '{ id name posts {id title}}')

// }).then ((data) =>{
//     console.log(JSON.stringify(data, undefined, 2))
// })

//.then promise method
// prisma.mutation.updatePost({
//     data: {
//         body: "This post now has a body",
//         published: true,
//     },
//     where: {
//         id: "cklz6k2cy000y09952v4yx5wx"
//     }

// }, '{ id title body published}').then((data) => {
//     console.log(data)
//     return prisma.query.posts(null, '{id title body published}')
// }).then((data) =>{
//     console.log(JSON.stringify(data, undefined, 2))
// })
