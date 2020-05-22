import { uuid } from 'uuidv4';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private users: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(UserToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.users.push(userToken);
    return userToken;
  }
}

export default FakeUserTokensRepository;
