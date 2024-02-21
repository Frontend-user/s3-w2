import {UserCreateType, UserEmailEntityType, UserHashType} from "../types/user-types";
import {UserModel, usersCollection} from "../../db";
import {ObjectId} from "mongodb";
import {response} from "express";

export const usersRepositories = {

    async createUser(user: UserEmailEntityType): Promise<false | ObjectId> {
        const response =  await usersCollection.insertOne(user)
        // const response = new UserModel(user)
        // await response.save()
        // return response ? response._id : false
        return response.insertedId
    },
    async deleteUser(id: ObjectId) {
        const response = await UserModel.deleteOne({_id: id})
        return !!response.deletedCount
    }
}