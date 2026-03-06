export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  requiresTwoFactor: boolean;
}

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResendEmailConfirmationRequest {
  email: string;
}

export interface ConfirmEmailChangeRequest {
  userId: string;
  newEmail: string;
  token: string;
}

export interface LoginWith2faRequest {
  twoFactorCode: string;
  rememberMachine: boolean;
}

export interface LoginWithRecoveryCodeRequest {
  recoveryCode: string;
  rememberMe: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface SetPasswordRequest {
  newPassword: string;
}

export interface DeletePersonalDataRequest {
  password: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
}

export interface Enable2faRequest {
  code: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface RemoveExternalLoginRequest {
  loginProvider: string;
  providerKey: string;
}

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isEmailConfirmed: boolean;
  hasPassword: boolean;
}

export interface TwoFactorStatus {
  hasAuthenticator: boolean;
  is2faEnabled: boolean;
  isMachineRemembered: boolean;
  recoveryCodesLeft: number;
}

export interface AuthenticatorSetup {
  sharedKey: string;
  authenticatorUri: string;
}

export interface ExternalLoginsInfo {
  currentLogins: { loginProvider: string; providerDisplayName: string; providerKey: string }[];
  otherLogins: { name: string; displayName: string }[];
  showRemoveButton: boolean;
}

export interface EmailInfo {
  email: string;
  isEmailConfirmed: boolean;
}
