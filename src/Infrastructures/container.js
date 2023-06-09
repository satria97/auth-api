/* istanbul ignore file */
const { createContainer } = require('instances-container');

// External agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// Service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const JwtTokenManager = require('./security/JwtTokenManager');

// Use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');

// Creating container
const container = createContainer();

// Registering services and repository
container.register([
	{
		key: UserRepository.name,
		Class: UserRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: AuthenticationRepository.name,
		Class: AuthenticationRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
			],
		},
	},
	{
		key: PasswordHash.name,
		Class: BcryptPasswordHash,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt,
				},
			],
		},
	},
	{
		key: AuthenticationTokenManager.name,
		Class: JwtTokenManager,
		parameter: {
			dependencies: [
				{
					concrete: Jwt.token,
				},
			],
		},
	},
]);

// Regitering use case
container.register([
	{
		key: AddUserUseCase.name,
		Class: AddUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LoginUserUseCase.name,
		Class: LoginUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'authenticationTokenManager',
					internal: AuthenticationTokenManager.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LogoutUserUseCase.name,
		Class: LogoutUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
			],
		},
	},
	{
		key: RefreshAuthenticationUseCase.name,
		Class: RefreshAuthenticationUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'authenticationTokenManager',
					internal: AuthenticationTokenManager.name,
				},
			],
		},
	},
]);

module.exports = container;
