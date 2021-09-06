class User {
    name: string;

    email: string;

    password?: string;

    constructor(user: User) {
        Object.assign(this, user);
    }
}

export default User;
