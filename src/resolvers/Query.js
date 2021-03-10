const Query = {
    
    users(parent, args, { prisma }, info) {
      const opArgs= {}

      if(args.query){
        opArgs.where = {
          OR:[{
            name_contains: args.query

          }, {
            email_contains: args.query
          }]
          
        }
      }

      return prisma.query.users(opArgs, info)
      //second arg- nothing, string object

        // if (!args.query) {
        //   return db.users;
        // }
  
        // return db.users.filter((user) => {
        //   return user.name.toLowerCase().includes(args.query.toLowerCase());
        // });
      },
      comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info);
      },
      posts(parent, args, { prisma }, info) {
        const opArgs={}

        if(args.query){
          opArgs.where={
            OR:[{
              title_contains: args.query
            },{
              body_contains: args.query
            }]
          }
       
        }

        return prisma.query.posts(opArgs, info)

        // if (!args.query) {
        //   return db.posts;
        // }
        // return db.posts.filter((post) => {
        //   let isTitleMatch = post.title
        //     .toLowerCase()
        //     .includes(args.query.toLowerCase());
        //   let isBodyMatch = post.body
        //     .toLowerCase()
        //     .includes(args.query.toLowerCase());
        //   return isTitleMatch || isBodyMatch;
        // });
      },
      me() {
        return {
          id: "123098",
          name: "Mike",
          email: "mike@example.com",
        };
      },
      post() {
        return {
          id: "54321",
          title: "Best Day Ever",
          body: "What a wonderful day!",
          published: true,
        };
      },
}

export { Query as default}