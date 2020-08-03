const { createGzip } = require('zlib');

const argv = require('minimist')(process.argv.slice(2));

const { getOctokitAppClient, getOctokitAppInstallationClient } = require('./lib/github-app');
const octokit = getOctokitAppClient();

const { encode } = require('./lib/gzip-b64-encode');

(async () => {
  try {
    // We need a nwo parameter...
    if (!argv.nwo) {
      throw new Error('Required: name with owner (--nwo) parameter');
    }
    const [owner, repo] = argv.nwo.split('/');

    if (!argv.sha) {
      throw new Error('Required: sha (--sha) parameter');
    }
    const sha = argv.sha;

    if (!argv.ref) {
      throw new Error('Required: ref (--ref) parameter');
    }
    const ref = argv.ref;

    if (!argv.tool) {
      throw new Error('Required: tool (--tool) parameter');
    }
    const tool = argv.tool;

    // Encode STDIN, we expect the SARIF report to be passed to us over STDIN
    const sarif = await encode(process.stdin);

    // Get the installation
    // https://docs.github.com/en/rest/reference/apps#get-a-repository-installation-for-the-authenticated-app
    const { data: installation } = await octokit.request('GET /repos/{owner}/{repo}/installation', {
      owner,
      repo,
      mediaType: {
        previews: [
          'machine-man'
        ]
      }
    })

    // Generate a client that is tied to this installation
    const github = getOctokitAppInstallationClient(installation.id);

    // Upload the SARIF report
    const response = await github.request('POST /repos/{owner}/{repo}/code-scanning/sarifs', {
      owner,
      repo,
      commit_sha: sha,
      ref,
      sarif,
      tool_name: tool
    });

    console.log(response);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
