# :rocket: GitHub App Upload SARIF
## Usage

```shell
cat output.sarif.json | node ./index.js \
  --nwo=$OWNER/$REPO \
  --sha=$COMMIT_SHA \
  --ref=$REF \
  --tool=$TOOL
```
