const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

const books = [
  { name: "The Lady with the Dog", genre: "Drama", id: "1", authorId: "1" },
  { name: "Crime and Punishment", genre: "Drama", id: "2", authorId: "3" },
  { name: "Catch 22", genre: "Historical", id: "3", authorId: "2" },
  { name: "The Demons", genre: "Psychological", id: "3", authorId: "3" },
  { name: "A Marriage Proposal", genre: "Drama", id: "3", authorId: "1" }
];

const authors = [
  { name: "Anton Checkov", age: 44, id: "1" },
  { name: "Joseph Heller", age: 34, id: "2" },
  { name: "Fiodor Dostoyevski", age: 67, id: "3" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(`The author parent is ${parent.name}`);
        return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
