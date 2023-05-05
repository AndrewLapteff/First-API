import { UserEntity } from "@app/user/user.entity"

type ProfileTemp = UserEntity & { following: boolean }
export type ProfileType = Omit<ProfileTemp, 'hashPassword'>