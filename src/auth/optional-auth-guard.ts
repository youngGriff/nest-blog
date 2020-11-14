import { AuthGuard } from "@nestjs/passport";

export class OptiomalAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        return user;
    }
}