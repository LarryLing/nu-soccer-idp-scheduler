import { Request, Response, NextFunction } from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export function registerUser(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            res.status(200).send("User registered");
        })
        .catch((err) => {
            const errorCode = err.statusCode || 500;
            const errorMessage = err.message;
            res.status(errorCode).send(errorMessage);
        })
}

export function signinUser(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            res.status(200).send("User registered");
        })
        .catch((err) => {
            const errorCode = err.statusCode || 500;
            const errorMessage = err.message;
            res.status(errorCode).send(errorMessage);
        })
}
