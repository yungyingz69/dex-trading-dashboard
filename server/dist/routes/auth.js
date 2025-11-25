import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export async function authRoutes(fastify) {
    // Register
    fastify.post('/register', async (request, reply) => {
        try {
            const body = registerSchema.parse(request.body);
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email: body.email },
            });
            if (existingUser) {
                return reply.status(400).send({ error: 'Email already registered' });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(body.password, 10);
            // Create user
            const user = await prisma.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            });
            // Generate token
            const token = fastify.jwt.sign({ userId: user.id, email: user.email });
            reply
                .setCookie('token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
                .send({ user, token });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: error.issues });
            }
            throw error;
        }
    });
    // Login
    fastify.post('/login', async (request, reply) => {
        try {
            const body = loginSchema.parse(request.body);
            // Find user
            const user = await prisma.user.findUnique({
                where: { email: body.email },
            });
            if (!user) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }
            // Verify password
            const validPassword = await bcrypt.compare(body.password, user.password);
            if (!validPassword) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }
            // Generate token
            const token = fastify.jwt.sign({ userId: user.id, email: user.email });
            reply
                .setCookie('token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
                .send({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                token,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: error.issues });
            }
            throw error;
        }
    });
    // Logout
    fastify.post('/logout', async (request, reply) => {
        reply
            .clearCookie('token', { path: '/' })
            .send({ message: 'Logged out successfully' });
    });
    // Get current user
    fastify.get('/me', {
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        const user = await prisma.user.findUnique({
            where: { id: request.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                currency: true,
                language: true,
                createdAt: true,
            },
        });
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }
        return { user };
    });
}
//# sourceMappingURL=auth.js.map