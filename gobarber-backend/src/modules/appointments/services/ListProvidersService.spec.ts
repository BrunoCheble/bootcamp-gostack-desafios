import 'reflect-metadata';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeCacheProvider: FakeCacheProvider;
let fakeUserRepository: FakeUserRepository;
let listProviders: ListProvidersService;

describe('listProviders', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeUserRepository = new FakeUserRepository();
    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the providers', async () => {
    const userDoe = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userTre = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123456',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([userDoe, userTre]);
  });
});
