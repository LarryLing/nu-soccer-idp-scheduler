import { Request, Response, NextFunction } from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

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

        res.redirect("/")
    } catch (error) {
        res.redirect('/signin')
    }
}

export function signin(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

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

        res.redirect('/');
    } catch (error) {
        res.redirect("/signin")
    }
}


export function signout(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = getAuth();

        signOut(auth);

        res.redirect("/signin")
    } catch (error) {
        console.log(error);
    }
}