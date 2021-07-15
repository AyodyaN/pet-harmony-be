const graphql = require('graphql');
const _ = require('lodash');
const UserModel = require('../model/user-model');
const PetModel = require('../model/pet-model');
const PetType = require('./schema1');
// console.log("++++", PetType.getType('Pet').getFields());
console.log("++++", PetType._typeMap);
const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLID,
    GraphQLString, 
    GraphQLInt
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        mobileNo: { type: GraphQLInt },
        // pets: {
        //     type: GraphQLList(PetType.getType('Pet')),
        //     resolve(parent, args) {
        //         return PetModel.find({owner: parent.id});
        //     }
        // }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return UserModel.findById(args.id);
            }
        },
        
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return UserModel.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },                
                lastName: { type: GraphQLString },               
                email: { type: GraphQLString },               
                mobileNo: { type: GraphQLInt },                
                pets: { type: GraphQLID }                
            },
            resolve(parent, args) {
                let user = new UserModel({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    mobileNo: args.mobileNo
                });

                return user.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
