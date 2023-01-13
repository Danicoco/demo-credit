import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export const hashPassword = (value: string) => {
    const salt = genSaltSync(10);
    const encryption = hashSync(value, salt);
    return encryption;
}

export const matchPassword = (value: string, hash: string) => {
    const isValid = compareSync(value, hash);
    return isValid;
}
