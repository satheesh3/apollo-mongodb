const { ApolloServer, gql } = require('apollo-server');

//mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const url = 'mongodb://localhost:27017/graphqldb';
mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));
//
const Posts = require('./data-models/posts')
const Comments = require('./data-models/comments')
//typeDefs
const typeDefs = gql`
   type Query {
    info: String!
    feed: [Link!]!
    post(_id: String): Post
    posts: [Post]
    comment(_id: String): Comment
  }
  type Mutation {
    createPost(title: String, content: String): Post
    createComment(postId: String, content: String): Comment
  }
  
  type Link {
    id: ID!
    description: String!
    url: String!
  }
  type Post {
    _id: String
    title: String
    content: String
    comments: [Comment]
  }
  type Comment {
    _id: String
    postId: String
    content: String
    post: Post
  }
`

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

//resolvers
const prepare = (o) => {
    o._id = o._id.toString()
    return o
}

const resolvers = {
    Query: {
        info: () => `I am close`,
        feed: () => links,
        post: async (root, { _id }) => {
            return prepare(await Posts.findOne(ObjectId(_id)))
        },
        posts: async () => {
            const posts = await Posts.find({});
            return posts.map(prepare);
        },
        comment: async (root, { _id }) => {
            return prepare(await Comments.findOne(ObjectId(_id)))
        },
    },
    Post: {
        comments: async ({ _id }) => {
            const comments = await Comments.find({ postId: _id })
            return comments.map(prepare)
        }
    },
    Comment: {
        post: async ({ postId }) => {
            return prepare(await Posts.findOne(ObjectId(postId)))
        }
    },
    Mutation: {
        createPost: async (root, args, context, info) => {
            const res = await Posts.create(args)
            return prepare(res)
        },
        createComment: async (root, args) => {
            const res = await Comments.create(args)
            return prepare(res)
        },
    },
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
    }
}



const server = new ApolloServer({ typeDefs, resolvers, engine:true });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
