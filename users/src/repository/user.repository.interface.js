export interface UserRepositoryInterface {
    save(): Promise<any>,

    update(): Promise<any>,

    getUserByUuid(uuid: string): Promise<any>,

    getUsers(uuid: string[]): Promise<any>,

    deleteUser(uuid: string): Promise<any>,

    getUserByEmail(email: string): Promise<any>,

    get(id): Promise<any>,

    getStatusByName(statusName: string): Promise<any>,

    getUserStatus(userId: string): Promise<any>,

    getUserByLogin(username: string, password: string): Promise<any>,

    getPasswordById(userId: string): Promise<any>,

    setUserStatus(userId: string, status: string): Promise<any>,

    updateBio(uuid: string, bio: string): Promise<any>,

    search(param: []): Promise<any>,

    getRoles(): Promise<any>

}
