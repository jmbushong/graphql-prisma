import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken");
    }

    return prisma.mutation.createUser({ data: args.data }, info);
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("User not found");
    }

    return prisma.mutation.deleteUser(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updateUser(parents, args, { prisma }, info) {
    return prisma.mutation.updateUser({
      where:{
        id: args.id
      },
      data: args.data
    }, info)
   
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    if (!userExists) {
      throw new Error("User not found");
    }
    if (!postExists) {
      throw new Error("Post not found");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
      // text: args.text,
      // author: args.author,
      // post: args.post
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const deletedComment = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment[0].post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment[0],
      },
    });

    return deletedComment[0];
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => comment.id === args.id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof args.data.text === "string") {
      comment.text = args.data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },

 async createPost(parent, args, { prisma}, info) {
   const postExists = await prisma.exists.Post({id: args.id})

   if(!postExists){
     throw new Error ("Post not found")
   }

   return prisma.mutation.createPost({data: {
     title: args.data.title,
     body: args.data.body,
     published: args.data.published,
     author: {
       connect: {
         id: args.data.author
       }
     }
     

   }}, info)
   
  },

  async deletePost(parent, args, { prisma }, info) {
    const postExists = await prisma.exists.Post({ id: args.id });

    if (!postExists) {
      throw new Error("Post not found");
    }

    return prisma.mutation.deletePost({where: {
      id: args.id
    }}, info)


  },

 async updatePost(parent, args, { prisma }, info) {
   const postExists = await prisma.exists.Post({id: args.id });
   if(!postExists){
     throw new Error ("Post not found")
   }

   return prisma.mutation.updatePost({
     where:{
       id: args.id
     },
     data: args.data
   }, info)

  },
};

export { Mutation as default };
