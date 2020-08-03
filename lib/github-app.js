const { Octokit } = require('@octokit/core');
const { createAppAuth } = require('@octokit/auth-app');

const getAppCredentials = function getAppCredentials() {
  // Get GitHub App credentials from environment
  const privateKey = Buffer.from(process.env.GITHUB_APP_PRIVATE_KEY, 'base64').toString();
  const id = process.env.GITHUB_APP_ID;
  return { privateKey, id };
};

const getOctokitAppClient = function getOctokitAppClient() {
  // Create new Octokit instance that is authenticated as a GitHub App
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      type: 'app',
      ...getAppCredentials()
    }
  });
};

const getOctokitAppInstallationClient = function getOctokitAppInstallationClient(installationId) {
  // Create new Octokit instance that is authenticated as a GitHub App installation
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      type: 'installation',
      installationId,
      ...getAppCredentials()
    }
  });
};

module.exports = { getOctokitAppClient, getOctokitAppInstallationClient };
