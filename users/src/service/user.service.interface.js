export interface UserServiceInterface {
  setUserStatus(userId: string, status: string): Promise<void>
}
