const graphql = require('graphql');
const _ = require('lodash');
const UserModel = require('../model/user-model');
const PetModel = require('../model/pet-model');

const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLList,
    GraphQLID,
    GraphQLString, 
    GraphQLInt,
    GraphQLBoolean
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        mobileNo: { type: GraphQLInt },
        facebookId: { type: GraphQLString },
        pets: {
            type: GraphQLList(PetType),
            resolve(parent, args) {
                return PetModel.find({owner: parent.id});
            }
        }
    })
});

const PetType = new GraphQLObjectType({
    name: 'Pet',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        species: { type: GraphQLString },
        breed: { type: GraphQLString },
        color: { type: GraphQLString },
        neuter: { type: GraphQLBoolean },
        gender: { type: GraphQLString },
        owner: {
            type: UserType,
            resolve(parent, args) {
                return UserModel.findById(parent.owner);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return UserModel.findById(args.id);
            }
        },
        
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return UserModel.find({});
            }
        },
        
        pet: {
            type: PetType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return PetModel.findById(args.id);
            }
        },

        petByName: {
            type: PetType,
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                return PetModel.findOne({name: args.name});
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
                facebookId: { type: GraphQLString },                
                pets: { type: GraphQLID }                
            },
            resolve(parent, args) {
                let user = new UserModel({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    mobileNo: args.mobileNo,
                    facebookId: args.facebookId
                });

                return user.save();
            }
        },
         addPet: {
            type: PetType,
            args: {
                name: { type: GraphQLString },                
                species: { type: GraphQLString },               
                breed: { type: GraphQLString },               
                color: { type: GraphQLString },               
                neuter: { type: GraphQLBoolean },               
                gender: { type: GraphQLString },          
                owner: { type: GraphQLID }          
            },
            resolve(parent, args) {
                let pet = new PetModel({
                    name: args.name,
                    species: args.species,
                    breed: args.breed,
                    color: args.color,
                    neuter: args.neuter,
                    gender: args.gender,
                    owner: args.owner
                });

                return pet.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    types: [PetType],
    query: RootQuery,
    mutation: Mutation
});
