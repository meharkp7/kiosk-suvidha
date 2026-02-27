import { SetMetadata } from "@nestjs/common"

export enum UserRole {
  TENANT = "TENANT",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  KIOSK_USER = "KIOSK_USER",
}

export const ROLES_KEY = "roles"
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
