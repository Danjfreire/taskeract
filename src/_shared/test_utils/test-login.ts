import { AuthService } from 'src/v1/auth/auth.service';
import { Role } from 'src/v1/auth/decorators/roles.decorator';
import { UsersService } from 'src/v1/users/users.service';

export async function signInForTest(
  authService: AuthService,
  userService: UsersService,
  options?: { userRole: Role; email?: string; password?: string },
) {
  const email = options?.email ?? 'test@email.com';
  const password = options?.password ?? 'password';
  const role = options?.userRole ?? 'worker';

  // Create a user
  const createUserDto = {
    name: 'John Doe',
    email,
    password,
    role,
  };
  await userService.createUser(createUserDto);

  // Sign in
  const signInResponse = await authService.login(email, password);

  return signInResponse;
}
