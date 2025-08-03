import authRepository from "./auth.repository.js";
import { authService, loginService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";


export const register =async (req, res) => {

    try {
        const validationResult = registerSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
            errors: validationResult.error.errors 
        });
        return;
        }
        const { name, email, password } = req.body;
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User already exists',
            });
            return;
        }

        const newUser = await authService(name, email, password);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }


}
export const login = async (req, res) => {
    try {
        const validationResult = loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: validationResult.error.errors 
            });
            return;
        }

        const { email, password } = req.body;
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        const loginResult = await loginService(email, password);
        if (!loginResult) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: loginResult,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}