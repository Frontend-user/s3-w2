import {BlogModel, blogsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {BlogCreateType, BlogUpdateType} from "../../common/types/blog-type";


export const blogsRepositories = {

    async createBlog(blog: BlogCreateType): Promise<false | ObjectId> {
        try {
            const response = await blogsCollection.insertOne(blog)
            return response ? response.insertedId : false

        }
    catch (e){
        console.log(e,'er')
            return false
    }
    },

    async updateBlog(id: ObjectId, updateBlog: BlogUpdateType): Promise<boolean> {
        const response = await blogsCollection.updateOne({_id: id}, {$set: updateBlog})
        return response.matchedCount === 1;
    },


    async deleteBlog(id: ObjectId): Promise<boolean> {
        const response = await blogsCollection.deleteOne({_id: id})
        return !!response.deletedCount;
    },

}