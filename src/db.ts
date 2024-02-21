import {MongoClient} from 'mongodb'
import {BlogCreateType, BlogEntityType} from "./common/types/blog-type";

import dotenv from 'dotenv'
import {PostCreateType, PostEntityType} from "./common/types/post-type";
import {UserCreateType, UserEmailEntityType, UserHashType} from "./users/types/user-types";
import mongoose from "mongoose";

dotenv.config()
const url = process.env.MONGO_URL

if(!url){
    throw new Error('! Url doesn\'t found')
}

console.log('url',url)


export const client = new MongoClient(url)
export const blogsCollection = client.db('db').collection<BlogEntityType | BlogCreateType>('blogs')
export const postsCollection = client.db('db').collection<PostEntityType | PostCreateType>('posts')
export const usersCollection = client.db('db').collection<UserEmailEntityType>('users')
export const commentsCollection = client.db('db').collection('comments')
export const tokensCollection = client.db('db').collection('tokens')
export const devicesCollection = client.db('db').collection('devices')

const userSchema = new mongoose.Schema<UserEmailEntityType>({
    accountData:{
        login: String,
        email: String,
        createdAt: String,
    },
    passwordSalt: String,
    passwordHash: String,
    emailConfirmation:{
        confirmationCode: String,
        expirationDate: Date || String
    },
    isConfirmed: Boolean,
    isCreatedFromAdmin: Boolean
    // userName: {type: String,, required: true},
    // bio: String,,
    // addedAt: Date,
    // avatars: {type: [{
    //         src: {type: String,, required: true},
    //         addedAt: {type: Date, required: true}
    //     }], required: true}
});

export const UserModel = mongoose.model('users', userSchema);
export const  runDb = async () =>{
    try {

        let dbName = "db";
        await mongoose.connect(url + "/" + dbName);
        await client.connect();
        await client.db('blogs').command({ping: 1});
        console.log('Connect successfully to mongo server')


    }catch(e) {

        console.log('DONT connect successfully to mongo server')
        await mongoose.disconnect()
        await client.close()
    }
}