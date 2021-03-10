import uuidv4 from "uuid/v4";

//Enum
//1. A special type that defines a set of constants
//2. This type can then be used as the type for a field (similar to scalar and custom object types)
//3. Values for the field must be one of the constants for the type

//UserRole- standard, editor, admin

// type User{
// role: UserRole!
// }

//laptop.isOn -- true --false
//laptop.powerStatus - on - off - sleep

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }
    //delete user- returns array of objects --in this case just one
    const deletedUsers = db.users.splice(userIndex, 1);

    //remove all associated posts & comments- only keeping posts that do not belong to the user
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      //if the comment belongs to the post that was just deleted--it gets deleted
      if (match) {
        db.comments = comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });

    //remove all comments that this user has created
    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers[0];
  },
  updateUser(parents, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
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
      data: comment
    }})


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
      data: deletedComment[0]
    }})

    return deletedComment[0];
  },

  updateComment(parent, args, { db, pubsub }, info){
    const comment= db.comments.find((comment) => comment.id === args.id)

    if(!comment){
        throw new Error ('Comment not found')
    }

    if(typeof args.data.text === "string"){
        comment.text= args.data.text
      

    }

    pubsub.publish(`comment ${comment.post}`, { 
      comment: {
      mutation: "UPDATED",
      data: comment
    }})
    

    return comment

  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
      // title: args.title,
      // body: args.body,
      // published: args.published,
      // author: args.author
    };

    db.posts.push(post);

    if(args.data.published){
      pubsub.publish('post', {
        post: {
          mutation: "CREATED",
          data: post
        }
      })
    }
  

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    //delete post
    //returns array of objects (in this case just one)
    const deletedPosts = db.posts.splice(postIndex, 1);

    //remove all associated comments
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if(deletedPosts[0].published){
      pubsub.publish('post', {
        post:{
          mutation: 'DELETED',
          data: deletedPosts[0]
        }
      })

    }

    return deletedPosts[0];
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const post = db.posts.find((post) => post.id === args.id);
    const originalPost= {...post}

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof args.data.title === "string") {
      post.title = args.data.title;
    }

    if (typeof args.data.body === "string") {
      post.body = args.data.body;
    }

    if (typeof args.data.published === "boolean") {
      post.published = args.data.published;

      if(originalPost.published && !post.published){
        //deleted 
        pubsub.publish('post', {
          post:{
            mutation: "DELETED",
            data: originalPost
          }
        })

      }else if(!originalPost.published && post.published) {
        //created
         //deleted 
         pubsub.publish('post', {
          post:{
            mutation: "CREATED",
            data: post
          }
        })
      }else if(post.published) {
        //updated
        pubsub.publish('post', {
          post:{
            mutation: "UPDATED",
            data: post
          }
        })

      }


    }

    return post;
  },
};

export { Mutation as default };
