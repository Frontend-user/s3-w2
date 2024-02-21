import {UserCreateType, UserEmailEntityType, UserHashType} from "../types/user-types";
import {UserModel, usersCollection} from "../../db";
import {ObjectId} from "mongodb";
import {response} from "express";

export const usersRepositories = {

    async createUser(user: UserEmailEntityType): Promise<false | ObjectId> {
        // const response =  await usersCollection.insertOne(user)
        const response = await UserModel.create(user)
        // await response.save()//
        return response ? response._id : false
        // return response ? response.insertedId : false
    },
    async deleteUser(id: ObjectId) {
        const response = await usersCollection.deleteOne({_id: id})
        return !!response.deletedCount
    }
}