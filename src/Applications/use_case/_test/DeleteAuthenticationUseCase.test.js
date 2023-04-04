const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');

describe('DeleteAuthenticationUseCase', () => {
	it('should throw error if use case payload not contain refresh token', async () => {
		// Arrange
		const useCasePayload = {};
		const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

		// Action and Assert
		await expect(deleteAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
			'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
		);
	});

	it('should throw error if refresh token not string', async () => {
		// Arrange
		const useCasePayload = {
			refreshToken: 123,
		};
		const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

		// Action and Assert
		await expect(deleteAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
			'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
		);
	});

	it('should orchestrating the delete authentication action correctly', async () => {
		// Arrange
		const useCasePayload = {
			refreshToken: 'refreshToken',
		};
		const mockAuthenticationsRepository = new AuthenticationRepository();
		mockAuthenticationsRepository.checkAvailabilityToken = jest
			.fn()
			.mockImplementation(() => Promise.resolve());
		mockAuthenticationsRepository.deleteToken = jest
			.fn()
			.mockImplementation(() => Promise.resolve());

		const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
			authenticationRepository: mockAuthenticationsRepository,
		});

		// Action
		await deleteAuthenticationUseCase.execute(useCasePayload);

		// Assert
		expect(mockAuthenticationsRepository.checkAvailabilityToken).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
		expect(mockAuthenticationsRepository.deleteToken).toHaveBeenCalledWith(
			useCasePayload.refreshToken
		);
	});
});
