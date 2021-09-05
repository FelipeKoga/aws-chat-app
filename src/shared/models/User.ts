class User {
    name: string;

    email: string;

    constructor(user: User) {
        Object.assign(this, user);
    }
}

export default User;
