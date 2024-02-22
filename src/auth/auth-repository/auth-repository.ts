import {tokensCollection, TokenModel, UserModel, usersCollection} from "../../db";
import {AuthType} from "../auth-types/auth-types";
import {nodemailerService} from "../../application/nodemailer-service";
import {v4 as uuidv4} from "uuid";

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
    async recoveryCodeEmailSend(email: string){
        const getUser = await UserModel.findOne({'accountData.email': email})
        if (getUser) {
            const recoveryCode = uuidv4()
                await nodemailerService.sendRecoveryCode(recoveryCode, email)
                return true
        }
        return false
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