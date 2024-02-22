import {ObjectId} from "mongodb";
import {PostCreateType, PostUpdateType} from "../../common/types/post-type";
import {PostModel} from "../../db";




export const postsRepositories = {

    async createPost(post:PostCreateType): Promise<false | ObjectId> {
        const response = await PostModel.create(post)
        return response._id ? response._id: false
    },

    async updatePost(id:ObjectId, updatePost:PostUpdateType): Promise<boolean> {
        const response = await PostModel.updateOne({_id: id},  updatePost)
        return response.matchedCount === 1;
    },


    async deletePost(id: ObjectId): Promise<boolean> {
        const response = await PostModel.deleteOne({_id: id})
        return !!response.deletedCount;
    },

}