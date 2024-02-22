import {tokensCollection, TokenModel, UserModel, usersCollection, RecoveryCodeModel} from "../../db";
import {AuthType} from "../auth-types/auth-types";
import {nodemailerService} from "../../application/nodemailer-service";
import {v4 as uuidv4} from "uuid";
import {UserEmailEntityType} from "../../users/types/user-types";
import * as repl from "repl";
import {ObjectId} from "mongodb";

export const authRepositories = {

    async authUser(auth: AuthType): Promise<boolean> {
        const response = await UserModel.find({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]})
        return !!response
    },
    async getUserHash(auth: AuthType) {
        const response = await UserModel.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]})
        return response ? response : false
    },
    async getUserIdByAutData(auth: AuthType) {
        const response = await UserModel.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]})
        return response ? response : false
    },
    async getConfirmCode(code: string): Promise<boolean> {
        const getUser = await UserModel.findOne({'emailConfirmation.confirmationCode': code})
        if (getUser) {
            const respUpdate = await UserModel.updateOne({_id: getUser._id},
                {isConfirmed: true}
            )
            return respUpdate.modifiedCount === 1
        }
        return false
    },
    async addUnValidRefreshToken(refreshToken: string) {
        return await TokenModel.create({refreshToken: refreshToken})
    },

    async getUnValidRefreshTokens() {
        const tokens = await TokenModel.find({}).lean()
        return tokens
    },
    async recoveryCodeEmailSend(email: string) {
        const getUser = await UserModel.findOne({'accountData.email': email})
        console.log(getUser, 'getUser')
        let id: ObjectId | null = getUser ? getUser._id : null
        if (id) {
            const recoveryCode = uuidv4()
            await RecoveryCodeModel.create(
                {
                    email,
                    recoveryCode,
                    userId: id
                }
            )
            let RecoveryCodeModels = await RecoveryCodeModel.find({}).lean()
            console.log(RecoveryCodeModels, 'RecoveryCodeModels')
            const getUser = await UserModel.findOne({'accountData.email': email})

            await nodemailerService.sendRecoveryCode(recoveryCode, email)
            return true
        }
        return false
    },
    async createNewPassword(newPassword: any) {

    },
    async registrationEmailResending(email: string) {
        const getUser = await UserModel.findOne({'accountData.email': email})
        if (getUser) {
            const newCode = uuidv4()
            const respUpdate = await UserModel.updateOne({_id: getUser._id},
                {'emailConfirmation.confirmationCode': newCode}
            )
            if (respUpdate.matchedCount === 1) {
                await nodemailerService.send(newCode, email)
                return true
            } else {
                return false
            }

        }
        return false
    },

}